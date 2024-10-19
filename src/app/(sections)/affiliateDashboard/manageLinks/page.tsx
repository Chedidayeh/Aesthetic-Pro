import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPlatformForTheWebsite, getStoreByUserId, getUser } from "@/actions/actions"
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
