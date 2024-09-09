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
import { v4 as uuidv4 } from 'uuid';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 

 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast, useToast } from '@/components/ui/use-toast'
import {  ChangeEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {   Eye, Loader2, OctagonAlert, PenTool, SquareArrowDown, Trash2 } from 'lucide-react';
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
import ImageSlider from "@/components/PodProducts/ImageSlider";

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

                                       

<div>

<Card className="xl:col-span-full" x-chunk="dashboard-01-chunk-4">
<CardHeader className="px-4 gap-4 sm:px-7">
    <div>
      <CardTitle>Products Details</CardTitle>
      <CardDescription>Total Orders: {ordersData.length}</CardDescription>
    </div>
    <div className="ml-0 sm:ml-5 mt-2">
    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <Input
            type="search"
            className="w-full md:w-[80%] "
            placeholder="Enter the order Id to make a search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full md:w-[180px] ">
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
            <SelectTrigger className="w-full md:w-[180px] ">
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
              className="w-full md:w-auto"
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
      <div className="mt-2">
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
  <TableHeader>
    <TableRow>
      <TableHead className="hidden sm:table-cell">Order Id</TableHead>
      <TableHead>Order Status</TableHead>
      <TableHead className="hidden sm:table-cell">Order Type</TableHead>
      <TableHead className="hidden sm:table-cell">Order Payment</TableHead>
      <TableHead className="hidden md:table-cell">Product Category</TableHead>
      <TableHead>Product Title</TableHead>
      <TableHead className="hidden md:table-cell">Product Quantity</TableHead>
      <TableHead className="hidden md:table-cell">Product Price</TableHead>
      <TableHead className="hidden md:table-cell text-center">
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
                <TableCell className="hidden sm:table-cell text-left" rowSpan={order.items.length}>
                  {order.isSellerOrder ? (
                    <span className="text-blue-500">{order.id}</span>
                  ) : (
                    order.id
                  )}
                </TableCell>
                <TableCell className="text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`${
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
                <TableCell className=" hidden sm:table-cell text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`${
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
                <TableCell className="hidden sm:table-cell text-left" rowSpan={order.items.length}>
                  <Badge
                    className={`${order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}
                  >
                    {order.isPaid ? 'Is Paid' : 'Not Paid'}
                  </Badge>
                </TableCell>
              </>
            )}
            <TableCell className="hidden md:table-cell text-left">{item.productCategory}</TableCell>
            <TableCell className="text-left">{item.productTitle}</TableCell>
            <TableCell className="hidden md:table-cell text-center">{item.quantity}</TableCell>
            <TableCell className="hidden md:table-cell text-left">{item.productPrice.toFixed(2)} TND</TableCell>
            <TableCell className="hidden md:table-cell text-center">
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
</Table>

  </CardContent>
</Card>



</div>

                             
 

                            

                            </>
  
  );
};

export  default ProductsView ;

