'use server';

import { getAllPodProductsOrdersIds } from "@/app/(sections)/adminDashboard/orders/orderDetails/[orderId]/actions";
import DesignOrderView from "./DesignOrderView";
import ProductOrderView from "./ProductOrderView";
import { getOrderWithItemsAndProducts } from "./actions";

interface PageProps {
  params: {
    orderId: string;
  };
}


// export async function generateStaticParams() {
//   const OrdersIds = await getAllPodProductsOrdersIds()
//   return OrdersIds.map((orderId) => ({
//     orderId,
//   }))
// }

import { unstable_noStore as noStore } from "next/cache"


const Page = async ({ params }: PageProps) => {

  noStore()

  const { orderId } = params;
  try {

    const order = await getOrderWithItemsAndProducts(orderId);
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
