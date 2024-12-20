/* eslint-disable react/no-unescaped-entities */


import React from "react"
import { getAllDesignsWithProducts } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import DesignView from "./DesignView"


const Page =  async () => {
  noStore()
  const initialDesigns = await getAllDesignsWithProducts(10);

  return (
    <>

    <DesignView initialDesigns = {initialDesigns} />

  </>
  );
}

export default Page;