"use client";
import UseFetchOrders from "@/hooks/use-fetch-orders";
import UseFetchOrganizations from "@/hooks/use-fetch-organizations";
import UseFetchProducts from "@/hooks/use-fetch-products";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { Pagination, Text } from "@mantine/core";
import OrderHistoryCard from "@/components/order-history-card";

const ITEMS_PER_PAGE = 100;

export default function OrderHistory() {
  const isMobile = useMediaQuery("(max-width: 50em)");

  const [loading, setLoading] = useState(true);
  const { orderHistory, fetchOrderHistory } = UseFetchOrders();
  const { productMap, fetchProducts } = UseFetchProducts();
  const { organizationMap, fetchOrganizations } = UseFetchOrganizations();

  useEffect(() => {
    setLoading(true);
    fetchOrderHistory();
    fetchProducts();
    fetchOrganizations();
    setLoading(false);
  }, []);

  const [activePage, setPage] = useState(1);
  const paginationMessage = `Showing ${
    ITEMS_PER_PAGE * (activePage - 1) + 1
  } – ${Math.min(orderHistory.length, ITEMS_PER_PAGE * activePage)} of ${
    orderHistory.length
  }`;
  const data = chunk(orderHistory, ITEMS_PER_PAGE);
  const items =
    data.length > 0 ? (
      !isMobile ? (
        data[activePage - 1].map((order) => (
          <tr key={order.id} className="border-t border-gray-200">
            <td className="px-4 py-2">
              {productMap.get(order.productId) ?? "Unknown"}
            </td>
            <td className="px-4 py-2">
              {organizationMap.get(order.organizationId) ?? "Unknown"}
            </td>
            <td className="px-4 py-2">{order.quantity}</td>
            <td className="px-4 py-2">${order.price}</td>
            <td className="px-4 py-2">{order.type}</td>
            <td className="px-4 py-2">
              {new Date(order.createdAt).toLocaleString()}
            </td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  order.isSuccessfull
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.isSuccessfull ? "Successful" : "Failed"}
              </span>
            </td>
            <td className="px-4 py-2 text-sm text-gray-600">{order.detail}</td>
          </tr>
        ))
      ) : (
        data[activePage - 1].map((item) => (
          <OrderHistoryCard
            key={item.id}
            isSuccessfull={item.isSuccessfull}
            type={item.type}
            detail={item.detail}
            productName={productMap.get(item.productId) ?? "Unknown"}
            organizationName={organizationMap.get(item.organizationId) ?? "Unknown"}
            price={item.price}
            quantity={item.quantity}
          />
        ))
      )
    ) : (
      <></>
    );

  return (
    <div className="p-4 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orderHistory.length === 0 ? (
        <p>No past orders found.</p>
      ) : !isMobile ? (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full bg-white border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 text-base uppercase">
              <tr>
                <th className="px-4 py-2">Product ID</th>
                <th className="px-4 py-2">Organization ID</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Create Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y">{items}</tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{items}</div>
      )}

      <div className="flex flex-col items-center mt-10">
        <Text className="text-gray-500" size="sm">
          {paginationMessage}
        </Text>
        <Pagination
          total={data.length}
          value={activePage}
          onChange={setPage}
          siblings={isMobile ? 1 : 2}
          mt="md"
          size={isMobile ? "sm" : "lg"}
        />
      </div>
    </div>
  );
}

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}
