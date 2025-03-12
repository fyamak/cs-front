"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { useRouter } from "next/navigation";

const navbar = () => {
    const router = useRouter()
    const {isLoggedIn, setIsLoggedIn} =  useAppContext()

    useEffect(() => {
        const userLoggedIn = localStorage.getItem("isLoggedIn");
        console.log(userLoggedIn)
        if (userLoggedIn === "true") {
            setIsLoggedIn(true);
        }
    }, []);
  
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiration");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false")
        router.push("/")
    }


    return (
        <nav className="bg-gray-200 shadow shadow-gray-300 max-w-screen px-8 md:px-auto">
        <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
            <div className="text-indigo-500 font-semibold md:order-1">
                <Link href={"/"}>
                    <p className='text-2xl'>Rea Tech</p>
                </Link>
            </div>
            <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
                {isLoggedIn ? (
                    <ul className="flex font-semibold justify-between">
                        <Link href="/products">
                            <p className="md:px-4 md:py-2 hover:text-indigo-400">Products</p>
                        </Link>
                        <Link href="/transactions">
                            <p className="md:px-4 md:py-2 hover:text-indigo-400">Transactions</p>
                        </Link>
                        
                    </ul>
                ) : (
                    <>
                    </>                    
                )
                }
            </div>
            <div className="order-2 md:order-3">
            {isLoggedIn ? (
                    <button 
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-50 rounded-xl flex items-center gap-2">
                            Logout
                        </button>
                    ) : (
                        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                            <Link href={"/auth/login"}>
                                <span>Login</span>
                            </Link>
                        </button>
                    )}
            </div>
        </div>
        
    </nav>
  )
}

export default navbar
