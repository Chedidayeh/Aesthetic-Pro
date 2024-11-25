'use server'

import {  getPlatformForTheWebsite, getUser } from "@/actions/actions"
import SettingsView from "./SettingsView"
import { unstable_noStore as noStore } from "next/cache"
import { getAllCollections } from "./actions"

export default async function Page() {
    noStore()
    const platform = await getPlatformForTheWebsite()
    const collections = await getAllCollections()

    return (

        <SettingsView platform={platform!} collections={collections} />

    )
}
