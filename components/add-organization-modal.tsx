import { IAddOrganizationForm } from "@/types/organization-types";
import { Modal, TextInput, Button, InputBase } from "@mantine/core";
import { useForm } from "@mantine/form";
import {useMediaQuery } from "@mantine/hooks";
import { IMaskInput } from 'react-imask';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IAddOrganizationForm) => void;
};

export default function AddOrganizationModal({isOpen, onClose, onSubmit }: Props) {
  const isMobile = useMediaQuery("(max-width: 50em)");
  
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: ""
    },  
  });


  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<div className="font-bold text-xl">Add Organization</div>}
      fullScreen={isMobile}
      size={"lg"}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          form.reset();
          onClose();
        })}
      >
        <TextInput
          label="Name"
          placeholder="Jhon Due"
          key={form.key("name")}
          {...form.getInputProps("name")}
          role="presentation" 
          autoComplete="off"
          required
        />
        <TextInput
          label="email"
          placeholder="johndue@example.com"
          mt="md"
          key={form.key("email")}
          {...form.getInputProps("email")}
          role="presentation" 
          autoComplete="off"
          required
        />
        <InputBase
            label="Phone"
            placeholder="(xxx) xxx-xxxx"
            component={IMaskInput}
            mask={"(000) 000-0000"}
            mt="md"
            key={form.key("phone")}
            {...form.getInputProps("phone")}
            role="presentation" 
            autoComplete="off"
            required
        />
        <TextInput
          label="Address"
          placeholder="Address"
          mt="md"
          key={form.key("address")}
          {...form.getInputProps("address")}
          role="presentation" 
          autoComplete="off"
          required
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
