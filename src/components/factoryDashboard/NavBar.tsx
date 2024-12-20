'use client'
import {
  Home,
  LayoutDashboard,
  Menu,
  ShoppingBasket,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { getFactoryDashboardCounts } from "@/actions/actions"
import { ModeToggle } from "../ModeToggle"

interface Count {
  notPrintedOrders: number;
}

const NavBar = () => {

  const pathname = usePathname();
  const router = useRouter()
  const [count, setCount] = useState<Count>(); // Initialize count state


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const totalCounts = await getFactoryDashboardCounts();
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
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                "gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/factoryDashboard"
              })}
              onClick={()=>router.push("/factoryDashboard")}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </Button>

            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
                " gap-2 rounded-lg bg-gray-100 px-3 py-2 text-blue-600  transition-all hover:text-blue-600 dark:bg-blue-200 dark:text-blue-600 dark:hover:text-blue-600": pathname === "/factoryDashboard/orders"
              })}              
              onClick={()=>router.push("/factoryDashboard/orders")}
              variant="ghost"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <ShoppingBasket  className="h-4 w-4" />
              </div>
              
              Manage Orders
              {(count?.notPrintedOrders ?? 0) > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {
                  (count?.notPrintedOrders ?? 0)
                    }
                </Badge>
                )}
            </Button>




            <Separator className="my-3" />



            <Button
              className={cn("justify-start gap-2 rounded-lg px-3 py-2 transition-all hover:text-blue-600", {
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
