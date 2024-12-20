'use client'
import NextImage from 'next/image'
import {
  Bell,
  Home,
  LayoutDashboard,
  Receipt,
  Settings,
  Shirt,
  ShoppingBasket,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import {  getUnreadAffiliateNotifications, getUser } from "@/actions/actions"
import { useEffect, useState } from "react"
import { AffiliateNotification } from "@prisma/client"
import { getAffiliateIdByUserId } from '@/app/(sections)/affiliateDashboard/products/actions'



const SideBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  // user state
  const [notifications, setNotifications] = useState<AffiliateNotification[]>([]); 

    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const user = await getUser()
          if(!user) return
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
    <div className="hidden w-[230px] border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14  items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
        <div style={{ width: '50px', height: '50px' }} className='h-full animate-pulse'>
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
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard"
              })}
              onClick={()=>router.push("/affiliateDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </Button>

            <Button
            variant="ghost"
            className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/products"
              })}
              onClick={()=>router.push("/affiliateDashboard/products")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Products
            </Button>

            <Button
            variant="ghost"
            className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
              " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/manageLinks"
              })}
              onClick={()=>router.push("/affiliateDashboard/manageLinks")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Shirt className="h-4 w-4" />
              </div>
              Manage Links
            </Button>

  

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/orders"
              })}              
              onClick={()=>router.push("/affiliateDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              Orders
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/wallet"
              })}             
               onClick={()=>router.push("/affiliateDashboard/wallet")}
               variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              Wallet
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/requests"
              })}              
              onClick={()=>router.push("/affiliateDashboard/requests")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Receipt className="h-4 w-4" />
              </div>
              Requested Payments
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/notifications"
              })}              
              onClick={()=>router.push("/affiliateDashboard/notifications")}
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


            <Separator className="my-3" />

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/affiliateDashboard/settings"
              })}              
              onClick={()=>router.push("/affiliateDashboard/settings")}            variant="ghost"

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
        </div>
      </div>
    </div>
  );
};

export default SideBar;
