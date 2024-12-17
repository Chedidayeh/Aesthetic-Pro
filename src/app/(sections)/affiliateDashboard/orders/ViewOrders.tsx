'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {  Commission, Order } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ExtraOrder extends Order {
  commission : Commission | null
}


interface OrderWithCommission {
  order : ExtraOrder | null
  commissionProfit : number
}


interface ViewProps {
  orders: OrderWithCommission[];
}

const ViewOrders = ({ orders }: ViewProps) => {

  const { toast } = useToast()

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [searchTerm, setSearchTerm] = useState(""); // For searching by commission ID

    useEffect(() => {
      let updatedOrders = [...orders];
  
      // Filter orders based on filter criteria
      if (filterCriteria) {
        updatedOrders = updatedOrders.filter((orderWithCommission) => {
          const { order } = orderWithCommission;
          if (!order) return false;
  
          switch (filterCriteria) {
            case "CONFIRMED":
              return order.type === "CONFIRMED";
            case "NOT_CONFIRMED":
              return order.type === "NOT_CONFIRMED";
            case "CANCELED":
              return order.type === "CANCELED";
            case "DELIVERED":
              return order.status === "DELIVERED";
            case "Paid":
              return order.isPaid === true;
            case "NOT_Paid":
              return order.isPaid === false;
            case "Sellerorder":
              return order.isSellerOrder === true;
            case "Clientorder":
              return order.isClientMadeOrder === true;
            case "Printed":
              return order.printed === true;
            case "NOT_Printed":
              return order.printed === false;
            default:
              return true;
          }
        });
      }
  
      // Filter orders based on search term (Commission ID)
      if (searchTerm) {
        updatedOrders = updatedOrders.filter(
          (orderWithCommission) =>
            orderWithCommission.order?.commission?.id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) // Match Commission ID
        );
      }
  
      setFilteredOrders(updatedOrders);
    }, [filterCriteria, searchTerm, orders]);
    
    // Handle search term input
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value); // Update the search term state
    };
  
    const handleFilterChange = (value: string) => {
      setFilterCriteria(value);
    };

  return (
    <>

<p className="text-sm text-gray-700 mb-2">AffiliateDashboard/Orders</p>
           <h1 className="text-2xl font-semibold">All Orders</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-1 xl:grid-cols-1">
  
  
  
      <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Total: {orders.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">

        <Input
              type="search"
              className='w-full'
              placeholder="Search by Commission Id..."
              value={searchTerm}
              onChange={handleSearchChange}
            /> 

  <Select onValueChange={handleFilterChange}>
    <SelectTrigger className="w-full sm:w-[180px] ">
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
    <SelectTrigger className="w-full sm:w-[180px] ">
      <SelectValue placeholder="Filter By" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select</SelectLabel>
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="NOT_Paid">Not Paid</SelectItem>
        <SelectItem value="Printed">Printed</SelectItem>
        <SelectItem value="NOT_Printed">Not Printed</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>


        <ScrollArea className="mt-4 w-full h-96">
        <Table>
  <TableHeader>
    <TableRow>
      {/* Order Status column */}
      <TableHead className="">Order Status</TableHead>

      {/* Order Type column */}
      <TableHead className="">Order Type</TableHead>

      <TableHead className="hidden lg:table-cell">Creation Date</TableHead>

      {/* Is Order Printed column */}
      <TableHead className="hidden md:table-cell">Is Order Printed</TableHead>

      {/* Is Order Paid column */}
      <TableHead className="hidden lg:table-cell">Is Order Paid</TableHead>

      <TableHead className="">Commission Id</TableHead>

      <TableHead className="">Your Profit</TableHead>


    </TableRow>
  </TableHeader>
  <TableBody>
  {filteredOrders.map((orderWithCommission, index) => {
    const { order, commissionProfit } = orderWithCommission;
    if (!order) return null; // Skip rendering if order is null

    return (
      <TableRow key={order.id}>
        <TableCell className="">
          <Badge className={{
            'PROCESSING': 'bg-blue-700',
            'DELIVERED': 'bg-green-700',
            'REFUSED': 'bg-red-700',
            'CANCELED': 'bg-red-700'
          }[order.status] || 'bg-gray-700'}>
            {order.status}
          </Badge>
        </TableCell>

        <TableCell className="">
          <Badge className={order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'}>
            {order.type}
          </Badge>
        </TableCell>

        <TableCell className="hidden lg:table-cell">{new Date(order.createdAt).toLocaleString()}</TableCell>

        <TableCell className="hidden md:table-cell">
          <Badge className={order.printed ? 'bg-green-700' : 'bg-red-700'}>
            {order.printed ? "Printed" : "Not Printed"}
          </Badge>
        </TableCell>

        <TableCell className="hidden lg:table-cell">
          <Badge className={order.isPaid ? 'bg-green-700' : 'bg-red-700'}>
            {order.isPaid ? "Is Paid" : "Not Paid"}
          </Badge>
        </TableCell>

        <TableCell className="">
          {order.commission!.id}
        </TableCell>

        <TableCell className="">
          {commissionProfit.toFixed(2)} TND
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>

</Table>

          </ScrollArea>
        </CardContent>
      </Card>  

        


      </section>
  

  
    </div>

    </>
  );
};

export default ViewOrders;
