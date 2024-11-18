/* eslint-disable react/no-unescaped-entities */
'use client'
import Link from "next/link"
import {
  BadgeDollarSign,
  Bell,
  BookOpenCheck,
  Box,
  CircleUser,
  ExternalLink,
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
import { cn } from "@/lib/utils"
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
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getSideBarTotalCounts, getStoreByUserId , getUnreadAffiliateNotifications, getUnreadNotificationsForStore, getUser } from "@/actions/actions"
import { AffiliateNotification, Notification, User } from "@prisma/client"
import { ModeToggle } from "../ModeToggle"
import React from "react"
import SellerProfile from "./SellerProfile"
import { getAffiliateIdByUserId } from "@/app/(sections)/affiliateDashboard/products/actions"

const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
// user state
const [user, setUser] = useState<User>();
const [notifications, setNotifications] = useState<AffiliateNotification[]>([]); 

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const user = await getUser()
      if(!user) return
      setUser(user)
      const affiliateId = await getAffiliateIdByUserId(user.id)
      const notifications = await getUnreadAffiliateNotifications(affiliateId)
      setNotifications(notifications); 
    } catch (error) {
      console.error('Error fetching sidebar counts:', error);
    }
  };

  fetchCounts();
}, []);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">


      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
        <ScrollArea className="h-full w-full">
          <nav className="grid gap-2 text-lg font-medium">



          <Button
              variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard"
              })}
              onClick={()=>router.push("/affiliateDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-3 w-3" />
              </div>
              Dashboard
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/products"
              })}
              onClick={()=>router.push("/affiliateDashboard/products")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-3 w-3" />
              </div>
              Products
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/manageLinks"
              })}
              onClick={()=>router.push("/affiliateDashboard/manageLinks")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-3 w-3" />
              </div>
              Manage Links
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/orders"
              })}              
              onClick={()=>router.push("/affiliateDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-3 w-3" />
              </div>
              Orders
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/wallet"
              })}             
               onClick={()=>router.push("/affiliateDashboard/wallet")}
               variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BadgeDollarSign className="h-3 w-3" />
              </div>
              Wallet
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/requests"
              })}              
              onClick={()=>router.push("/affiliateDashboard/requests")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-3 w-3" />
              </div>
              Requested Payments
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/notifications"
              })}              
              onClick={()=>router.push("/affiliateDashboard/notifications")}
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

            <Separator className="my-3" />

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/settings"
              })}              
              onClick={()=>router.push("/affiliateDashboard/settings")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-3 w-3" />
              </div>
              Settings
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
              })}              
              onClick={()=>router.push("/MarketPlace")}            variant="ghost"


            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-3 w-3" />
              </div>
              MarketPlace
            </Button>

          </nav>

          </ScrollArea>

        </SheetContent>
      </Sheet>


      <div className="w-full flex-1">

      </div>
      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary" size="icon" className="rounded-full">
    <Bell
        className={`h-5 w-5 ${notifications.length > 0 ? 'animate-bounce text-yellow-500' : ''}`}
      />
      <span className="sr-only">Notifications</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
  <DropdownMenuLabel className="flex justify-between items-center">
  <span>My Notifications</span>
  <Link href={"/affiliateDashboard/notifications"}>
    <Button size={"sm"} variant={"link"}>View all</Button>
  </Link>
</DropdownMenuLabel>

    <DropdownMenuSeparator />
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <DropdownMenuItem>
            <div className="flex flex-col">
              <span className={`text-sm ${notification.isViewed ? 'text-gray-500' : 'font-bold'}`}>
                {notification.content}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </DropdownMenuItem>
          {index < notifications.length - 1 && <DropdownMenuSeparator />}
        </React.Fragment>
      ))
    ) : (
      <DropdownMenuItem>You don't have any new notifications for now !</DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>

      <ModeToggle/>

      {/* user Image */}

    <SellerProfile user={user!}/>

    </header>
  );
};

export default NavBar;
