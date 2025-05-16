import { Modal, Button, Select, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IProduct } from "@/types/product-types";
import { IOrganization } from "@/types/organization-types";
import { DateTimePicker } from '@mantine/dates';
import { postData } from "@/utils/api";

type Props = {
  isOpen: boolean,
  products: IProduct[],
  organizations: IOrganization[],
  onClose: () => void,
  onSubmit: (message: string, status: "success" | "error" | null) => void,
};

export default function AddOrderModal({ isOpen, products, organizations, onClose, onSubmit }: Props) {  
  const productOptions = products.map((p) => ({
    value: p.id.toString(), 
    label: p.name,
  }));

  const organizationOptions = organizations.map((o) => ({
    value: o.id.toString(), 
    label: o.name,
  }));

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      selectedProduct: null,
      selectedOrganization: null,
      quantity: null,
      price: null,
      date: null,
      orderType: null,
    },
  });

  const handleSubmit = async (formData: any) => {
    try {
        const res = await postData("orders", {
            productId: formData.selectedProduct,
            organizationId : formData.selectedOrganization,
            quantity: formData.quantity,
            price: formData.price,
            date: formData.date,
            type: formData.orderType
        });
        const response = res.data

        if (response.status === "Success") {
          onSubmit(response.message, "success")
        } else {
          onSubmit(response.message, "error")
            
        }
    } catch (error) {
      onSubmit("", "error")
    }
  }


  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<div className="font-bold text-xl">Add Product</div>}
      size={"lg"}
    >
      <form
        // onSubmit={form.onSubmit((values) =>
        //   console.log(JSON.stringify(values, null, 2))
        // )}
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values)
          form.reset();
          onClose();
        })}
      >
        <Select
          label="Product"
          placeholder="Select Product"
          limit={20}
          data={productOptions}
          searchable
          clearable
          required
          mb={"md"}
          key={form.key('selectedProduct')}
          {...form.getInputProps('selectedProduct')}
        />

        <Select
          label="Product"
          placeholder="Select Product"
          limit={20}
          data={organizationOptions}
          searchable
          clearable
          required
          mb={"md"}
          key={form.key('selectedOrganization')}
          {...form.getInputProps('selectedOrganization')}
        />
        
        <NumberInput
          label="Quantity" 
          placeholder="0" 
          hideControls 
          required
          mb={"md"}
          key={form.key('quantity')}
          {...form.getInputProps('quantity')}
        />
        
        
        <NumberInput
          label="Price" 
          placeholder="0.00" 
          decimalScale={2}
          hideControls 
          required
          mb={"md"}
          key={form.key('price')}
          {...form.getInputProps('price')}
        />

        <DateTimePicker
          label="Date"
          placeholder="01/01/1970 00:00"
          clearable
          required
          mb={"md"}
          key={form.key('date')}
          {...form.getInputProps('date')}
        />

        <Select
          label="Order Type"
          placeholder="Select order type"
          data={[{value:"supply" , label:'Supply'}, {value:"sale" , label:'Sale'}]}
          required
          key={form.key('orderType')}
          {...form.getInputProps('orderType')}
        />

        <div className="text-center">
          <Button type="submit" mt="md">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
