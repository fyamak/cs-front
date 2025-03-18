"use client"
import React, { useState } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { postData } from '@/utils/api';
import { useAppContext } from '@/context';
import { useRouter } from "next/navigation";
import Link from 'next/link'


interface Response {
    data: {
        accessToken: string,
        expiration: string,
        refreshToken: string
    }
    message: string,
    status: string
}


export default function ProductSupplies() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { isLoggedIn, setIsLoggedIn } = useAppContext()
    
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = { email, password }
        
        try {
            const res = await postData("login", formData)
            const response: Response = res.data 
            const responseData = response.data

            if (response.status === "Success")
            {
                if (responseData)
                {
                    localStorage.setItem("accessToken", responseData.accessToken)
                    localStorage.setItem("expiration", responseData.expiration)
                    localStorage.setItem("refreshToken", responseData.refreshToken)
                    setMessage(response.message)
                    setStatus("success")
                    setIsLoggedIn(true)
                    localStorage.setItem("isLoggedIn", "true")
                    router.push("/products")
                }
            }
            else{
                setMessage(response.message)
                setStatus("error")
            }
        } catch (error) {
            setMessage("")
            setStatus("error")
            console.log(error)
        }
        
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className='flex h-screen'>
            <div className="flex-1 flex items-center justify-center text-lg font-semibold">
                
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

                <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            placeholder="user@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            placeholder="********" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <div className='flex justify-center'>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Login</button>
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-blue-500 hover:underline">
                                Click here to register
                            </Link>
                        </span>
                    </div>
                </form>
                
            </div>
        </div>
        
    );
}

