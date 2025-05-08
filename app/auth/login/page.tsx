"use client"
import React, { useState } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { useRouter } from "next/navigation";
import Link from 'next/link'
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { IAuthResponse } from '@/types/api-response-types';
import { ILoginForm } from '@/types/state-object-types';


export default function LoginPage() {
    const router = useRouter();
    const [loginForm, setLoginForm] = useState<ILoginForm>({
        email: "",
        password: ""
    })

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");
   

    const handleChange = (e : any) => {
      const { name, value } = e.target;

      setLoginForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
      
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const res = await postData("login", { email: loginForm.email, password: loginForm.password});
            const response : IAuthResponse = res.data            

            if (response.status === "Success")
            {
                setMessage(response.message)
                setStatus("success")
                Cookies.set("accessToken",response.data.accessToken)
                Cookies.set("refreshToken",response.data.refreshToken)
                router.push("/")
            }
            else{
                setMessage(response.message)
                setStatus("error")
            }
        } catch (error) {
            setMessage("");
            setStatus("error");
            console.log(error);
        }
        
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className='flex h-screen'>
            <div className="flex-1 flex items-center justify-center text-lg font-semibold">
                
                {status && (
                    <div className="fixed top-28 right-5">
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
                        <label htmlFor="email" className="block mb-2 font-medium text-gray-900 ">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name='email'
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            placeholder="johndue@example.com" 
                            value={loginForm.email}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 font-medium text-gray-900">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            placeholder="********" 
                            value={loginForm.password}
                            onChange={handleChange}
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

