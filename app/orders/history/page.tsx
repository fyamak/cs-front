"use client";
import UseFetchOrders from "@/hooks/use-fetch-orders";
import UseFetchOrganizations from "@/hooks/use-fetch-organizations";
import UseFetchProducts from "@/hooks/use-fetch-products";
import React, { useEffect, useState } from "react";

const OrderHistory = () => {
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

  return (
    <div className="p-4 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orderHistory.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Product ID</th>
                <th className="px-4 py-2 text-left">Organization ID</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Create Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Detail</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{productMap.get(order.productId) ?? "Unknown"}</td>
                  <td className="px-4 py-2">{organizationMap.get(order.organizationId) ?? "Unknown"}</td>
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
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {order.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
