/* eslint-disable react/no-unescaped-entities */
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Heart,
  Menu,
  Package2,
  Palette,
  Search,
  Shirt,
  Store,
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
import { fetchProducts } from "@/actions/actions";
import React from "react"
import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
import { db } from "@/db"
import UsersTable from "@/components/adminDashboard/UsersTable"
import DesignView from "./DesignView"
import { getAllDesignsWithProducts } from "./actions"




import { unstable_noStore as noStore } from "next/cache"


const Page =  async () => {
  noStore()
  const designs = await getAllDesignsWithProducts();

  return (
    <>

    <DesignView designs = {designs} />

  </>
  );
}

export default Page;