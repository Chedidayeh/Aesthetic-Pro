/* eslint-disable react/no-unescaped-entities */

import React from "react"
import StoresView from "./StoresView"
import { getAllStoresWithUsers } from "./actions"
import { unstable_noStore as noStore } from "next/cache"


const Page =  async () => {

  noStore()

  const stores = await getAllStoresWithUsers();

  return (
    <>
    <StoresView stores = {stores} />
  </>
  );
}

export default Page;