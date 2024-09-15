/* eslint-disable react/no-unescaped-entities */


import React from "react"
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