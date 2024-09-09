'use server';

import DesignOrderView from "./DesignOrderView";
import ProductOrderView from "./ProductOrderView";
import { calculateTotalSellerProfiForProducts, calculateTotalSellerProfitForDesigns, getAllPodProductsOrdersIds, getOrderWithItemsAndProducts } from "./actions";

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

const Page = async ({ params }: PageProps) => {
  const { orderId } = params;
  try {
    const productOrderProfit = await calculateTotalSellerProfiForProducts(orderId)
    const designOrderProfit = await calculateTotalSellerProfitForDesigns(orderId)

    const order = await getOrderWithItemsAndProducts(orderId);
    if(!order?.isClientMadeOrder){
      return <ProductOrderView order={order} profit={productOrderProfit} />;
    }
    else {
      return <DesignOrderView order={order} profit={designOrderProfit} />;
    }

  } catch (error) {
    console.error('Error fetching order:', error);
    // Handle error or return an error view/component
    return <div>Error fetching order. Please try again later.</div>;
  }
};

export default Page;
