"use client"

import { getData } from "@/utils/api"
import { useEffect, useState } from "react"
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { ITransaction } from "@/types/product-types";
import UseFetchProducts from "@/hooks/use-fetch-products";

export default function TransactionsPage() {
  
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<number>();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { products, fetchProducts } = UseFetchProducts();

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  
  useEffect(() => {
    fetchProducts();
  }, [])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    var endpoint = `${startDate +"T00:00:00.000Z"}/${endDate+"T23:59:59.999Z"}`
    if (selectedProduct && selectedProduct !== 0) {
      endpoint += `?productId=${selectedProduct}`;
    }
    
    try
    {
      const res = await getData("transactions/" + endpoint);
      const response = res.data
      setTransactions(response.data || []);
      
      if (response.status === "Success") {
        setMessage(response.message)
        setStatus("success");
      } 
      else {
        setMessage(response.message)
        setStatus("error");
      }
    } catch (error) {
        setStatus("error");
        console.log("Error: ", error)        
    }
    setTimeout(() => setStatus(null), 3000);        
    
    
  };

  return (
    <div className="space-y-6">
       {status && (
        <div className="fixed bottom-18 right-5">
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
        <h1 className="text-3xl font-bold">Transactions</h1>
        
      </div>


      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md shadow-sm bg-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md shadow-sm bg-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Product</label>
            <select
              value={selectedProduct ?? ""}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md shadow-sm bg-white"
            >
              <option value="">-</option>
              {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button 
              type="submit"
              className="flex items-center px-6 py-2 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transform transition active:scale-95"
            >
              Filter
            </button>
          </div>

        </div>
      </form>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full table-auto text-sm">
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
            {transactions.map((transaction) => (
              <tr
                key={transaction.id+transaction.type}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{transaction.product}</td>
                <td className="px-4 py-2">{transaction.organization}</td>
                <td className="px-4 py-2">{transaction.price}</td>
                <td className="px-4 py-2">{transaction.quantity}</td>
                <td className="px-4 py-2">{transaction.date.substring(0,10)} {transaction.date.substring(11,16)}</td>
                <td className="px-4 py-2">{transaction.remainingQuantity ?? "-"}</td>
                <td className="px-4 py-2">{transaction.type}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}