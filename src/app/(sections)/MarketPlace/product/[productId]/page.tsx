'use server'

import { db } from "@/db";
import { Product } from "@prisma/client";
import { notFound } from "next/navigation";
import ViewProduct from "./viewProduct"
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
import { fetchDesignById, fetchProductsByCategory, getPlatformForTheWebsite, getUser } from "@/actions/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategory, getSizes, trackProductView } from "./actions";
import { cookies } from "next/headers";
interface PageProps {
  params: {
    productId: string
  }
}


const NoProductFound = () => {
  return (
    <AlertDialog open={true} >
    <AlertDialogContent>
    <AlertDialogHeader className="flex flex-col items-center">
        <div className="text-red-500 mb-2">
            <OctagonAlert className=''/>
        </div>
        <AlertDialogTitle className="text-xl font-bold text-center">
            No product found ! 
        </AlertDialogTitle>
        <AlertDialogDescription>
            Return to home page and try again !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <Link  href="/MarketPlace" ><Button variant="link">
        Return
                    </Button>
                    </Link>
                </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
  )
}




const Page = async ({ params }: PageProps) => {

  const { productId } = params

  try {

    await trackProductView(productId);

    const user = await getUser()

    const product = await db.product.findFirst({
      where : {id : productId , isProductAccepted : true , privateProduct : false },
      include : {
        store : true
      }
      });

      if (!product) return NoProductFound()
      
        const frontdesign = await fetchDesignById(product.frontDesignId ? product.frontDesignId : "")
        const backdesign = await fetchDesignById(product.backDesignId ? product.backDesignId : "")

        const categoryProducts = await fetchProductsByCategory(product.category)
        const filteredProducts = categoryProducts!.filter(item => item.id !== product.id);

        const category = await getCategory(product.category)

        const sizes = await getSizes(product.category);

        const platform  = await getPlatformForTheWebsite()


        return (
          <ViewProduct product={product} frontdesign={frontdesign!} backdesign={backdesign!} user={user!} categoryProducts={filteredProducts} category={category!} sizes={sizes} platform={platform!}  />
        )

  } catch (error) {
    console.log(error)
    return NoProductFound()

  }








}

export default Page