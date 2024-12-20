'use client'
import {
  Bell,
  Home,
  Layers3,
  LayoutDashboard,
  LayoutGrid,
  Menu,
  Palette,
  Settings,
  Shirt,
  ShoppingBasket,
  Store,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getSideBarTotalCounts } from "@/actions/actions"
import { ModeToggle } from "../ModeToggle"

interface Count {
  printedOrdersCount: number;
  awaitingActionProductCount: number;
  awaitingActionDesignCount: number;
  storeRequestsCount: number;
  affiliateRequestsCount : number
  returnedOrders : number
}

const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  const [count, setCount] = useState<Count>(); // Initialize count state


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const totalCounts = await getSideBarTotalCounts()
        setCount(totalCounts); // Update count state with fetched data
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
        <SheetContent side="left" className="flex flex-col w-[50%]">
        <ScrollArea className="h-full w-full">
          <nav className="grid gap-2 text-lg font-medium">



          <Button
              variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard"
              })}
              onClick={()=>router.push("/adminDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/users"
              })}
              onClick={()=>router.push("/adminDashboard/users")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <User className="h-4 w-4" />
              </div>
              Manage Users
            </Button>

            <Button
            variant="ghost"
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/stores"
              })}
              onClick={()=>router.push("/adminDashboard/stores")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Store className="h-4 w-4" />
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
                <Store className="h-4 w-4" />
              </div>
              Manage Requests
              {(count?.storeRequestsCount ?? 0) > 0 && (count?.affiliateRequestsCount ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.storeRequestsCount ?? 0) + (count?.affiliateRequestsCount ?? 0)
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
                <Shirt className="h-4 w-4" />
              </div>
              Manage Products
              {(count?.awaitingActionProductCount ?? 0) > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (count?.awaitingActionProductCount ?? 0)
                  }
              </Badge>
               )}
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/designs"
              })}              
              onClick={()=>router.push("/adminDashboard/designs")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Palette className="h-4 w-4" />
              </div>
              Manage Designs
              {(count?.awaitingActionDesignCount ?? 0) > 0 && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {
                (count?.awaitingActionDesignCount ?? 0)
                  }
              </Badge>
               )}
            </Button>
            
            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-200 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/orders")
              })}              
              onClick={()=>router.push("/adminDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
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
                <ShoppingBasket  className="h-4 w-4" />
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
                <Layers3 className="h-4 w-4" />
              </div>
              Manage Stock
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-200 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname.startsWith("/adminDashboard/category")
              })}              
              onClick={()=>router.push("/adminDashboard/category")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutGrid className="h-4 w-4" />
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
                <Bell className="h-4 w-4" />
              </div>
              Send Notification
            </Button>

            <Separator className="my-3" />

 


            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/"
              })}              
              onClick={()=>router.push("/adminDashboard/settings")}            variant="ghost"

            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-4 w-4" />
              </div>
              Settings
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:text-blue-600 dark:text-zinc-400 dark:hover:text-gray-50", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/adminDashboard/"
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

      </div>

      <ModeToggle/>
    </header>
  );
};

export default NavBar;
