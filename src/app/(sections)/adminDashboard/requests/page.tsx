
import ViewRequests from "./ViewRequests"
import { unstable_noStore as noStore } from "next/cache"
import { getAffiliatePaymentRequests, getPaymentRequests } from "./actions"
import ViewAffiliateRequests from "./ViewAffiliateRequests"

export default async function Page() {
    noStore()
    const paymentRequests = await getPaymentRequests()

    const affiliatePaymentRequests = await getAffiliatePaymentRequests()

  return (
    <>
    <ViewRequests paymentRequests={paymentRequests} />
    <ViewAffiliateRequests affiliatePaymentRequests={affiliatePaymentRequests} />

    </>
  )
}
