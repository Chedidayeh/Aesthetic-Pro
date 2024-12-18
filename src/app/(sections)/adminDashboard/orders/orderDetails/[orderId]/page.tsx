/* eslint-disable react/no-unescaped-entities */
'use server';

import DesignOrderView from "./DesignOrderView";
import ProductOrderView from "./ProductOrderView";
import { calculateTotalSellerProfiForProducts, calculateTotalSellerProfitForDesigns, getOrderWithItemsAndProducts } from "./actions";
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
import Link from 'next/link';  // Import Link for navigation

interface PageProps {
  params: {
    orderId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { orderId } = params;
  try {
    const productOrderProfit = await calculateTotalSellerProfiForProducts(orderId);
    const designOrderProfit = await calculateTotalSellerProfitForDesigns(orderId);

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
            <Link href="/adminDashboard">
              <AlertDialogAction>Go to Dashboard</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
    }
    if (!order?.isClientMadeOrder) {
      return <ProductOrderView order={order} profit={productOrderProfit} />;
    } else {
      return <DesignOrderView order={order} profit={designOrderProfit} />;
    }
  } catch (error) {
    console.error('Error fetching order:', error);
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
            <Link href="/adminDashboard">
              <AlertDialogAction>Go to Dashboard</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

export default Page;
