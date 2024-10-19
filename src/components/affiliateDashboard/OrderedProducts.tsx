import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  getOrderedProductsByStoreId, getStoreByUserId, getUser } from "@/actions/actions";
import React from "react";



const OrderedProducts = async () => {
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const store = await getStoreByUserId(user.id);
  const storeOrdersForProducts = await getOrderedProductsByStoreId(store!.id);

  return (
    <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Ordered Products</CardTitle>
          <CardDescription>Total: {storeOrdersForProducts.length}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Id</TableHead>
              <TableHead>Product Title</TableHead>
              <TableHead>Product Category</TableHead>
              <TableHead className="text-center">Product Price</TableHead>
              <TableHead className="text-center">Seller Profit</TableHead>
              <TableHead className="text-center">Order Count</TableHead>
              <TableHead className="text-center">Total Product Quantity</TableHead>
              <TableHead className="text-center">Total Sales</TableHead>

              <TableHead className="text-center">
                Revenue
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrdersForProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-center">{(product.price).toFixed(2)} TND</TableCell>
                <TableCell className="text-center">{(product.sellerProfit).toFixed(2)} TND</TableCell>
                <TableCell className="text-center">{product.orderCount}</TableCell>
                <TableCell className="text-center">{product.totalOrderedQuantity}</TableCell>
                <TableCell className="text-center">{product.totalSales}</TableCell>
                <TableCell className="text-center">
                  {(product.revenue).toFixed(2)} TND
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderedProducts;
