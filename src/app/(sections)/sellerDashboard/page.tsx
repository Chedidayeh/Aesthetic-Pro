/* eslint-disable react/no-unescaped-entities */
import NextImage from 'next/image';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Heart,
  Menu,
  Package2,
  Search,
  Shirt,
  User,
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
import { getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions";
import React from "react"
import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
import BanUser from '@/components/BanUser';
import { getStoreFollowersCount } from '../MarketPlace/store/[storeName]/actions';








const Page =  async () => {


  const user = await getUser()
  if(!user) return
  const store = await getStoreByUserId(user!.id!)
  const notifications = await getUnreadNotificationsForStore(store.id)
  const followersCount = await getStoreFollowersCount(store!.id);

  return (
    <>

    <BanUser  user={user!} />



  
         <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
         {notifications.length > 0 && (
         <Link href={"/sellerDashboard/notifications"}><Button variant={"link"}>You Have {notifications.length} unread notifications</Button></Link>
         )}

      <div className="flex flex-col items-center my-8">
      <div className="flex justify-center items-center">
        <div className="relative w-[200px] h-[200px] rounded-full bg-gray-100 border-2 shadow-xl shadow-blue-200 border-gray-500 overflow-hidden">
          <NextImage
            src={store.logoUrl}
            alt="store"
            layout="fill"
            objectFit="cover"
            quality={40}
            className="rounded-full"
          />
        </div>
      </div>

        <div className="text-center font-extrabold text-xl text-blue-500 mt-8">
          {store.storeName}
        </div>
      </div>


   


      <div className="flex flex-col gap-5 w-full">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.revenue.toFixed(2)} TND</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sales
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.totalSales} sales</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Followers
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{followersCount} {followersCount === 1 ? 'follower' : 'followers'}</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total likes
                </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.totalLikes} likes</div>
            </CardContent>
          </Card>


          <OrderedProducts/>

          <OrderedDesigns/>

      
    </section>



    <section className={cn(' grid grid-cols-1 p-11 gap-4 transition-all lg:grid-cols-4')}>
</section>

  </div>

  </>
  );
}

export default Page;