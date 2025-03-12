"use client"
import React, { useState } from "react";
import { postData } from '@/utils/api'
import { useSearchParams } from 'next/navigation';
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';

interface SuppliesPageProps {
    params:{
        id: number
    }
}

interface Response {
    data: object
    message: string,
    status: string
}


export default function ProductSupplies( { params }: SuppliesPageProps ) {
    const searchParams = useSearchParams();
    const productName = searchParams.get("name") || "Unknown Product";

    const [quantity, setQuantity] = useState<number>();
    const [date, setDate] = useState<string>("");

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");
    const xIcon = <IconX size={20} />;
    const checkIcon = <IconCheck size={20} />;
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = { quantity, date }
        let editedDate = formData.date + ":00.000Z"
        formData.date = editedDate
        
        try {
            const endpoint = `products/${params.id}/supplies`
            const res = await postData(endpoint, formData);
            const response : Response = res.data
            

            if (response.status === "Success") {
                setMessage(response.message)
                setStatus("success");
            } else {
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
        <div className="max-w-sm mx-auto font-bold">
            <h1 className="pt-5 text-center text-3xl">Supply</h1>
            <h2 className="text-lg font-bold mb-4 pt-40">{productName}</h2>

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
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">Quantity</label>
                    <input 
                        type="number" 
                        id="number" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="0" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                    <input 
                        type="datetime-local"
                        id="date" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required 
                        />
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                </div>
            </form>
        </div>
    );
}

