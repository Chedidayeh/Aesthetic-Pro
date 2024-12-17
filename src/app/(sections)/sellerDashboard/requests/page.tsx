
import ViewRequests from "./ViewRequests"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { unstable_noStore as noStore } from "next/cache"
import { getPaymentRequestsForStore } from "./actions"

export default async function Page() {
    noStore()
    const user = await getUser()
    const store = await getStoreByUserId(user!.id)
    const paymentRequests = await getPaymentRequestsForStore(store.id)

  return (
    <>
    <ViewRequests paymentRequests={paymentRequests} />

    </>
  )
}
