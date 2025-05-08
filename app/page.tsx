"use client"

import { useAppContext } from "@/context"
import { getData } from "@/utils/api"
import { useEffect, useState } from "react"
import { 
  Package, 
  TrendingDown, 
  Users, 
  ShoppingBasket,
  ClockFading,
  BanknoteArrowUp,
  BanknoteArrowDown,
  HandCoins
} from "lucide-react"

interface Dashboard{
  productCount: number,
  lowStockItems: number,
  activeSupplies: number,
  organizationCount: number,
  pendingOrders: number,
  monthlySupplyExpense: number,
  monthlySalesRevenue: number,
  monthlyProfit: number
}

export default function Home() {
  const [dashInfo, setDashInfo] = useState<Dashboard>()
  const { currency, setCurrency } = useAppContext()
  
  useEffect(() => {
    fetchProductCount();
  }, [])

  const fetchProductCount = async () => {
    try {
      const res = await getData("dash");
      const response = res.data
      setDashInfo(response.data || []);
    } catch (error) {
        console.log('Error fetching dashboard informations:', error);
    }
  }
  

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Total Products</div>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold">{dashInfo?.productCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Low Stock Products</div>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold">{dashInfo?.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Less than 50</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Active Supplies</div>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold">{dashInfo?.activeSupplies}</div>
            <p className="text-xs text-muted-foreground">Supplies have remaining quantity</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Total Organization</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold">{dashInfo?.organizationCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Pending Orders</div>
            <ClockFading className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold">{dashInfo?.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Monthly Income</div>
            <BanknoteArrowUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold text-green-700">{dashInfo?.monthlySalesRevenue.toLocaleString('tr-TR')}{currency}</div>
            <p className="text-xs text-muted-foreground ">Total sales revenue this month</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Monthly Expenditure</div>
            <BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-2xl font-bold text-red-700">{dashInfo?.monthlySupplyExpense.toLocaleString('tr-TR')}{currency}</div>
            <p className="text-xs text-muted-foreground">Total supply expense this month</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <div className="text-sm font-medium">Monthly Profit</div>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="px-4 pb-4">
            <div className={`text-2xl font-bold ${
              (dashInfo?.monthlyProfit ?? 0) > 0
                ? "text-green-700"
                : (dashInfo?.monthlyProfit ?? 0) < 0
                ? "text-red-700"
                : ""
              }`}>
              {dashInfo?.monthlyProfit.toLocaleString('tr-TR')}{currency}
            </div>
            <p className="text-xs text-muted-foreground">Total monthly income and expenses</p>
          </div>
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-white shadow-md">
          <div className="p-4">
            <div className="text-lg font-medium">Inventory Overview</div>
          </div>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart will be implemented here
          </div>
        </div>

        <div className="col-span-3 rounded-lg border bg-white shadow-md">
          <div className="p-4">
            <div className="text-lg font-medium">Recent Activities</div>
          </div>
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Product stock updated
                  </p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
