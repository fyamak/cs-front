"use client";
import { getData } from "@/utils/api";
import React, { useEffect, useMemo, useState } from "react";
import { Table } from '@mantine/core';

interface Order {
  id: number;
  productId: number;
  organizationId: number;
  quantity: number;
  price: number;
  date: string;
  type: string;
  isSuccessfull: boolean;
  detail: string;
  createdAt: string;
}

interface Product {
  id: number,
  name: string,
}

interface Organization{
  id: number,
  name: string,
}



const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);


  const organizationMap = useMemo(() => {
    const map = new Map<number, string>()
    organizations.forEach(org => map.set(org.id, org.name))
    return map
  }, [organizations])
  
  const productMap = useMemo(() => {
    const map = new Map<number, string>()
    products.forEach(prod => map.set(prod.id, prod.name))
    return map
  }, [products])

  
  useEffect(() => {
    fetchOrderHistory();
    fetchOrganizations();
    fetchProducts();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const res = await getData("orders?isDeleted=true");
      const response = res.data;
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
        const res = await getData("api/organization");
        const response = res.data
        setOrganizations(response.data || []);
    } catch (error) {
        console.log('Error fetching products:', error);
    }
}

const fetchProducts = async () => {
    try {
        const res = await getData("products");
        const response = res.data
        setProducts(response.data || []);
    } catch (error) {
        console.log('Error fetching products:', error);
    }
}


  return (
    <div className="p-4 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
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
              {orders.map((order) => (
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
