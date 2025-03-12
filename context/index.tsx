"use client"
import React, { createContext, useContext, useState } from "react"

const AppContext = createContext<any>(undefined)

export function AppWrapper({ children } : {
    children: React.ReactNode
}) {
    const [name, setName] = useState("defaultName")
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AppContext.Provider value={{
            name, setName,
            isLoggedIn, setIsLoggedIn
        }
        }>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}