
import ViewNotification from "./ViewNotification"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { getNotificationsForStore } from "./actions"
import { unstable_noStore as noStore } from "next/cache"

export default async function Page() {
    noStore()
    const user = await getUser()
    const store = await getStoreByUserId(user!.id)
    const notifications = await getNotificationsForStore(store.id)

  return (
    <>
    <ViewNotification notifications={notifications} />

    </>
  )
}
