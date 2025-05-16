import { IProductCard } from "@/types/product-types";
import { Card, Text, Badge, Divider} from "@mantine/core";

export default function ProductCard(product : IProductCard) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>

      <Text fw={500}>{product.name}</Text>

      <Divider my="xs" />
      
      <Text mb={"sm"} size="sm">
       <strong>SKU:</strong> {product.sku}
      </Text>

      <Text mb={"sm"} size="sm">
       <strong>Category:</strong> {product.categoryName}
      </Text>

      <Text mb={"sm"} size="sm">
       <strong>Quantity:</strong> {product.totalQuantity}
      </Text>

      <Badge color={product.totalQuantity > 0 ? "green" : "red"}>
        {product.totalQuantity > 0 ? "Stock" : "Emtpy"}
      </Badge>
    </Card>
  );
}
