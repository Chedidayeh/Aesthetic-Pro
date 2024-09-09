'use client'
import NextImage from 'next/image'
import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  Layers3,
  LayoutDashboard,
  LayoutGrid,
  LineChart,
  Menu,
  Package,
  Package2,
  Palette,
  Search,
  Settings,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { getSideBarTotalCounts } from "@/actions/actions"
import { useEffect, useState } from "react"


interface Count {
  printedOrdersCount: number;
  awaitingActionProductCount: number;
  awaitingActionDesignCount: number;
  storeRequestsCount: number;
  returnedOrders : number
}
const SideBar = () => {

    const pathname = usePathname();
    const router = useRouter()
    const [count, setCount] = useState<Count>(); // Initialize count state


    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const totalCounts = await getSideBarTotalCounts();
          setCount(totalCounts); // Update count state with fetched data
        } catch (error) {
          console.error('Error fetching sidebar counts:', error);
        }
      };
  
      fetchCounts();
    }, []);

  return (
    <div className="hidden w-[240px] border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14  items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <div style={{ width: '50px', height: '50px' }} className='h-full'>
          <NextImage
              src={"/aestheticpro.png"}
              width={1000}
              height={1000}
              alt="logo"
          />
      </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start space-y-2 px-2 text-sm font-medium lg:px-4">
         
          <Button
              variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard"
              })}
              onClick={()=>router.push("/adminDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-3 w-3" />
              </div>
              Dashboard
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/stores")
              })}
              onClick={()=>router.push("/adminDashboard/stores")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Store className="h-3 w-3" />
              </div>
              Manage Stores
              {(count?.awaitingActionProductCount ?? 0) + (count?.awaitingActionDesignCount ?? 0) > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (count?.awaitingActionProductCount ?? 0) + (count?.awaitingActionDesignCount ?? 0)
                  }
              </Badge>
               )}
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/requests")
              })}
              onClick={()=>router.push("/adminDashboard/requests")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Store className="h-3 w-3" />
              </div>
              Manage Requests
              {(count?.storeRequestsCount ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.storeRequestsCount ?? 0)
                    }
                </Badge>
                )}
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/products"
              })}
              onClick={()=>router.push("/adminDashboard/products")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-3 w-3" />
              </div>
              Manage Products
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/designs"
              })}              
              onClick={()=>router.push("/adminDashboard/designs")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-3 w-3" />
              </div>
              Manage Designs
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/orders")
              })}              
              onClick={()=>router.push("/adminDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-3 w-3" />
              </div>
              
              Manage Orders
              {(count?.printedOrdersCount ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.printedOrdersCount ?? 0)
                    }
                </Badge>
                )}
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/returns")
              })}              
              onClick={()=>router.push("/adminDashboard/returns")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-3 w-3" />
              </div>
              
              Manage Returns
              {(count?.returnedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.returnedOrders ?? 0)
                    }
                </Badge>
                )}
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/stock"
              })}              
              onClick={()=>router.push("/adminDashboard/stock")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Layers3 className="h-3 w-3" />
              </div>
              Manage Stock
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/category")
              })}              
              onClick={()=>router.push("/adminDashboard/category")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutGrid className="h-3 w-3" />
              </div>
              Manage Categories
            </Button>

            



            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/notifications"
              })}              
              onClick={()=>router.push("/adminDashboard/notifications")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-3 w-3" />
              </div>
              Send Notification
            </Button>

            <Separator className="my-3" />




            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/settings"
              })}              
              onClick={()=>router.push("/adminDashboard/settings")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-3 w-3" />
              </div>
              Settings
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/"
              })}              
              onClick={()=>router.push("/PodProducts")}            variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-3 w-3" />
              </div>
              MarketPlace
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
