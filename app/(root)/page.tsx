"use client";

import { useAppContext } from "@/context";
import { getData } from "@/utils/api";
import { useEffect, useState } from "react";
import {
  Package,
  TrendingDown,
  Users,
  ShoppingBasket,
  ClockFading,
  BanknoteArrowUp,
  BanknoteArrowDown,
  HandCoins,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, Text, Group, Container } from "@mantine/core";
import { useRouter } from "next/navigation";

interface Dashboard {
  productCount: number;
  lowStockItems: number;
  activeSupplies: number;
  organizationCount: number;
  pendingOrders: number;
  monthlySupplyExpense: number;
  monthlySalesRevenue: number;
  monthlyProfit: number;
  dailyFinance: {
    dates: Date[];
    dailyRevenue: number[];
    dailyExpense: number[];
  };
  lastProcessedOrders: [
    {
      orderId: number;
      productName: string;
      detail: string;
      updatedAt: string;
    }
  ];
}

export default function Home() {
  const [dashInfo, setDashInfo] = useState<Dashboard>();
  const { currency, setCurrency } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    fetchProductCount();
  }, []);

  const fetchProductCount = async () => {
    try {
      const res = await getData("dash");
      const response = res.data;
      setDashInfo(response.data || []);
    } catch (error) {
      console.log("Error fetching dashboard informations:", error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // in seconds

    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "week", seconds: 604800 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 },
    ];

    for (const unit of units) {
      const value = Math.floor(diff / unit.seconds);
      if (value >= 1) {
        return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Container
        fluid
        py="sm"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCardComponent
          title="Total Products"
          value={dashInfo?.productCount}
          description="All time"
          icon={<Package className="h-6 w-6 text-muted-foreground" />}
        />

        <DashboardCardComponent
          title="Low Stock Products"
          value={dashInfo?.lowStockItems}
          description="Less than 50"
          icon={<TrendingDown className="h-6 w-6 text-destructive" />}
        />

        <DashboardCardComponent
          title="Active Supplies"
          value={dashInfo?.activeSupplies}
          description="Supplies have remaining quantity"
          icon={<ShoppingBasket className="h-6 w-6 text-muted-foreground" />}
        />

        <DashboardCardComponent
          title="Total Organization"
          value={dashInfo?.organizationCount}
          description="All time"
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
        />

        <DashboardCardComponent
          title="Pending Orders"
          value={dashInfo?.pendingOrders}
          description="Awaiting processing"
          icon={<ClockFading className="h-6 w-6 text-muted-foreground" />}
        />

        <DashboardCardComponent
          title={`Monthly Income (${currency})`}
          value={dashInfo?.monthlySalesRevenue}
          description="Total sales revenue this month"
          icon={<BanknoteArrowUp className="h-6 w-6 text-muted-foreground" />}
        />

        <DashboardCardComponent
          title={`Monthly Expenditure (${currency})`}
          value={dashInfo?.monthlySupplyExpense}
          description="Total supply expense this month"
          icon={<BanknoteArrowDown className="h-6 w-6 text-muted-foreground" />}
        />

        <DashboardCardComponent
          title={`Monthly Profit (${currency})`}
          value={dashInfo?.monthlyProfit}
          description="Total monthly income and expenses"
          icon={<HandCoins className="h-6 w-6 text-muted-foreground" />}
        />
      </Container>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card
          className="col-span-4"
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
        >
          <Text size="lg" fw={500} mb="sm">
            Inventory Overview
          </Text>
          {dashInfo?.dailyFinance ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dashInfo.dailyFinance.dates.map((date, index) => ({
                  date: new Date(date).toLocaleDateString(),
                  revenue: dashInfo.dailyFinance.dailyRevenue[index],
                  expense: dashInfo.dailyFinance.dailyExpense[index],
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4ade80" name="Revenue" />
                <Line type="monotone" dataKey="expense" stroke="#f87171" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Loading chart...
            </div>
          )}
        </Card>


        <Card
          className="col-span-3"
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
        >
          <div className="flex items-center justify-between mb-4">
            <Text size="lg" fw={500}>
              Recent Activities
            </Text>
            <button
              onClick={() => router.push("/transactions")}
              className="text-sm text-blue-600 hover:underline"
            >
              Show All
            </button>
          </div>

          <div className="space-y-4 py-4">
            {dashInfo?.lastProcessedOrders.map((o, index) => (
              <div
                key={o.orderId || index}
                className="flex items-center space-x-3"
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p>
                    {o.detail} ({o.productName})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getTimeAgo(o.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const DashboardCardComponent = ({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value?: number | undefined;
  description: string;
  icon: React.ReactNode;
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder>
    <Group justify="space-between" mt="md" mb="xs">
      <Text size="lg" fw={500}>
        {title}
      </Text>
      {icon}
    </Group>
    <Text size="var(--text-3xl)" fw={600} mb={"sm"}>
      {value ?? "-"}
    </Text>
    <Text size="sm" c="dimmed">
      {description}
    </Text>
  </Card>
);
