'use server'

import {  getPlatformForTheWebsite } from "@/actions/actions"
import SettingsView from "./SettingsView"
import { unstable_noStore as noStore } from "next/cache"
import { getAllCollections, getAllLevels } from "./actions"

export default async function Page() {
    noStore()
    const platform = await getPlatformForTheWebsite()
    const collections = await getAllCollections()
    const levels = await getAllLevels()

    return (

        <SettingsView platform={platform!} collections={collections} levels={levels} />

    )
}
