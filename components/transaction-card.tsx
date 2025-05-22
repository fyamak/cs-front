import { ITransaction } from "@/types/product-types";
import { Card, Text} from "@mantine/core";

export default function TransactionCard(transaction : ITransaction) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder className="mb-4">
      <Text><strong>Product: </strong>{transaction.product}</Text>
      <Text><strong>Organization: </strong>{transaction.organization}</Text>
      <Text><strong>Type: </strong>{transaction.type}</Text>
      <Text><strong>Price: </strong>{transaction.price}</Text>
      <Text><strong>Date: </strong>{transaction.date}</Text>
      <Text><strong>Quantity: </strong>{transaction.quantity}</Text>
      <Text><strong>Remaining: </strong>{transaction.remainingQuantity}</Text>
    </Card>
  );
}
