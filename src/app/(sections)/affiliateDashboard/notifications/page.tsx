
import ViewNotification from "./ViewNotification"
import { getUser } from "@/actions/actions"
import { getAffiliateNotification } from "./actions"
import { unstable_noStore as noStore } from "next/cache"
import { getAffiliateIdByUserId } from "../products/actions"

export default async function Page() {
    noStore()
    const user = await getUser()
    const affiliateId = await getAffiliateIdByUserId(user!.id)
    const notifications = await getAffiliateNotification(affiliateId)

  return (
    <>
    <ViewNotification notifications={notifications} />

    </>
  )
}
