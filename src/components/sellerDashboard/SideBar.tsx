'use client'
import NextImage from 'next/image'
import Link from "next/link"
import {
  BadgeDollarSign,
  Bell,
  BookOpenCheck,
  Box,
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
  Receipt,
  Search,
  Settings,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingUp,
  TriangleAlert,
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
import { getSideBarTotalCounts, getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions"
import { useEffect, useState } from "react"
import { Notification } from "@prisma/client"



const SideBar = () => {

    const pathname = usePathname();
    const router = useRouter()
    const [notifications, setnotifications] = useState<Notification[]>(); // Initialize count state


    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const user = await getUser()
          if(!user) return
          const store = await getStoreByUserId(user!.id!)
          const notifications = await getUnreadNotificationsForStore(store.id)
          setnotifications(notifications); // Update count state with fetched data
        } catch (error) {
          console.error('Error fetching sidebar counts:', error);
        }
      };
  
      fetchCounts();
    }, []);

  return (
    <div className="hidden w-[230px] border-r bg-muted/40 md:block">
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
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard"
              })}
              onClick={()=>router.push("/sellerDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-3 w-3" />
              </div>
              Dashboard
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/products"
              })}
              onClick={()=>router.push("/sellerDashboard/products")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-3 w-3" />
              </div>
              Products
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/designs"
              })}              
              onClick={()=>router.push("/sellerDashboard/designs")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-3 w-3" />
              </div>
              Designs
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/orders"
              })}              
              onClick={()=>router.push("/sellerDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-3 w-3" />
              </div>
              Orders
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/wallet"
              })}             
               onClick={()=>router.push("/sellerDashboard/wallet")}
               variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BadgeDollarSign className="h-3 w-3" />
              </div>
              Wallet
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/requests"
              })}              
              onClick={()=>router.push("/sellerDashboard/requests")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-3 w-3" />
              </div>
              Requested Payments
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/notifications"
              })}              
              onClick={()=>router.push("/sellerDashboard/notifications")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-3 w-3" />
              </div>
              Notifications
              {notifications && notifications?.length > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                notifications?.length
                  }
              </Badge>
               )}
            </Button>

            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/guide"
              })}              
              onClick={()=>router.push("/sellerDashboard/guide")}            
              variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BookOpenCheck className="h-3 w-3" />
              </div>
              Guide
            </Button>


            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/"
              })}              
              onClick={()=>router.push("/sellerDashboard")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <TriangleAlert className="h-3 w-3" />
              </div>
              Stock
            </Button>

            <Separator className="my-3" />


            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/settings"
              })}              
              onClick={()=>router.push("/sellerDashboard/settings")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-3 w-3" />
              </div>
              Settings
            </Button>


            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
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
