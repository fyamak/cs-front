"use client";

import { useEffect, useState } from "react";
import { deleteData, postData } from "@/utils/api";
import { Check, X, History } from "lucide-react";
import {
  Box,
  Button,
  Container,
  Input,
  LoadingOverlay,
  Notification,
  Select,
} from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";
import { useAppContext } from "@/context";
import Link from "next/link";
import UseFetchOrders from "@/hooks/use-fetch-orders";
import UseFetchOrganizations from "@/hooks/use-fetch-organizations";
import UseFetchProducts from "@/hooks/use-fetch-products";
import AddOrderModal from "@/components/add-order-modal";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { IOrder } from "@/types/order-types";
import { useMediaQuery } from "@mantine/hooks";
import { useDebounce } from "use-debounce";
import OrderCard from "@/components/order-card";

export default function OrderPage() {
  const isMobile = useMediaQuery("(max-width: 50em)");

  const [orderType, setOrderType] = useState<string | null>("all");
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState(false);

  const { currency } = useAppContext();
  const { orders, fetchOrders } = UseFetchOrders();
  const { organizations, organizationMap, fetchOrganizations } =
    UseFetchOrganizations();
  const { products, productMap, fetchProducts } = UseFetchProducts();

    useEffect(() => {
    async function fetchData() {
      setVisible(true);
      await Promise.all([fetchOrganizations(), fetchProducts(),fetchOrders()]);
      setVisible(false);
    }
    fetchData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const lowerSearch = searchDebounce.toLowerCase();
    const productName = productMap.get(order.productId)?.toLowerCase() || "";
    const organizationName =
      organizationMap.get(order.organizationId)?.toLowerCase() || "";
    const matchesSearch =
      productName.includes(lowerSearch) ||
      organizationName.includes(lowerSearch);
    const matchesCategory =
      orderType === "all" ||
      order.type.toLowerCase() === orderType?.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleApprove = async (orderId: number) => {
    setIsProcessing(true);
    const approvedOrder = orders.find((order) => order.id === orderId);
    try {
      const endpoint = `products/${approvedOrder?.productId}/${approvedOrder?.type}`;
      const res = await postData(endpoint, {
        organizationId: approvedOrder?.organizationId,
        quantity: approvedOrder?.quantity,
        price: approvedOrder?.price,
        date: approvedOrder?.date,
        orderId: orderId,
      });
      const response = res.data;

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
        fetchOrders();
      } else {
        setMessage(response.message);
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      console.log("Error: ", error);
    }
    setTimeout(() => setStatus(null), 3000);
    setIsProcessing(false);
  };

  const handleReject = async (orderId: number) => {
    setIsProcessing(true);

    try {
      const endpoint = `orders/${orderId}`;
      const res = await deleteData(endpoint);
      const response = res.data;

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
        fetchOrders();
      } else {
        setMessage(response.message);
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      console.error("Error: ", error);
    }
    setTimeout(() => setStatus(null), 3000);
    setIsProcessing(false);
  };

  const handleModalSubmit = (
    message: string,
    status: "success" | "error" | null
  ) => {
    setMessage(message);
    setStatus(status);
    setTimeout(() => setStatus(null), 3000);
    fetchOrders();
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div
          className={`flex items-center ${
            isMobile ? "justify-between w-full" : "gap-4"
          }`}
        >
          <h1 className="text-3xl font-bold">Orders</h1>
          <Link href="orders/history" className="flex items-center px-4 py-2">
            <History className="w-7 h-7 ml-2 sm:ml-0 sm:mr-1" />
          </Link>
        </div>

        <Button
          size={isMobile ? "sm" : "md"}
          variant="filled"
          onClick={() => setModalOpen(true)}
        >
          New Order
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          className="flex-1"
          placeholder="Search orders..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          rightSection={
            search !== "" ? (
              <Input.ClearButton onClick={() => setSearch("")} />
            ) : undefined
          }
          rightSectionPointerEvents="auto"
          size={isMobile ? "sm" : "md"}
          role="presentation"
          autoComplete="off"
        />

        <Select
          placeholder="Select Type"
          data={[
            { value: "supply", label: "Supply" },
            { value: "sale", label: "Sale" },
          ]}
          value={orderType === "all" ? null : orderType}
          onChange={(value) => setOrderType(value ?? "all")}
          size={isMobile ? "sm" : "md"}
        />
      </div>

      <Box pos="relative" style={{minHeight:"50px"}}>
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        {isMobile ? (
          <Container
            fluid
            py="md"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <InfiniteScroll<IOrder>
              data={filteredOrders}
              itemsPerPage={24}
              loader={
                <div className="text-center py-4">Loading more orders...</div>
              }
              endMessage={""}
              renderItem={(order) => (
                <div key={order.id} className="w-full">
                  <OrderCard
                    key={order.id}
                    id={order.id}
                    productName={
                      productMap.get(order.productId) ?? "Unknown Product"
                    }
                    organizationName={
                      organizationMap.get(order.organizationId) ??
                      "Unknown Organization"
                    }
                    quantity={order.quantity}
                    price={order.price}
                    date={
                      order.date.substring(0, 10) +
                      " " +
                      order.date.substring(11, 16)
                    }
                    type={order.type}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isProcessing={isProcessing}
                  />
                </div>
              )}
            />
          </Container>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Organization</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <InfiniteScroll<IOrder>
                  data={filteredOrders}
                  itemsPerPage={50}
                  loader={""}
                  endMessage={""}
                  isTable={true}
                  renderItem={(order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-2 font-medium">
                        {productMap.get(order.productId) ?? "Unknown Product"}
                      </td>
                      <td className="px-4 py-2">
                        {organizationMap.get(order.organizationId) ??
                          "Unknown Organization"}
                      </td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">
                        {currency}
                        {order.price}
                      </td>
                      <td className="px-4 py-2">
                        {order.date.substring(0, 10)}{" "}
                        {order.date.substring(11, 16)}
                      </td>
                      <td className="px-4 py-2">{order.type}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 active:scale-95 transition transform duration-100"
                          onClick={() => handleApprove(order.id)}
                          disabled={isProcessing}
                        >
                          <Check className="h-7 w-7" />
                        </button>

                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 active:scale-95 transition transform duration-100"
                          onClick={() => handleReject(order.id)}
                          disabled={isProcessing}
                        >
                          <X className="h-7 w-7" />
                        </button>
                      </td>
                    </tr>
                  )}
                />
              </tbody>
            </table>
          </div>
        )}
        <AddOrderModal
          isOpen={isModalOpen}
          products={products}
          organizations={organizations}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      </Box>
    </div>
  );
}
