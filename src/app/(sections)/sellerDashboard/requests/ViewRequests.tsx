'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  PaymentRequest } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import { deletePaymentRequestById } from "./actions";
import D17 from "./D17";
import { Input } from "@/components/ui/input";
import Flouci from "./Flouci";
import BankDeposit from "./BankDeposit";
interface ViewProps {
  paymentRequests: PaymentRequest[];
}

const ViewRequests = ({ paymentRequests }: ViewProps) => {

  

  const [filterBy, setFilterBy] = useState<string>('');
  const [filteredRequests, setfilteredRequests] = useState(paymentRequests);
  const d17Requests = filteredRequests.filter((request) => request.method === "D17")
  const flouciRequests = filteredRequests.filter((request) => request.method === "Flouci")
  const bankDepositRequest = filteredRequests.filter((request) => request.method === "BankDeposit")

  useEffect(() => {
    let updatedPaymentRequests = [...paymentRequests];


    if (filterBy) {
      updatedPaymentRequests = updatedPaymentRequests.filter(request => {
        if (filterBy === 'APPROVED') {
          return request.status === "APPROVED";
        } else if (filterBy === 'PENDING') {
          return request.status === "PENDING";
        } else if (filterBy === 'REJECTED') {
          return request.status === "REJECTED";
        }
        return true;
      });
    }

    setfilteredRequests(updatedPaymentRequests);
  }, [ filterBy, paymentRequests]);


  const [activeTab, setActiveTab] = useState('D17');
  const handleTabChange = (value : string) => {
    setActiveTab(value);
  };


  return (
    <>

      <p className="text-sm text-gray-700 mb-2">SellerDashboard/RequestedPayments</p>
      <h1 className="text-2xl font-semibold mb-8">All Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>Total : {paymentRequests.length}</CardDescription>

          {paymentRequests.length === 0 ? (
          <CardDescription>
            <span className="text-blue-500">No requests made for now !</span>
          </CardDescription>
             ) : (
<CardDescription>
  <div><span className="text-blue-500">Pending:</span> Your request is under review!</div>
  <div><span className="text-blue-500">Refresh Page</span> to view new added requests!</div>
</CardDescription>


             )}
        </CardHeader>
        <CardContent>
        <div className="flex justify-center items-center">
  <Tabs defaultValue="D17" className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
  <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="D17">D17</TabsTrigger>
  <TabsTrigger value="Flouci">Flouci</TabsTrigger>
  <TabsTrigger value="Bank">Bank Deposit</TabsTrigger>
    </TabsList>
  </Tabs>
  </div>

  <div className="flex flex-col sm:flex-row justify-center items-center my-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <Select onValueChange={(value) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

    {activeTab === 'D17' && (
      <div className="mt-4">
        <D17 paymentRequests={d17Requests} />
      </div>
    )}

    {activeTab === 'Flouci' && (
      <div className="mt-4">
        <Flouci paymentRequests={flouciRequests} />
      </div>
    )}

    {activeTab === 'Bank' && (
      <div className="mt-4">
        <BankDeposit paymentRequests={bankDepositRequest} />
      </div>
    )}


        </CardContent>
      </Card>

    </>
  );
};

export default ViewRequests;
