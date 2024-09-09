'use server'

import { db } from "@/db";
import { Product } from "@prisma/client";
import { notFound } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { OctagonAlert } from "lucide-react";
import { auth } from "@/auth";
import Cart from "./Cart";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPlatformForTheWebsite, getUser } from "@/actions/actions";
import { fetchCartProducts } from "./actions";






const Page = async () => {

  try {

        const user = await getUser()

        const cartProductList = await fetchCartProducts(user?.id ? user.id : "")

        const platform  = await getPlatformForTheWebsite()

        return ( <Cart products={cartProductList!} user={user!} platform={platform!} /> )

  } catch (error) {
    console.log(error)
  }








}

export default Page