/* eslint-disable react/no-unescaped-entities */

import React from "react"
import StoresView from "./StoresView"
import { unstable_noStore as noStore } from "next/cache"
import { getAllStoresWithUsersAndCounts } from "./actions"


const Page =  async () => {

  noStore()

  const initialeStores = await getAllStoresWithUsersAndCounts(10);

  return (
    <>
    <StoresView initialeStores = {initialeStores} />
  </>
  );
}

export default Page;