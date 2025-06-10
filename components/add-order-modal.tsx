import { Modal, Button, Select, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateTimePicker } from '@mantine/dates';
import { postData } from "@/utils/api";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import UseFetchProducts from "@/hooks/use-fetch-products";
import UseFetchOrganizations from "@/hooks/use-fetch-organizations";

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (message: string, status: "success" | "error" | null) => void,
};

const PAGE_SIZE = 20;

export default function AddOrderModal({ isOpen, onClose, onSubmit }: Props) {  
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingOrganization, setLoadingOrganization] = useState(false);
  
  const [searchProduct, setSearchProduct] = useState("");
  const [searchProductDebounce] = useDebounce(searchProduct, 1000);
  const [searchOrganization, setSearchOrganization] = useState("");
  const [searchOrganizationDebounce] = useDebounce(searchOrganization, 1000);
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>("");
  

  const { pagedProductsResponse, fetchPagedProducts } = UseFetchProducts();
  const { pagedOrganizations, fetchPagedOrganizations } = UseFetchOrganizations();
  

  const productOptions = pagedProductsResponse?.data.map((p) => ({
    value: p.id.toString(), 
    label: p.name,
  }));

  const organizationOptions = pagedOrganizations?.map((o) => ({
    value: o.id.toString(), 
    label: o.name,
  }));

  useEffect(() => {
    setLoadingProduct(true);
  }, [searchProduct]);

  useEffect(() => {
    if (isOpen) {
      fetchPagedProducts(1,PAGE_SIZE, searchProductDebounce).finally(() =>
        setLoadingProduct(false)
      );
    }
  }, [isOpen, searchProductDebounce]);


  useEffect(() => {
    setLoadingOrganization(true);
  }, [searchOrganization]);

  useEffect(() => {
    if (isOpen) {
      fetchPagedOrganizations(1,PAGE_SIZE, searchOrganizationDebounce).finally(() =>
        setLoadingOrganization(false)
      );
    }
  }, [isOpen, searchOrganizationDebounce]);


  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      quantity: null,
      price: null,
      date: null,
      orderType: null,
    },
  });

  const handleSubmit = async (formData: any) => {
    try {
        const res = await postData("orders", {
            productId: selectedProduct,
            organizationId : selectedOrganization,
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
          data={productOptions}
          value={selectedProduct}
          onChange={setSelectedProduct}
          onSearchChange={setSearchProduct}
          searchable
          clearable
          required
          mb={"md"}
          nothingFoundMessage={
            loadingProduct ? ( "Loading...") : ( "No products found" )
          }
        />

        <Select
          label="Organization"
          placeholder="Select Organization"
          limit={20}
          data={organizationOptions}
          value={selectedOrganization}
          onChange={setSelectedOrganization}
          onSearchChange={setSearchOrganization}
          searchable
          clearable
          required
          mb={"md"}
          nothingFoundMessage={
            loadingOrganization ? ( "Loading...") : ( "No organization found" )
          }
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
          placeholder="01/01/2025 00:00"
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
