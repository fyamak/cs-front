import { IOrderHistoryCard } from "@/types/order-types";
import { Card, Text, Badge, Divider, Group } from "@mantine/core";

export default function OrderHistoryCard(order: IOrderHistoryCard) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb={"xs"}>
        <Badge size="lg" color={"gray"}>
          {order.type}
        </Badge>
        <Badge size="lg" color={order.isSuccessfull ? "green" : "red"}>
          {order.isSuccessfull ? "Successful" : "Failed"}
        </Badge>
      </Group>

      <Text>
        <strong>Detail:</strong> {order.detail}
      </Text>

      <Divider my="xs" />

      <Text mb={"sm"} size="sm">
        <strong>Product:</strong> {order.productName}
      </Text>

      <Text mb={"sm"} size="sm">
        <strong>Organization:</strong> {order.organizationName}
      </Text>

      <Text mb={"sm"} size="sm">
        <strong>Quantity:</strong> {order.quantity}
      </Text>

      <Text mb={"sm"} size="sm">
        <strong>Price:</strong> {order.price}
      </Text>
    </Card>
  );
}
