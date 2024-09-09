/* eslint-disable react/no-unescaped-entities */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  HandCoins,
  Heart,
  Menu,
  Package2,
  Receipt,
  Search,
  Shirt,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Link from "next/link";

import { cn } from "@/lib/utils";
import React from "react"
import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
import Payment from "./Payment"
import { getUser } from "@/actions/actions"
import { getStoreByUserId } from "./actions"
import { Store } from "@prisma/client"





interface ExtraStore extends Store {
  paymentRequest : PaymentRequest
}


const Page =  async () => {


  const user = await getUser()
  if(!user) return
  const store = await getStoreByUserId(user!.id!)
  const pendingRequest = store.paymentRequest.find(request => request.status === 'PENDING');

  return (
    <>


  
<p className="text-sm text-gray-700 mb-2">SellerDashboard/wallet</p>
<h1 className="text-2xl font-semibold mb-8">Your Wallet</h1>



      <div className="flex flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.revenue.toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requested Amount
              </CardTitle>
              <HandCoins className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div>
              {pendingRequest ? (
                <div className="text-2xl font-bold">
                  {pendingRequest.requestedAmount.toFixed(2)} TND
                </div>
              ) : (
                <div className="text-2xl font-bold">0.00 TND</div>
              )}
            </div>            
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Total Unreceived Payments                
              </CardTitle>
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{(store.revenue - store.receivedPayments).toFixed(2)} TND</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              Total Received Payments                
              </CardTitle>
              <Receipt className="h-6 w-66 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{store.receivedPayments.toFixed(2)} TND</div>
            </CardContent>
          </Card>

           </section>



    <section>
    <Payment store={store} />
    </section>

  </div>

  </>
  );
}

export default Page;