'use server'

import {  getPlatformForTheWebsite, getUser } from "@/actions/actions"
import SettingsView from "./SettingsView"
import { unstable_noStore as noStore } from "next/cache"

export default async function Page() {
    noStore()
    const platform = await getPlatformForTheWebsite()


    return (

        <SettingsView platform={platform!} />

    )
}
