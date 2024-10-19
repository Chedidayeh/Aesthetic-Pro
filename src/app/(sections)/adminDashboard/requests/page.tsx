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
import ViewRequests from "./ViewRequests"
import { getStoreByUserId, getUser } from "@/actions/actions"
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
