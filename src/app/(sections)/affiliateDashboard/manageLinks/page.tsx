
import { getPlatformForTheWebsite, getUser } from "@/actions/actions"
import { unstable_noStore as noStore } from "next/cache"
import ManageLinks from "./ManageLinks"
import { getAffiliateLinksForUser } from "./actions"

export default async function Page() {
    noStore()
    const user = await getUser()
    const Links = await getAffiliateLinksForUser(user!.id)
    const platform = await getPlatformForTheWebsite()

  return (
    <>
    <ManageLinks Links={Links} platform={platform!} />

    </>
  )
}
