'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PaymentRequest, Store, User } from "@prisma/client";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { OctagonAlert, Trash2 } from 'lucide-react';
import { approveStoreRequest, deletePaymentRequestById } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";

interface ExtraStore extends Store {
    user : User
  }
  
  interface ExtraPaymentRequest extends PaymentRequest {
    store : ExtraStore
  }
  
  
  interface ViewProps {
    paymentRequests: ExtraPaymentRequest[];
  }

const D17 = ({ paymentRequests }: ViewProps) => {
    
    const { toast } = useToast()
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [selectedRequestId, setselectedRequestId] = useState<string>();



// handleDelete function 
const handleDelete = async () => {
    try {
        setOpen(true)
        await deletePaymentRequestById(selectedRequestId!)
        toast({
            title: 'Request has been deleted !',
            variant: 'default',
          });
        setOpen(false)
        setisDeleteOpen(false)
        router.push("")
        return
    }
    catch (error) {
        console.error(error);
        setisDeleteOpen(false)
        setOpen(false)
        toast({
            title: 'Error !',
            description: "Please try again later !",
            variant: 'destructive',
            });
        return
        }
        }





        const [selectedRequest, setselectedRequest] = useState<ExtraPaymentRequest | null>(null);
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
        const handleRowClick = (request: ExtraPaymentRequest, index: number) => {
          if (selectedIndex === index) {
            setselectedRequest(null);
            setSelectedIndex(null);
          } else {
            setselectedRequest(request);
            setSelectedIndex(index);
          }
        };


        // handleChange function
        const approveRequest = async () => {
            try {
              setOpen(true)
                await approveStoreRequest(selectedRequest!)
                toast({
                  title: 'Request has been approved !',
                  variant: 'default',
                  });
                  router.refresh()
                  setselectedRequest(null)
                  setOpen(false)
            } catch (error) {
              console.error(error);
              setOpen(false)
              toast({
                title: 'Error !',
                description: "Please try again later !",
                variant: 'destructive',
                });
                
            }
        }

    return (
        <div>
                                <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this request ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

                     <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Card Holder</TableHead>
            <TableHead className="hidden md:table-cell" >Card Phone Number</TableHead>
            <TableHead className="hidden md:table-cell">Requested Amount</TableHead>
            <TableHead >Seller Store</TableHead>
            <TableHead className="hidden md:table-cell">Seller Email</TableHead>
            <TableHead >Seller Phone Number</TableHead>
            <TableHead className="hidden md:table-cell">Payment Status</TableHead>
            <TableHead className="hidden md:table-cell">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentRequests.map((request , index) => (
            <TableRow 
            key={request.id} 
            className={` cursor-pointer ${selectedIndex === index ? 'border-2 border-blue-500' : ''}`}
            onClick={() => handleRowClick(request, index)}
        
            >
              <TableCell className="hidden md:table-cell"> {request.cardHolder || 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell">{request.cardPhoneNumber || 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell">{request.requestedAmount.toFixed(2)} TND</TableCell>
              <TableCell>{request.store.storeName}</TableCell>
              <TableCell className="hidden md:table-cell">{request.store.user.email}</TableCell>
              <TableCell>{request.store.userPhoneNumber}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  className={`${
                    {
                      PENDING: 'bg-blue-700',
                      APPROVED: 'bg-green-700',
                      REJECTED: 'bg-red-700',
                    }[request.status]
                  } hover:bg-gray-700`}
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <TooltipProvider>
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          onClick={() => {
                            setisDeleteOpen(true);
                            setselectedRequestId(request.id);
                          }}
                          className="cursor-pointer hover:text-red-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p>Cancel</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
                     </div>


      {selectedRequest && (
      <Card className="col-span-full my-4" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-col md:flex-row items-center">
                 <div className="grid gap-2">
             <CardTitle className="font-extrabold">Request Infos :</CardTitle>
             <CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
                          <div>
                             <p className="font-bold">Request Id:</p>
                             <p>{selectedRequest.id}</p>
                         </div>
                         <div>
                            <p className="font-bold">Request Status:</p>
                            <p>
                                <Badge 
                                className={`${
                                    {
                                    "PENDING": 'bg-blue-700',
                                    'APPROVED': 'bg-green-700',
                                    'REJECTED': 'bg-red-700',  // Ensure this matches your status key
                                    }[selectedRequest.status]
                                } hover:bg-gray-700`}
                                >
                                {selectedRequest.status}
                                </Badge>
                            </p>
                            </div>

                         <div>
                             <p className="font-bold">Requested Amount:</p>
                             <p>{selectedRequest.requestedAmount.toFixed(2)} TND</p>
                         </div>
                         <div>
                             <p className="font-bold">Seller Email:</p>
                             <p>{selectedRequest.store.user.email}</p>
                         </div>
                         <div>
                             <p className="font-bold">Seller Phone Number:</p>
                             <p>{selectedRequest.store.userPhoneNumber}</p>
                         </div>
                         <div>
                             <p className="font-bold">Store Revenue:</p>
                             <p>{selectedRequest.store.revenue.toFixed(2)} TND</p>
                         </div>
                         <div>
                             <p className="font-bold">Store Received Payments:</p>
                             <p>{selectedRequest.store.receivedPayments.toFixed(2)} TND</p>
                         </div>
                         <div>
                             <p className="font-bold">Store UnReceived Payments:</p>
                             <p>{(selectedRequest.store.revenue - selectedRequest.store.receivedPayments).toFixed(2)} TND</p>
                         </div>
                         {selectedRequest.status != "APPROVED" && (
                         <div className="col-span-2 md:col-span-1">
                         <Button onClick={approveRequest} variant="link" className="block mb-2 md:mb-0">Approve Request</Button>
                         </div>
                           )}
                     </div>
                 </CardDescription>
 
           </div>
         </CardHeader>
       </Card>
      )}

            <LoadingState isOpen={open} />

        </div>
    );
}

export default D17;
