
import { getUser } from "@/actions/actions"
import { unstable_noStore as noStore } from "next/cache"
import { getAffiliateOrdersWithCommission } from "./actions"
import ViewOrders from "./ViewOrders"

export default async function Page() {
    noStore()
    const user = await getUser()
    const orders = await getAffiliateOrdersWithCommission(user!.id)

  return (
    <>
    <ViewOrders orders={orders} />

    </>
  )
}
