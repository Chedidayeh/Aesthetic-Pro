/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 

 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import {  ChangeEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {   OctagonAlert, PenTool, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
 

import {   DeleteOrder } from './actions';
import { useRouter } from 'next/navigation';
import { Order } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductsViewProps {
  ordersData: Order[];
  groupedOrders: GroupedOrder[]
  }

  interface OrderItem {
    id: string;
    productCategory: string;
    productTitle: string;
    productColor: string;
    quantity: number;
    productSize: string;
    productPrice: number;
    capturedMockup : string[]
  }
  
  interface GroupedOrder {
    id: string;
    status : string;
    type : string;
    isSellerOrder : boolean;
    isPaid : boolean
    items: OrderItem[];
  }


const ProductsView = ({
  ordersData,
  groupedOrders,
  }: ProductsViewProps) => {

    

        

        const router = useRouter();
        const { toast } = useToast()

        const [isClicked, setIsClicked] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

           // Function to change the state after a delay
           const changeStateAfterDelay = () => {
            setTimeout(() => {
              setIsLoading(false);
            }, 5000); // Change to 1000 milliseconds for 1 second
          };


          const [searchQuery, setSearchQuery] = useState('');
          const [filterCriteria, setFilterCriteria] = useState('');
          const [filteredOrders, setFilteredOrders] = useState(groupedOrders);
        
          useEffect(() => {
            let updatedOrders = [...groupedOrders];
        
            if (searchQuery) {
              const lowercasedQuery = searchQuery.toLowerCase();
              updatedOrders = updatedOrders.filter(order =>
                order.id.toLowerCase().includes(lowercasedQuery)
              );
            }
        
            if (filterCriteria) {
              updatedOrders = updatedOrders.filter(order => {
                if (filterCriteria === 'CONFIRMED') {
                  return order.type === 'CONFIRMED';
                } else if (filterCriteria === 'NOT_CONFIRMED') {
                  return order.type === 'NOT_CONFIRMED';
                } else if (filterCriteria === 'CANCELED') {
                  return order.type === 'CANCELED';
                } else if (filterCriteria === 'DELIVERED') {
                  return order.status === 'DELIVERED';
                } else if (filterCriteria === 'Paid') {
                  return order.isPaid === true;
                } else if (filterCriteria === 'NOT_Paid') {
                  return order.isPaid === false;
                }
                return true;
              });
            }
        
            setFilteredOrders(updatedOrders);
          }, [searchQuery, filterCriteria, groupedOrders]);
        
          const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
          };
        
          const handleFilterChange = (value: string) => {
            setFilterCriteria(value);
          };









                              // get order item code
                              const [isViewOpen, setisViewOpen] = useState(false);
                              const [capturedItem , setcapturedItem] = useState <string[]> ([])


                              async function viewOrder (capturedMockup : string[]){
                                    setIsLoading(true)
                                    changeStateAfterDelay()  
                                    setisViewOpen(true)
                                    setcapturedItem(capturedMockup)
                                  }



                                    //delete order code
                                    const [isDeleteOpen, setisDeleteOpen] = useState(false);
                                    const [selectedOrderId, setselectedOrderId] = useState<string>();
                      
                                    const handleDelete = async () => {
                                      try {
                                          setisDeleteOpen(false)
                                          await DeleteOrder(selectedOrderId!)
                                          toast({
                                              title: 'Order Was Successfully Deleted',
                                              variant: 'default',
                                            });
                                            router.refresh()
                                      } catch (error) {
                                          console.error('Error deleting order:', error);
                                          toast({
                                              title: 'Something went wrong',
                                              description: 'There was an error on our end. Please try again.',
                                              variant: 'destructive',
                                          });
                                      }
                                  };
                            







  return (

    <>





<div className="flex mt-4 flex-col gap-5 w-full">
  
  <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">

      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
    <CardHeader className="px-4 gap-4 sm:px-7">
    <div className="space-y-4">
      <CardTitle>Products Details</CardTitle>
      <CardDescription>Total Orders: {ordersData.length}</CardDescription>
    </div>
    <div className="ml-0 sm:ml-5 mt-2">

      
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
  <Input
    type="search"
    className="w-full sm:flex-1 md:w-[80%]"
    placeholder="Enter the order Id to make a search..."
    value={searchQuery}
    onChange={handleSearchChange}
  />
  <Select onValueChange={handleFilterChange}>
    <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
        <SelectItem value="NOT_CONFIRMED">Not Confirmed</SelectItem>
        <SelectItem value="CANCELED">Canceled</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  <Select onValueChange={handleFilterChange}>
    <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="NOT_Paid">Not Paid</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  <Link href="/sellerDashboard/createOrder">
    <Button
      className="w-full sm:w-auto text-white"
      type="submit"
      loadingText="Redirecting"
      isLoading={isClicked}
      disabled={isClicked}
      onClick={() => setIsClicked(true)}
      variant="default"
    >
      Create Order
      <PenTool className="h-4 w-4 ml-2" />
    </Button>
  </Link>
</div>



      <div className="mt-6">
        <p className="text-gray-600 text-sm">
          <span className="text-blue-600 font-medium">Note: </span>
          The orders Ids with the <span className="text-blue-600">blue</span> color are your own orders!
        </p>
        <p className="text-gray-600 text-sm">
          <span className="text-blue-600 font-medium">Note: </span>
          You can't delete any <span className="text-red-600">client orders!</span>
        </p>
        <p className="text-gray-600 text-sm">
          <span className="text-blue-600 font-medium">Note: </span>
          Any changes you make on your products or designs <span className="text-red-600">won't affect the current orders!</span>
        </p>
      </div>

    </div>
  </CardHeader>
  <CardContent>

    
  <Table className="mt-8">
  <ScrollArea  className="h-96 w-full">
  <TableHeader>
    <TableRow>
      <TableHead>Order Id</TableHead>
      <TableHead>Order Status</TableHead>
      <TableHead>Order Type</TableHead>
      <TableHead>Order Payment</TableHead>
      <TableHead>Product Category</TableHead>
      <TableHead>Product Title</TableHead>
      <TableHead>Product Quantity</TableHead>
      <TableHead>Product Price</TableHead>
      <TableHead className=" text-center">
        Amount
        <p className="text-xs">Product Price x Quantity</p>
      </TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredOrders.map((order) => (
      <React.Fragment key={order.id}>
        <TableRow></TableRow>
        {order.items.map((item, index) => (
          <TableRow key={item.id}>
            {index === 0 && (
              <>
                <TableCell className=" text-left" rowSpan={order.items.length}>
                  {order.isSellerOrder ? (
                    <span className="text-blue-500">{order.id}</span>
                  ) : (
                    order.id
                  )}
                </TableCell>
                <TableCell className="text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`text-white ${
                      {
                        PROCESSING: 'bg-blue-700',
                        DELIVERED: 'bg-green-700',
                        REFUSED: 'bg-red-700',
                        CANCELED: 'bg-red-700',
                      }[order.status]
                    } hover:bg-gray-700`}
                  >
                    {order.status}
                  </Badge>
                </TableCell >
                <TableCell className="text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`text-white ${
                      order.type === 'CONFIRMED'
                        ? 'bg-green-700'
                        : order.type === 'NOT_CONFIRMED'
                        ? 'bg-orange-400'
                        : order.type === 'CANCELED'
                        ? 'bg-red-700'
                        : 'bg-gray-700'
                    } hover:bg-gray-700`}
                  >
                    {order.type}
                  </Badge>
                </TableCell>
                <TableCell className=" text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`text-white ${order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}
                  >
                    {order.isPaid ? 'Is Paid' : 'Not Paid'}
                  </Badge>
                </TableCell>
              </>
            )}
            <TableCell className=" text-left">{item.productCategory}</TableCell>
            <TableCell className="text-left">{item.productTitle}</TableCell>
            <TableCell className=" text-center">{item.quantity}</TableCell>
            <TableCell className=" text-left">{item.productPrice.toFixed(2)} TND</TableCell>
            <TableCell className=" text-center">
              {(item.productPrice * item.quantity).toFixed(2)} TND
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <TooltipProvider>
                {order.isSellerOrder && order.status !== 'CANCELED' ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          onClick={() => {
                            setisDeleteOpen(true);
                            setselectedOrderId(order.id);
                          }}
                          className="cursor-pointer hover:text-red-500 ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <div>No action</div>
                )}
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    ))}
  </TableBody>
  </ScrollArea>

</Table>


  </CardContent>
</Card>

</section>
</div>


                      {/* The AlertDialog delete order component  */}
                      <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete your Client Order ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove your order from our MarketPlace.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>                            
 

                            

                            </>
  
  );
};

export  default ProductsView ;

