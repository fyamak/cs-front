"use client";
import React, { useState } from "react";
import { getData } from "@/utils/api";
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';

interface Response {
    data: Transaction[],
    message: string,
    status: string
}

interface Transaction {
    date : string, 
    id : number,
    productId : number,
    quantity : number,
    remainingQuantity: number,
    type : string
}

const TransactionsPage = () => {
    const [id, setId] = useState<number>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let editedStartDate = startDate + ":00.000Z"
        let editedEndDate = endDate+ ":00.000Z"

        try{
            let url = "transactions/"+editedStartDate+"/"+editedEndDate
            if(id)
                url = url +"?productId=" + id

            const res = await getData(url)
            const response : Response = res.data
            console.log(response)
            const transactions = response.data

            
            if (response.status === "Success") {
                setTransactions(transactions);
                setMessage(response.message)                
                setStatus("success");
            } else {
                setMessage(response.message)                
                setStatus("error");
            }
        }
        catch(error){
            setStatus("error");
            console.log("Error: ", error)
        }
        setTimeout(() => setStatus(null), 3000);
    };

    const supplyTransactions = transactions.filter(
        (transaction) => transaction.type === "Supply"
    );
    const saleTransactions = transactions.filter(
        (transaction) => transaction.type === "Sale"
    );
    

  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-gray-100 p-4 flex flex-col items-center justify-center space-y-4">
        
        {status && (
            <div className="fixed top-28 left-5">
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
        

        <form className="max-w-sm mx-auto pt-10 " onSubmit={handleSubmit}>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
                <input 
                    type="datetime-local"
                    id="date" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required 
                    />
            </div>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                <input 
                    type="datetime-local"
                    id="date" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required 
                    />
            </div>
            <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">Id</label>
                    <input 
                        type="number" 
                        id="number" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="Optional" 
                        value={id}
                        onChange={(e) => setId(Number(e.target.value))}
                        />
                </div>
            <div className="flex justify-center">
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            </div>
        </form>

      </div>

      <div className="w-5/6 p-4">
                <div className="flex">
                    <div className="w-1/2 p-4 space-y-4">
                        <h2 className="text-xl font-bold">Supply</h2>
                        {supplyTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 border border-gray-200 rounded-md">
                                <p>
                                    <strong>Product ID:</strong> {transaction.productId}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(transaction.date).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {transaction.quantity}
                                </p>
                                <p>
                                    <strong>Remaining Quantity:</strong> {transaction.remainingQuantity}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="w-1/2 p-4 space-y-4">
                        <h2 className="text-xl font-bold">Sale</h2>
                        {saleTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 border border-gray-200 rounded-md">
                                <p>
                                    <strong>Product ID:</strong> {transaction.productId}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(transaction.date).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {transaction.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


    </div>
  );
};

export default TransactionsPage