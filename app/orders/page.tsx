"use client"

import { useEffect, useMemo, useState } from "react"
import AddSupplyModal from "@/components/add-order-modal"
import { deleteData, postData } from "@/utils/api"
import { Check, X, History } from 'lucide-react'
import { Notification } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useAppContext } from "@/context"
import Link from "next/link"
import UseFetchOrders from "@/hooks/use-fetch-orders"
import UseFetchOrganizations from "@/hooks/use-fetch-organizations"
import UseFetchProducts from "@/hooks/use-fetch-products"

export default function OrderPage() {
  const [orderType, setOrderType] = useState("all")
  const [search, setSearch] = useState("")
  const [isModalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  
  const { currency, setCurrency } = useAppContext();
  const { orders, fetchOrders } = UseFetchOrders();
  const { organizationMap, fetchOrganizations } = UseFetchOrganizations();
  const { productMap ,fetchProducts} = UseFetchProducts();

  useEffect(() => {
    fetchOrders()
    fetchProducts();
    fetchOrganizations();
  }, [])


  const filteredOrders =  orders.filter((order) => {
    const lowerSearch = search.toLowerCase();
    const productName = productMap.get(order.productId)?.toLowerCase() || "";
    const organizationName = organizationMap.get(order.organizationId)?.toLowerCase() || "";
    const matchesSearch = productName.includes(lowerSearch) || organizationName.includes(lowerSearch);
    const matchesCategory = orderType === "all" || order.type.toLowerCase() === orderType.toLowerCase();

    return matchesSearch && matchesCategory;
  });


  const handleApprove = async (orderId: number) => {
    setIsProcessing(true)
    const approvedOrder = orders.find(order => order.id === orderId);
    try {
      const endpoint = `products/${approvedOrder?.productId}/${approvedOrder?.type}`
      const res = await postData(endpoint, {
          organizationId : approvedOrder?.organizationId,
          quantity: approvedOrder?.quantity,
          price: approvedOrder?.price,
          date: approvedOrder?.date,
          orderId: orderId
      });
      const response = res.data

      if (response.status === "Success") {
        setMessage(response.message)
        setStatus("success");
        fetchOrders();
      } else {
        setMessage(response.message)
        setStatus("error");
      }

    } catch (error) {
        setStatus("error");
        console.log("Error: ", error)        
    }
    setTimeout(() => setStatus(null), 3000);    
    setIsProcessing(false)
  }
  
  const handleReject = async (orderId: number) => {
    setIsProcessing(true)
    
    try {
      const endpoint = `orders/${orderId}`
      const res = await deleteData(endpoint);
      const response = res.data

      if (response.status === "Success") {
        setMessage(response.message)
        setStatus("success");
        fetchOrders();
      } else {
        setMessage(response.message)
        setStatus("error");
      }

    } catch (error) {
        setStatus("error");
        console.error("Error: ", error)        
    }
    setTimeout(() => setStatus(null), 3000);    
    setIsProcessing(false)
  }
  


  return (
    <div className="space-y-6">
      {status && (
        <div className="fixed top-18 right-5">
            <Notification 
                withCloseButton={false}
                icon={status === "success" ? <IconCheck size={20} /> : <IconX size={20} />}
                color={status === "success" ? "teal" : "red"}
                withBorder title={status === "success" ? "Success" : "Error"}
            >
                {message}
            </Notification>
        </div>
      )}


      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex items-center gap-4">
        <Link 
          href="orders/history"
          className="flex items-center px-4 py-2"
          >
          <History className="mr-1 w-7 h-7"/>
        </Link>
        <button 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
          >
          New Order
        </button>
            </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm w-full"
          />
        </div>
        <div className="w-[200px]">
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm w-full"
          >
            <option value="all">All Types</option>
            <option value="supply">Supply</option>
            <option value="sale">Sale</option>
          </select>
        </div>
      </div>

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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2 font-medium">{productMap.get(order.productId) ?? "Unknown"}</td>
                <td className="px-4 py-2">{organizationMap.get(order.organizationId) ?? "Unknown"}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">{currency}{order.price}</td>
                <td className="px-4 py-2">{order.date.substring(0,10)} {order.date.substring(11,16)}</td>
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
            ))}
          </tbody>
        </table>
      </div>
      <AddSupplyModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={fetchOrders} />
    </div>
  )
}