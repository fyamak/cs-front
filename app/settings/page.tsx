"use client"

import { useAppContext } from "@/context"
import { useEffect, useState } from "react"
import { Notification } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import { patchData, postData } from "@/utils/api";

interface User {
  id: number,
  fullName: string,
  email: string,
  phoneNumber: string,
  currency: string,
  receiveEmail: boolean,
  receiveLowStockAlert: boolean,
  userType: string
}

interface Response {
  status: string,
  message: string,
  data: User
}


export default function SettingsPage() {
  const [fullName, setFullName] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [receiveEmail, setReceiveEmail] = useState<boolean>(false)
  const [receiveLowStockAlert, setReceiveLowStockAlert] = useState<boolean>(false)
  const [localCurrency, setLocalCurrency] = useState<string>("")

  const [user, setUser] = useState<User>()
  const { currency, setCurrency } = useAppContext()

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetchUserInformation();
  }, [])

  const fetchUserInformation = async () => {
    try {
      const res = await postData("GetProfileInfo", {})
      const response: Response = res.data
      const userData = response.data

      console.log(userData)

      if (response.status === "Success") {
        setUser(userData)
        setCurrency(userData.currency)
        
        setFullName(userData.fullName || "");
        setPhoneNumber(userData.phoneNumber || "");
        setReceiveEmail(userData.receiveEmail);
        setReceiveLowStockAlert(userData.receiveLowStockAlert);
        setLocalCurrency(userData.currency || "");
      } 
      else {
        setMessage(response.message)
        setStatus("error");
      }
    } catch (error) {
      console.log("Error fetching user information: ", error);        
      setStatus("error");
    }
    setTimeout(() => setStatus(null), 3000); 
  }

  const handleSaveSettings = async () => {
    console.log("handleSaveSettings clicked")
    console.log(
      {
        fullName: fullName,
        phoneNumber: phoneNumber,
        receiveEmail: receiveEmail,
        recieveLowStockAlert: receiveLowStockAlert,
        localCurrency: localCurrency
      }
    )

    if (!user) {
      console.error("User data not loaded yet");
      return;
    }
  
    const updatedFields: Partial<User> = {};
  
    if (fullName !== user.fullName) {
      updatedFields.fullName = fullName;
    }
    if (phoneNumber !== user.phoneNumber) {
      updatedFields.phoneNumber = phoneNumber;
    }
    if (receiveEmail !== user.receiveEmail) {
      updatedFields.receiveEmail = receiveEmail;
    }
    if (receiveLowStockAlert !== user.receiveLowStockAlert) {
      updatedFields.receiveLowStockAlert = receiveLowStockAlert;
    }
    if (localCurrency !== user.currency) {
      updatedFields.currency = localCurrency;
    }
    console.log("updatedFields : ", updatedFields)
  
    if (Object.keys(updatedFields).length === 0) {
      return; // There is no changes
    }
  
    try {
      const res = await patchData("api/User", updatedFields);
      const response = res.data
      
      if (response.status === "Success") {
        setMessage(response.message)
        setStatus("success");
        fetchUserInformation();
      } 
      else {
        setMessage(response.message)
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
    setTimeout(() => setStatus(null), 3000);    
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className="fixed top-28 right-5">
          <Notification
            withCloseButton={false}
            icon={
              status === "success" ? (
                <IconCheck size={20} />
              ) : (
                <IconX size={20} />
              )
            }
            color={status === "success" ? "teal" : "red"}
            withBorder
            title={status === "success" ? "Success" : "Error"}
          >
            {message}
          </Notification>
        </div>
      )}

      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6">
        {/* User Information Card */}
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">User Information</h2>
            <p className="text-sm text-muted-foreground">Update user details</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </label>
              <div
                id="email"
                className="w-full rounded-md border px-3 py-2 text-m focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {user?.email || "Email field"}
              </div>
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="companyName"
                className="text-sm font-medium block"
              >
                Full Name
              </label>
              <input
                id="fullName"
                placeholder="Enter full name"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium block">
                Phone Number
              </label>
              <input
                id="phone"
                placeholder="Enter phone number"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            {/* there is a problem here SOLVE IT*/}
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium block">
                Currency
              </label>
              <select
                id="currency"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                value={localCurrency}
                onChange={(e) => setLocalCurrency(e.target.value)}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₺">TL (₺)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Notification Card */}
          <div className="rounded-lg border p-6 shadow-sm w-full md:w-1/2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications and alerts
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium block">
                    Email Notifications
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about orders and inventory updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={receiveEmail}
                  onChange={(e) => setReceiveEmail(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium block">
                    Low Stock Alerts
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={receiveLowStockAlert}
                  onChange={(e) => setReceiveLowStockAlert(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
            </div>
          </div>

          {/* Data Management Card */}
          <div className="rounded-lg border p-6 shadow-sm w-full md:w-1/2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Data Management</h2>
              <p className="text-sm text-muted-foreground">
                Manage your data and export options
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Export Data</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Download your inventory and order history (NOT AVAILABLE)
                </p>
                <div className="flex space-x-4">
                  <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100">
                    Export Inventory
                  </button>
                  <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100">
                    Export Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:scale-95 transition transform duration-100"
          onClick={() => handleSaveSettings()}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
