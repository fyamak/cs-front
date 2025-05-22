"use client";

import { useAppContext } from "@/context";
import { useEffect, useState } from "react";
import { IconX, IconCheck } from "@tabler/icons-react";
import { patchData, postData } from "@/utils/api";
import { IUser } from "@/types/user-types";
import { IResponse } from "@/types/api-response-types";
import {
  Card,
  Text,
  Notification,
  Group,
  TextInput,
  InputBase,
  Select,
  Checkbox,
  Button,
} from "@mantine/core";
import { IMaskInput } from "react-imask";
import { useMediaQuery } from "@mantine/hooks";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  const [user, setUser] = useState<IUser>();
  const { currency, setCurrency } = useAppContext();
  const [fullName, setFullName] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [receiveEmail, setReceiveEmail] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(false);

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetchUserInformation();
  }, []);

  const fetchUserInformation = async () => {
    try {
      const res = await postData("GetProfileInfo", {});
      const response: IResponse = res.data;
      const userData: IUser = response.data;

      setFullName(userData.fullName);
      setPhoneNumber(userData.phoneNumber);
      setReceiveEmail(userData.receiveEmail);
      setLowStockAlert(userData.receiveLowStockAlert);

      if (response.status === "Success") {
        setUser(userData);
        setCurrency(userData.currency);
      } else {
        setMessage(response.message);
        setStatus("error");
      }
    } catch (error) {
      console.log("Error fetching user information: ", error);
      setStatus("error");
    }
    setTimeout(() => setStatus(null), 3000);
  };


   const handleSaveSettings = async () => {
    if (!user) {
      console.error("User data not loaded yet");
      return;
    }
  
    const updatedFields: Partial<IUser> = {};
  
    if (fullName !== user.fullName) {
      updatedFields.fullName = fullName;
    }
    if (phoneNumber !== user.phoneNumber) {
      updatedFields.phoneNumber = phoneNumber;
    }
    if (receiveEmail !== user.receiveEmail) {
      updatedFields.receiveEmail = receiveEmail;
    }
    if (lowStockAlert !== user.receiveLowStockAlert) {
      updatedFields.receiveLowStockAlert = lowStockAlert;
    }
    if (currency !== user.currency) {
      updatedFields.currency = currency;
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


  const handleSignOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return router.push("/auth/login");
  }

  return (
    <div className="space-y-8">
      {status && (
        <div className="fixed top-24 right-2 sm:right-5 z-[9999]">
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

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="xl" fw={600}>
          User Information
        </Text>
        <Text size="sm" c="dimmed">
          Update user detail
        </Text>

        <div
          className={`flex ${
            isMobile ? "flex-col gap-4" : "flex-row gap-4"
          } mt-5`}
        >
          <TextInput
            label="Email Address"
            className="flex-1"
            placeholder="johndue@example.com"
            value={user?.email || ""}
            size="md"
            readOnly
          />

          <TextInput
            label="Full Name"
            name="fullName"
            className="flex-1"
            placeholder="Jhon Due"
            value={fullName || ""}
            onChange={(event) => setFullName(event.currentTarget.value)}
            role="presentation"
            autoComplete="off"
            size="md"
          />
        </div>

        <div
          className={`flex ${
            isMobile ? "flex-col gap-4" : "flex-row gap-4"
          } mt-5`}
        >
          <InputBase
            label="Phone"
            name="phone"
            className="flex-1"
            placeholder="(xxx) xxx-xxxx"
            component={IMaskInput}
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.currentTarget.value)}
            mask={"(000) 000-0000"}
            role="presentation"
            autoComplete="off"
            size="md"
          />

          <Select
            label="Currency"
            name="currency"
            className="flex-1"
            data={[
              { value: "$", label: "USD ($)" },
              { value: "€", label: "EUR (€)" },
              { value: "£", label: "GBP (£)" },
              { value: "₺", label: "TL (₺)" },
            ]}
            value={currency}
            onChange={(value) => setCurrency(value)}
            size={"md"}
            allowDeselect={false}
          />
        </div>
      </Card>

      <div className="flex flex-col xl:flex-row gap-4">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="flex-1"
        >
          <Text size="xl" fw={600}>
            Notifications
          </Text>
          <Text size="sm" c="dimmed" mb={"xl"}>
            Configure how you receive notifications and alerts
          </Text>

          <Group mb="md" justify="space-between" align="flex-start" wrap="wrap">
            <div style={{ flex: 1 }}>
              <Text size="lg" fw={500}>
                Email Notification
              </Text>
              <Text size="sm" c="dimmed">
                Receive notifications about orders and inventory updates
              </Text>
            </div>

            <Checkbox
              mt="md"
              checked={receiveEmail}
              onChange={(event) => setReceiveEmail(event.currentTarget.checked)}
            />
          </Group>

          <Group justify="space-between" align="flex-start" wrap="wrap">
            <div style={{ flex: 1 }}>
              <Text size="lg" fw={500}>
                Low Stock Alert
              </Text>
              <Text size="sm" c="dimmed">
                Get notified when products are running low
              </Text>
            </div>

            <Checkbox
              mt="md"
              checked={lowStockAlert}
              onChange={(event) =>
                setLowStockAlert(event.currentTarget.checked)
              }
            />
          </Group>
        </Card>

        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="flex-1"
        >
          <Text size="xl" fw={600}>
            Data Management
          </Text>
          <Text size="sm" c="dimmed" mb={"xl"}>
            Manage your data and export options
          </Text>

          <Text fw={500}>Export Data</Text>
          <Text size="sm" c="dimmed" mb={"sm"}>
            Download your inventory and order history (NOT AVAILABLE)
          </Text>

          <Group>
            <Button variant="filled" color="gray">
              Export Inventory
            </Button>
            <Button variant="filled" color="gray">
              Export Order
            </Button>
          </Group>
        </Card>
      </div>

      <Group justify={isMobile ? "space-between" : "end"}>
        <Button 
          size="md" 
          variant="filled" 
          color="blue"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
        <Button 
          size="md" 
          variant="filled" 
          color="red"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Group>
    </div>
  );
}
