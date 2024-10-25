/* eslint-disable react/no-unescaped-entities */


import React from "react"
import { getAllDesignsWithProducts } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import DesignView from "./DesignView"


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