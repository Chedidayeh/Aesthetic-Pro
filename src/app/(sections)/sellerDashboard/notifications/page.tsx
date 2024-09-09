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
