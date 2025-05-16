import { IOrderCard } from "@/types/order-types";
import { Card, Text, Group, Button} from "@mantine/core";
import { Check, X } from "lucide-react";


export default function OrderCard(order : IOrderCard) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder className="mb-4">
      <Text><strong>Product: </strong>{order.productName}</Text>
      <Text><strong>Organization: </strong>{order.organizationName}</Text>
      <Text><strong>Quantity: </strong>{order.quantity}</Text>
      <Text><strong>Price: </strong>{order.price}</Text>
      <Text><strong>Date: </strong>{order.date}</Text>
      <Text><strong>Type: </strong>{order.type}</Text>

      <Group mt="md" justify="space-between">
        <Button
          color="green"
          leftSection={<Check size={18} />}
          onClick={() => order.onApprove(order.id)}
          loading={order.isProcessing}
        >
          Approve
        </Button>
        <Button
          color="red"
          leftSection={<X size={18} />}
          onClick={() => order.onReject(order.id)}
          loading={order.isProcessing}
        >
          Reject
        </Button>
      </Group>
    </Card>
  );
}
