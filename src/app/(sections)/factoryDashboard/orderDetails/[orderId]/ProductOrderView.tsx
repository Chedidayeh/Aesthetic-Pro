/* eslint-disable @next/next/no-img-element */
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
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
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
      Activity,
      ArrowUpRight,
      CircleCheck,
      CircleUser,
      CloudDownload,
      CreditCard,
      DatabaseBackup,
      DollarSign,
      Eye,
      FileType,
      Heart,
      Loader2,
      Menu,
      OctagonAlert,
      Package2,
      Palette,
      Search,
      Shirt,
      Trash2,
      Users,
    } from "lucide-react"
    
    import {
      Avatar,
      AvatarFallback,
      AvatarImage,
    } from "@/components/ui/avatar"
    import { Badge } from "@/components/ui/badge"
    import { Button } from "@/components/ui/button"
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card"
    
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table"
    
    import Link from "next/link";
    
    import { cn } from "@/lib/utils";
    import React, { ChangeEvent, useEffect, useState } from "react"
    import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
    import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
    import { db } from "@/db"
    import UsersTable from "@/components/adminDashboard/UsersTable"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { ClientDesign, Order, OrderItem, OrderStatus, OrderType, Product, SellerDesign, Store, User } from "@prisma/client"
  import { tree } from "next/dist/build/templates/app-page"
  import { useRouter } from "next/navigation"
  import { useToast } from "@/components/ui/use-toast"
  import { Input } from "@/components/ui/input"
  import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Item } from "@radix-ui/react-dropdown-menu"
import { togglePrinted } from "./actions"
import LoadingState from "@/components/LoadingState"
import ImageSlider from "@/components/PodProducts/ImageSlider"

interface ExtraOrderItem extends OrderItem {
    product: Product | null 
    frontsellerDesign : SellerDesign | null
    backsellerDesign : SellerDesign | null
    frontclientDesign : ClientDesign | null
    backclientDesign: ClientDesign | null
}

interface ExtraOrder extends Order {
    orderItems : ExtraOrderItem[]
    user : User
}


  
  
interface OrderViewProps {
    order: ExtraOrder | null
}
  
  const ProductOrderView = ({ order }: OrderViewProps ) => { 

    const router = useRouter();
    const { toast } = useToast()

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<ExtraOrderItem | null>(null);


    const handleItemClick = (index: number) => {
        if (index === selectedItemIndex) {
          setSelectedItemIndex(null);
          setSelectedItem(null);
        } else {
          setSelectedItemIndex(index);
          setSelectedItem(order?.orderItems[index] || null);
        }
      };



      const [open, setOpen] = useState<boolean>(false);


      const handleChange = async () =>{
        try {
            setOpen(true)
            await togglePrinted(order!.id)
            toast({
                title: 'State Was Successfully Changed',
                variant: 'default',
              });
            setOpen(false)
            router.refresh()
            
        } catch (error) {
          setOpen(false)
            toast({
                title: 'Status Was Not Changed',
                variant: 'destructive',
              });
            console.log(error)
            
        }
      }




       // Function to handle download
 const downloadDesign = async (imageUrl: string) => {
  if(imageUrl === '') {
    toast({
      title: "No design found !",
      variant: "destructive",
    });
    return;
  }
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design_image.png"; // You can set the filename here
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error downloading design:", error);
    toast({
      title: "Download failed",
      variant: "destructive",
    });
  }
};

// Function to handle download
const downloadMockup = async (imageUrls: string[]) => {
  try {

    // Loop through each imageUrl and download
    for (let i = 0; i < imageUrls.length; i++) {
      const response = await fetch(imageUrls[i]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `design_image_${i + 1}.png`; // Set dynamic filename or customize as needed
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

  } catch (error) {
    console.error("Error downloading mockup:", error);
    toast({
      title: "Download failed",
      variant: "destructive",
    });
  }
};




    return(

        <>



        {order && (
            <>

<p className="text-sm text-gray-700 mb-2">factoryDashboard/Orders</p>
<h1 className="text-2xl font-semibold">Order Details</h1>
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col md:flex-row items-center">
      <div className="grid gap-2">
            <CardTitle className="font-extrabold">Order Infos :</CardTitle>
            <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
                        <div>
                            <p className="font-bold">Order Id:</p>
                            <p className="text-xs">{order?.id}</p>
                        </div>
                        <div>
                            <p className="font-bold">Order Status:</p>
                            <p><Badge className={`${{
                              'PROCESSING': 'bg-blue-700',
                              'DELIVERED': 'bg-green-700',
                              'REFUSED': 'bg-red-700',
                              'CANCELED': 'bg-red-700'
                            }[order.status]} hover:bg-gray-700`}>
                              {order.status}
                        </Badge></p>
                        </div>
                        <div>
                            <p className="font-bold">Order Type:</p>
                            <p><Badge className={`${order.type === 'CONFIRMED' ? 'bg-green-700' : order.type === 'NOT_CONFIRMED' ? 'bg-orange-400' : order.type === 'CANCELED' ? 'bg-red-700' : 'bg-gray-700'} hover:bg-gray-700`}>
                            {order.type}
                            </Badge>
                        </p>
                        </div>
                        <div>
                            <p className="font-bold">Is Order Paid:</p>
                            <p><Badge className={`${order.isPaid ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                              {order.isPaid ? "Is Paid" : "Not Paid"}
                              </Badge>
                              </p>
                        </div>
                        <div>
                            <p className="font-bold">Is Order Printed:</p>
                            <p><Badge className={`${order.printed ? 'bg-green-700' :  'bg-red-700'} hover:bg-gray-700`}>
                              {order.printed ? "Printed" : "Not Printed"}
                              </Badge>
                              </p>
                        </div>
                        <div>
                            <p className="font-bold">Client Name:</p>
                            <p>{order.clientName}</p>
                        </div>
                        <div>
                            <p className="font-bold">Client Phone Number:</p>
                            <p>{order?.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="font-bold">Shipping Address:</p>
                            <p>{order.shippingAddress}</p>
                        </div>
                        <div>
                            <p className="font-bold">order Amount:</p>
                            <p>{order.amount} TND</p>
                        </div>
                        <div>
                        <Button onClick={handleChange} variant={"link"}>Change Printing State</Button>
                        </div>
                    </div>
                </CardDescription>

          </div>
        </CardHeader>
        <Separator className="w-full"/>
        <CardContent>
            <p className="text-gray-600 font-extrabold mt-6">Order Items :</p>
            <p className="text-red-600 text-sm">
        <span className="text-blue-600 font-medium">Guide :</span> Click on the product!
      </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-2 md:ml-10 mt-6">
            {order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className={cn("aspect-square rounded-xl cursor-pointer", {
                          "border-blue-500 border-2": index === selectedItemIndex,
                        })}
                        onClick={() => {
                            setSelectedItem(item)
                            handleItemClick(index)}}
                      >
                        <ImageSlider urls={item.capturedMockup} />
                      </div>
                    ))}
                  </div>
                </CardContent>

      </Card>  





            {/* item infos */}

    {selectedItem && selectedItem.product && (
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
 <CardHeader className="flex flex-col md:flex-row items-center">
 <div className="grid gap-2">
            <CardTitle className="font-extrabold">Order Item Infos :</CardTitle>
            <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 mt-2">
            <div>
                            <p className="font-bold">Product Category:</p>
                            <p>{selectedItem.productCategory}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Quantity:</p>
                            <p>{selectedItem.quantity}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Size:</p>
                            <p>{selectedItem.productSize}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Color:</p>
                            <p>{selectedItem.productColor}</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Base Price:</p>
                            <p>{selectedItem.product.basePrice} TND</p>
                        </div>
                        <div>
                            <p className="font-bold">Product Price:</p>
                            <p>{selectedItem.productPrice} TND</p>
                        </div>

                        
                    </div>
                </CardDescription>

          </div>
        </CardHeader>
        <Separator className="w-full"/>
        <CardContent>
        <div className="mt-6 space-y-4">
        <Button onClick={()=>{downloadMockup(selectedItem.capturedMockup)}} variant={"link"}>Download Product Mockup</Button>

          <div className="text-sm">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
          <div className="font-bold text-xs">Front Design Id : <span className="text-gray-600 font-semibold">
                {selectedItem.frontsellerDesignId ?? "N/A"}
              </span>
            </div>
            <div className="font-bold">Front Design Name : <span className="text-gray-600 font-semibold">
                {selectedItem.frontsellerDesign?.name ?? "N/A"}
              </span>
            </div>
          </div>

          <Button onClick={()=>{
            const imageUrl = selectedItem.frontsellerDesign?.imageUrl;
            downloadDesign(imageUrl ?? '')}} variant={"link"}>Download Front Design</Button>
          </div>



          <div className="text-sm">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0">
          <div className="font-bold text-xs">Back Design Id : <span className="text-gray-600 font-semibold">
                {selectedItem.backsellerDesignId ?? "N/A"}
              </span>
            </div>
            <div className="font-bold">Back Design Name : <span className="text-gray-600 font-semibold">
                {selectedItem.backsellerDesign?.name ?? "N/A"}
              </span>
            </div>
          </div>

              <Button onClick={()=>{
            const imageUrl = selectedItem.backsellerDesign?.imageUrl;
            downloadDesign(imageUrl ?? '')}} variant={"link"}>Download Back Design</Button>
          </div>



            
          </div>
          

            
        </CardContent>

      </Card> 
        
    )}



  

      </section>
  
  
  
  
    </div>

            </>
        )}
<LoadingState isOpen={open} />


        </>
        
    )


  }

  export default ProductOrderView