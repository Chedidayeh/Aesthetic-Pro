'use server'

import { getPlatform, getUser } from "@/actions/actions"
import SettingsView from "./SettingsView"
import { unstable_noStore as noStore } from "next/cache"

export default async function Page() {
    noStore()

    const user = await getUser()
    const platform = await getPlatform(user!.id)


    return (

        <SettingsView platform={platform!} />

    )
}
