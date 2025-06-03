"use client";

import { useEffect, useState } from "react";
import { Button, Container, Notification, Select } from "@mantine/core";
import { ITransaction } from "@/types/product-types";
import UseFetchProducts from "@/hooks/use-fetch-products";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import TransactionCard from "@/components/transaction-card";
import { useDebounce } from "use-debounce";
import { IconCheck, IconX } from "@tabler/icons-react";

const PRODUCT_PAGE_SIZE = 20;
const TRANSACTION_PAGE_SIZE = 50;

export default function TransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { pagedProductsResponse, fetchPagedProducts, fetchPagedTransactions } =
    UseFetchProducts();
  const [pagedTransactions, setPagedTransactions] = useState<ITransaction[]>(
    []
  );

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchProductDebounce] = useDebounce(searchProduct, 1000);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<DateValue | null>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<DateValue | null>(new Date());
  const [includeFailures, setIncludeFailures] = useState<string | null>("false");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  const productOptions = pagedProductsResponse?.data.map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  
  useEffect(() => {
    setLoadingProduct(true);
  }, [searchProduct]);

  useEffect(() => {
    fetchPagedProducts(1, PRODUCT_PAGE_SIZE, searchProductDebounce).finally(
      () => setLoadingProduct(false)
    );
  }, [searchProductDebounce]);

  useEffect(() => {
    fetchPagedProducts;
  }, []);

  const loadMoreTransaction = async (pageNumber: number) => {
    const transactionResponse =
      (await fetchPagedTransactions(
        pageNumber,
        TRANSACTION_PAGE_SIZE,
        startDate?.toISOString(),
        endDate?.toISOString(),
        includeFailures,
        selectedProduct
      )) || [];

    if (transactionResponse.data.length === 0) {
      setHasMore(false);
    } else {
      setPagedTransactions((prev) => {
        const existingIds = new Set(prev.map((transaction) => transaction.id));
        const filteredNewItems = transactionResponse.data.filter((transaction) => !existingIds.has(transaction.id));
        return [...prev, ...filteredNewItems];
      });
      setPage(pageNumber);
    }
    
    if (transactionResponse.status !== "Success") {
      setHasMore(false);
      setPagedTransactions([]);
      setStatus("error");
      setMessage(transactionResponse.message);
    }

    setIsLoading(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleLoadMore = () => {
    loadMoreTransaction(page + 1);
  };

  const handleSubmitTemp = () => {
    if (startDate && endDate && includeFailures) {
      setHasMore(true);
      setIsLoading(true);
      setPagedTransactions([]);
      loadMoreTransaction(1);
    } else {
      setStatus("error");
      setMessage("Please fill the required fields");
      setTimeout(() => setStatus(null), 3000);
    }
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
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitTemp();
        }}
      >
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:flex-wrap items-end">
          <div className="flex-1 min-w-[220px]">
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              clearable
              required
              className="w-full"
            />
          </div>

          <div className="flex-1 min-w-[220px]">
            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              clearable
              required
              className="w-full"
            />
          </div>

          <div className="flex-1 min-w-[180px]">
            <Select
              label="Include Failures"
              data={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={includeFailures}
              onChange={setIncludeFailures}
              clearable={false}
              required
              className="w-full"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select
              label="Product"
              data={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              onSearchChange={setSearchProduct}
              searchable
              clearable
              className="w-full"
              nothingFoundMessage={
                loadingProduct ? "Loading..." : "No products found"
              }
            />
          </div>

          <div className="w-full md:w-auto">
            <Button
              type="submit"
              fullWidth={isMobile}
              className="mt-2 md:mt-0"
              loading={isLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>

      {isMobile ? (
        <Container
          fluid
          py="md"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pagedTransactions?.map((transaction) => (
            <TransactionCard
              key={transaction.id + transaction.type}
              id={transaction.id}
              productName={transaction.productName}
              organizationName={transaction.organizationName}
              quantity={transaction.quantity}
              price={transaction.price}
              date={
                transaction.date.substring(0, 10) +
                " " +
                transaction.date.substring(11, 16)
              }
              type={transaction.type}
              detail={transaction.detail}
              isSuccessfull={transaction.isSuccessfull}
            />
          ))}
        </Container>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Product</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Organization
                </th>
                <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left font-semibold">Price</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-left font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {pagedTransactions?.map((transaction) => (
                <tr
                  key={transaction.id + transaction.type}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{transaction.productName}</td>
                  <td className="px-4 py-2">{transaction.organizationName}</td>
                  <td className="px-4 py-2">{transaction.quantity}</td>
                  <td className="px-4 py-2">{transaction.price}</td>
                  <td className="px-4 py-2">
                    {transaction.date.substring(0, 10)}{" "}
                    {transaction.date.substring(11, 16)}
                  </td>
                  <td className="px-4 py-2">{transaction.type}</td>
                  <td className="px-4 py-2">{transaction.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center my-4">
          <Button onClick={handleLoadMore} loading={isLoading}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
