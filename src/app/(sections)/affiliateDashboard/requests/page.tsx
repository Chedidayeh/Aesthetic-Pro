
import ViewRequests from "./ViewRequests"
import { getAffiliatePaymentRequest, getUser } from "@/actions/actions"
import { unstable_noStore as noStore } from "next/cache"

export default async function Page() {
    noStore()
    const user = await getUser()
    const affiliate = await getAffiliatePaymentRequest(user!.id)

  return (
    <>
    <ViewRequests paymentRequests={affiliate!.affiliatePaymentRequest} />

    </>
  )
}
