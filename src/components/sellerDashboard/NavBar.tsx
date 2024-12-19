/* eslint-disable react/no-unescaped-entities */
'use client'
import Link from "next/link"
import {
  Bell,
  BookOpenCheck,
  ExternalLink,
  Home,
  LayoutDashboard,
  Menu,
  Palette,
  Receipt,
  Settings,
  Shirt,
  ShoppingBasket,
  Star,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions"
import { Notification, User } from "@prisma/client"
import { ModeToggle } from "../ModeToggle"
import React from "react"
import SellerProfile from "./SellerProfile"


const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([]); 
  const [storeName, setStore] = useState(""); 
// user state
const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user = await getUser()
        if(!user) return
        setUser(user)
        const store = await getStoreByUserId(user!.id!)
        setStore(store.storeName)
        const notifications = await getUnreadNotificationsForStore(store.id)
        setNotifications(notifications); // Update count state with fetched data
      } catch (error) {
        console.error('Error fetching sidebar counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleButtonClick = () => {
    const url = `/MarketPlace/store/${storeName}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard"
              })}
              onClick={()=>router.push("/sellerDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </Button>

            <Button
            variant="ghost"
            className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/products"
              })}
              onClick={()=>router.push("/sellerDashboard/products")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Products
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/designs"
              })}              
              onClick={()=>router.push("/sellerDashboard/designs")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              Designs
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/orders"
              })}              
              onClick={()=>router.push("/sellerDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              Orders
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/wallet"
              })}             
               onClick={()=>router.push("/sellerDashboard/wallet")}
               variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              Wallet
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/requests"
              })}              
              onClick={()=>router.push("/sellerDashboard/requests")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-4 w-4" />
              </div>
              Requested Payments
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/notifications"
              })}              
              onClick={()=>router.push("/sellerDashboard/notifications")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Bell className="h-4 w-4" />
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
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/storeLevel"
              })}              
              onClick={()=>router.push("/sellerDashboard/storeLevel")}            
              variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Star className="h-4 w-4" />
              </div>
              Store Level
            </Button>

            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/guide"
              })}              
              onClick={()=>router.push("/sellerDashboard/guide")}            
              variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <BookOpenCheck className="h-4 w-4" />
              </div>
              Guide
            </Button>


            <Separator className="my-3" />


            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/sellerDashboard/settings"
              })}              
              onClick={()=>router.push("/sellerDashboard/settings")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-4 w-4" />
              </div>
              Settings
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
              })}              
              onClick={()=>router.push("/MarketPlace")}            variant="ghost"


            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Home className="h-4 w-4" />
              </div>
              MarketPlace
            </Button>

          </nav>

          </ScrollArea>

        </SheetContent>
      </Sheet>


      <div className="w-full flex-1">
          <div className="relative  ">
          <Button className="animate-borderPulse" variant={"outline"} size={"sm"} onClick={handleButtonClick}>
      View your store               
      <ExternalLink className="ml-1 w-4 h-4"/>
    </Button>
          </div>
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
  <Link href={"/sellerDashboard/notifications"}>
    <Button size={"sm"} variant={"link"}>View all</Button>
  </Link>
</DropdownMenuLabel>

    <DropdownMenuSeparator />
    <ScrollArea
      className={`w-full ${notifications.length > 0 ? "h-60" : ""}`}
          >    
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
    </ScrollArea>
  </DropdownMenuContent>
</DropdownMenu>

      <ModeToggle/>

      {/* user Image */}

    <SellerProfile user={user!}/>

    </header>
  );
};

export default NavBar;
