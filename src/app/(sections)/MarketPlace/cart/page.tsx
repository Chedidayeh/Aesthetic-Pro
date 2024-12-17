'use server'

import Cart from "./Cart";
import { getPlatformForTheWebsite, getUser } from "@/actions/actions";
import { fetchCartProducts } from "./actions";





const Page = async () => {
  try {

        const user = await getUser()

        const cartProductList = await fetchCartProducts(user?.id ? user.id : "")

        const platform  = await getPlatformForTheWebsite()

        return ( <Cart products={cartProductList!} user={user!} platform={platform!} /> )

  } catch (error) {
    console.log(error)
  }








}

export default Page