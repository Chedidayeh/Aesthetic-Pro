/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"
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
import {  CircleDollarSign, CreditCard, EllipsisVertical, Eye, Heart, Loader, OctagonAlert, PenTool, SquareArrowDown, SquarePen, Tags, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "@radix-ui/react-icons"
 
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { db } from '@/db';
import {   DeleteOrder } from './actions';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Order, OrderItem } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';


interface OrderWithItems  {
    order: Order;
    quantity: number
    frontDesignName: string | null;
    backDesignName: string | null;
    frontDesignProfit: number;
    backDesignProfit: number;
}



interface DesignViewProps {
  orderedDesigns: OrderWithItems[];
}


const DesignView: React.FC<DesignViewProps> = ({ orderedDesigns }) => {

  


          const [searchQuery, setSearchQuery] = useState('');
          const [filterCriteria, setFilterCriteria] = useState('');
          const [filteredOrders, setFilteredOrders] = useState(orderedDesigns);
        
          useEffect(() => {
            let updatedOrders = [...orderedDesigns];
        
            if (searchQuery) {
              const lowercasedQuery = searchQuery.toLowerCase();
              updatedOrders = updatedOrders.filter(order =>
                order.order.id.toLowerCase().includes(lowercasedQuery)
              );
            }
        
            if (filterCriteria) {
              updatedOrders = updatedOrders.filter(order => {
                if (filterCriteria === 'CONFIRMED') {
                  return order.order.type === 'CONFIRMED';
                } else if (filterCriteria === 'NOT_CONFIRMED') {
                  return order.order.type === 'NOT_CONFIRMED';
                } else if (filterCriteria === 'CANCELED') {
                  return order.order.type === 'CANCELED';
                } else if (filterCriteria === 'DELIVERED') {
                  return order.order.status === 'DELIVERED';
                } else if (filterCriteria === 'Paid') {
                  return order.order.isPaid === true;
                } else if (filterCriteria === 'NOT_Paid') {
                  return order.order.isPaid === false;
                }
                return true;
              });
            }
        
            setFilteredOrders(updatedOrders);
          }, [searchQuery, filterCriteria, orderedDesigns]);
        
          const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
          };
        
          const handleFilterChange = (value: string) => {
            setFilterCriteria(value);
          };




  return (

    <>





                                       

<div>

<Card className="xl:col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-4 gap-4 sm:px-7">
    <CardTitle>Designs Details</CardTitle>
    <CardDescription>Total Orders: {orderedDesigns.length}</CardDescription>
    <div className="ml-5 mt-2">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
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
              <SelectLabel>Select Order Status</SelectLabel>
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
              <SelectLabel>Select Payment Status</SelectLabel>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="NOT_Paid">Not Paid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  </CardHeader>
  <CardContent>
  <ScrollArea  className="h-[384px] w-full border rounded-lg">
    <Table className='mt-8'>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell">Order Id</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead className="hidden sm:table-cell">Order Type</TableHead>
          <TableHead className="hidden sm:table-cell">Order Payment</TableHead>
          <TableHead>Front Design Name</TableHead>
          <TableHead>Back Design Name</TableHead>
          <TableHead className="hidden sm:table-cell">Product Quantity</TableHead>
          <TableHead className="hidden sm:table-cell">Front Design Profit</TableHead>
          <TableHead className="hidden sm:table-cell">Back Design Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((orderItem) => (
          <TableRow key={orderItem.order.id}>
            <TableCell className="hidden sm:table-cell">{orderItem.order.id}</TableCell>
            <TableCell>
              <Badge className={`${{
                'PROCESSING': 'bg-blue-700',
                'DELIVERED': 'bg-green-700',
                'REFUSED': 'bg-red-700',
                'CANCELED': 'bg-red-700',
              }[orderItem.order.status]} hover:bg-gray-700`}>
                {orderItem.order.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className={`${orderItem.order.type === 'CONFIRMED' ? 'bg-green-700' : orderItem.order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : orderItem.order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                {orderItem.order.type}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className={`${orderItem.order.isPaid ? 'bg-green-700' : 'bg-red-700'} hover:bg-gray-700`}>
                {orderItem.order.isPaid ? "Is Paid" : "Not Paid"}
              </Badge>
            </TableCell>
            <TableCell>{orderItem.frontDesignName || 'N/A'}</TableCell>
            <TableCell>{orderItem.backDesignName || 'N/A'}</TableCell>
            <TableCell className="hidden sm:table-cell">{orderItem.quantity}</TableCell>
            <TableCell className="hidden sm:table-cell">{orderItem.frontDesignProfit.toFixed(2)} TND</TableCell>
            <TableCell className="hidden sm:table-cell">{orderItem.backDesignProfit.toFixed(2)} TND</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </ScrollArea>
  </CardContent>
</Card>



</div>

                            </>
  
  );
};

export  default DesignView ;

