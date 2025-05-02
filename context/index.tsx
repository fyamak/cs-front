"use client"
import React, { createContext, useContext, useState } from "react"

const AppContext = createContext<any>(undefined)

export function AppWrapper({ children } : {
    children: React.ReactNode
}) {
    const [currency, setCurrency] = useState("$")

    

    return (
        <AppContext.Provider value={{
            currency, setCurrency
        }
        }>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    return useContext(AppContext)
}