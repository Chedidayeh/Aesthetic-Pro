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
import { getAffiliateLinksAndCommissions, getAffiliateStats, getAllCommissionsByAffiliateId, getStoreByUserId, getUnreadNotificationsForStore, getUser } from "@/actions/actions";
import React from "react"
import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
import BanUser from '@/components/BanUser';
import { getStoreFollowersCount } from '../MarketPlace/store/[storeName]/actions';
import { getAffiliateIdByUserId } from './products/actions';
import CommissionsTable from '@/components/affiliateDashboard/CommissionsTable';
import { getAffiliateNotification } from './notifications/actions';








const Page =  async () => {


  const user = await getUser()
  const affiliate = await getAffiliateLinksAndCommissions(user!.id)
  const affiliateStats  = await getAffiliateStats(user!.id)
  const commissions = await getAllCommissionsByAffiliateId(affiliate!.id)
  const notifications = await getAffiliateNotification(affiliate!.id)

  if(!user) return

  return (
    <>

    <BanUser  user={user!} />



  
         <h1 className="text-2xl font-semibold">Affiliate Dashboard</h1>
         {notifications.length > 0 && (
         <Link href={"/affiliateDashboard/notifications"}><Button variant={"link"}>You Have {notifications.length} unread notifications</Button></Link>
         )}


   


      <div className="flex flex-col gap-5 w-full my-4">

    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">



          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliate!.totalIncome.toFixed(2)} TND</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Links
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliate?.links.length}</div>
            </CardContent>
          </Card>


          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{affiliateStats.totalClicks}</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total sales
                </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{affiliateStats.totalSales}</div>
            </CardContent>
          </Card>

          <CommissionsTable commissions={commissions} affiliateStats={affiliateStats}  />
      
    </section>



  </div>

  </>
  );
}

export default Page;