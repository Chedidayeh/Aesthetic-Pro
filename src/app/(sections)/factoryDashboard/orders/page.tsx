/* eslint-disable react/no-unescaped-entities */
'use server'


import React from "react"
import OrderView from "./OrderView"
import { getAllOrders } from "./actions"
import { unstable_noStore as noStore } from "next/cache"



const Page =  async () => {

  noStore()

  const orders = await getAllOrders(10,false);

  return (
    <>

    <OrderView initialeOrders = {orders} />

  </>
  );
}

export default Page;