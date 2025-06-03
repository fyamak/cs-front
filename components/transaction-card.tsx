import { ITransaction } from "@/types/product-types";
import { Card, Text} from "@mantine/core";

export default function TransactionCard(transaction : ITransaction) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder className="mb-4">
      <Text><strong>Product: </strong>{transaction.productName}</Text>
      <Text><strong>Organization: </strong>{transaction.organizationName}</Text>
      <Text><strong>Quantity: </strong>{transaction.quantity}</Text>
      <Text><strong>Price: </strong>{transaction.price}</Text>
      <Text><strong>Date: </strong>{transaction.date}</Text>
      <Text><strong>Type: </strong>{transaction.type}</Text>
      <Text><strong>Detail: </strong>{transaction.detail}</Text>
    </Card>
  );
}
