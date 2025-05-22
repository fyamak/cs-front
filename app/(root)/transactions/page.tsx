"use client";

import { getData } from "@/utils/api";
import { useEffect, useState } from "react";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Button, Container, Notification, Select } from "@mantine/core";
import { ITransaction } from "@/types/product-types";
import UseFetchProducts from "@/hooks/use-fetch-products";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { InfiniteScroll } from "@/components/infinite-scroll";
import TransactionCard from "@/components/transaction-card";

export default function TransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { products, fetchProducts } = UseFetchProducts();

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  const productOptions = products.map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      startDate: null,
      endDate: null,
      selectedProduct: null,
    },
  });

  const handleSubmit = async (formValues: any) => {
    if (!formValues.startDate || !formValues.endDate) {
      setMessage("Please select both start and end dates.");
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
      return;
    }
    var endpoint = `${formValues.startDate.toISOString()}/${formValues.endDate.toISOString()}`;
    if (formValues.selectedProduct != null) {
      endpoint += `?productId=${formValues.selectedProduct}`;
    }
    try {
      const res = await getData("transactions/" + endpoint);
      const response = res.data;
      setTransactions(response.data || []);

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
      } else {
        setMessage(response.message);
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      console.log("Error: ", error);
    }
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="space-y-6">
      {status && (
        <div className="fixed top-24 right-2 sm:right-5 z-[9999]">
          <Notification
            withCloseButton={false}
            icon={
              status === "success" ? (
                <IconCheck size={20} />
              ) : (
                <IconX size={20} />
              )
            }
            color={status === "success" ? "teal" : "red"}
            withBorder
            title={status === "success" ? "Success" : "Error"}
          >
            {message}
          </Notification>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div>
          <DateTimePicker
            label="Start Date"
            placeholder="01/01/1970 00:00"
            clearable
            required
            key={form.key("startDate")}
            {...form.getInputProps("startDate")}
          />
        </div>

        <div>
          <DateTimePicker
            label="End Date"
            placeholder="01/01/1970 00:00"
            clearable
            required
            key={form.key("endDate")}
            {...form.getInputProps("endDate")}
          />
        </div>

        <div>
          <Select
            label="Product"
            placeholder="Select Product"
            limit={20}
            data={productOptions}
            searchable
            clearable
            {...form.getInputProps("selectedProduct")}
          />
        </div>

        <div className="flex justify-start">
          <Button type="submit" className="w-full md:w-auto">
            Submit
          </Button>
        </div>
      </form>

      {isMobile ? (
        <Container
          fluid
          py="md"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <InfiniteScroll<ITransaction>
            data={transactions}
            itemsPerPage={24}
            loader={
              <div className="text-center py-4">Loading more orders...</div>
            }
            endMessage={""}
            renderItem={(transaction) => (
              <div key={transaction.id + transaction.type} className="w-full">
                <TransactionCard
                  key={transaction.id + transaction.type}
                  id={transaction.id}
                  product={transaction.product}
                  organization={transaction.organization}
                  quantity={transaction.quantity}
                  price={transaction.price}
                  date={
                    transaction.date.substring(0, 10) +
                    " " +
                    transaction.date.substring(11, 16)
                  }
                  type={transaction.type}
                  remainingQuantity={transaction.remainingQuantity}
                />
              </div>
            )}
          />
        </Container>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full table-auto">
           <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Product</th>
              <th className="px-4 py-2 text-left font-semibold">Organization</th>
              <th className="px-4 py-2 text-left font-semibold">Price</th>
              <th className="px-4 py-2 text-left font-semibold">Quantity</th>
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-left font-semibold">Remaining Quantity</th>
              <th className="px-4 py-2 text-left font-semibold">Type</th>
            </tr>
          </thead>
            <tbody>
              <InfiniteScroll<ITransaction>
                data={transactions}
                itemsPerPage={50}
                loader={""}
                endMessage={""}
                isTable={true}
                renderItem={(transaction) => (
                  <tr
                key={transaction.id + transaction.type}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{transaction.product}</td>
                <td className="px-4 py-2">{transaction.organization}</td>
                <td className="px-4 py-2">{transaction.price}</td>
                <td className="px-4 py-2">{transaction.quantity}</td>
                <td className="px-4 py-2">
                  {transaction.date.substring(0, 10)}{" "}
                  {transaction.date.substring(11, 16)}
                </td>
                <td className="px-4 py-2">
                  {transaction.remainingQuantity ?? "-"}
                </td>
                <td className="px-4 py-2">{transaction.type}</td>
              </tr>
                )}
              />
            </tbody>
          </table>
        </div>
      )}

      {/* <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Product</th>
              <th className="px-4 py-2 text-left font-semibold">
                Organization
              </th>
              <th className="px-4 py-2 text-left font-semibold">Price</th>
              <th className="px-4 py-2 text-left font-semibold">Quantity</th>
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-left font-semibold">
                Remaining Quantity
              </th>
              <th className="px-4 py-2 text-left font-semibold">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id + transaction.type}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{transaction.product}</td>
                <td className="px-4 py-2">{transaction.organization}</td>
                <td className="px-4 py-2">{transaction.price}</td>
                <td className="px-4 py-2">{transaction.quantity}</td>
                <td className="px-4 py-2">
                  {transaction.date.substring(0, 10)}{" "}
                  {transaction.date.substring(11, 16)}
                </td>
                <td className="px-4 py-2">
                  {transaction.remainingQuantity ?? "-"}
                </td>
                <td className="px-4 py-2">{transaction.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
