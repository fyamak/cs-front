import { IOrganization } from "@/types/organization-types";
import { deleteData } from "@/utils/api";
import { Card, Text, Badge, Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";

type Props = {
  organization: IOrganization;
  onDeleted?: () => void;
};

export default function OrganizationCard({ organization, onDeleted }: Props) {
  const handleDelete = async (id: number) => {
    modals.openConfirmModal({
      title: "Delete Organization",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this organization? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      // onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        try {
          await deleteData(`api/organization/${id}`);
          if (onDeleted) {
            onDeleted(); 
          }
        } catch (error) {
          console.error("Error deleting organization:", error);
        }
      },
    });
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ position: "relative" }}
    >
      <Button
        variant="light"
        color="red"
        size="xs"
        style={{ position: "absolute", top: 10, right: 10 }}
        onClick={() => handleDelete(organization.id)}
      >
        Delete
      </Button>

      <Text fw={600} mb="xs">
        {organization.name}
      </Text>

      <Text size="sm" c="dimmed" mb="sm">
        📧 {organization.email}
      </Text>
      <Text size="sm" c="dimmed" mb="xs">
        📞 {organization.phone}
      </Text>
      <Text size="sm" c="dimmed" mb="xs">
        📍 {organization.address}
      </Text>

      {/* <Button color="blue" fullWidth mt="md" radius="md">
        View Details
      </Button> */}
    </Card>
  );
}
