/* eslint-disable react/no-unescaped-entities */
'use server';

import Link from "next/link";
import DesignOrderView from "./DesignOrderView";
import ProductOrderView from "./ProductOrderView";
import { getOrderWithItemsAndProducts } from "./actions";

interface PageProps {
  params: {
    orderId: string;
  };
}

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
} from "@/components/ui/alert-dialog";


import { unstable_noStore as noStore } from "next/cache"


const Page = async ({ params }: PageProps) => {

  noStore()

  const { orderId } = params;
  try {

    const order = await getOrderWithItemsAndProducts(orderId);
    if(!order) {
      return (
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>View Error</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Order Found</AlertDialogTitle>
            <AlertDialogDescription>
              We couldn't find the order with the provided ID. Please check the order ID and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/factoryDashboard">
              <AlertDialogAction>Go to Dashboard</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
    }
    if(!order?.isClientMadeOrder){
      return <ProductOrderView order={order} />;
    }
    else {
      return <DesignOrderView order={order}  />;
    }

  } catch (error) {
    console.error('Error fetching order:', error);
    // Handle error or return an error view/component
    return <div>Error fetching order. Please try again later.</div>;
  }
};

export default Page;
