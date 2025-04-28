'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  History,
  Settings,
  BarChart3,
  BadgeCent,
  ShoppingBag,
  Check,
  X
} from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Organizations', href: '/organizations', icon: Users },
  { name: 'Transactions', href: '/transactions', icon: History },
  // { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`h-screen sticky top-0 left-0 z-20 flex flex-col border-r bg-card transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-2xl font-bold">Inventory MS</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-muted">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>


      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">

          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[20px] transition-colors
                    ${isActive
                      ? 'bg-gray-200 text-foreground font-bold'
                      : 'text-muted-foreground hover:bg-gray-200 font-medium'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon className="h-7 w-7" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}

        </ul>
      </nav>
    </aside>
  )
}
