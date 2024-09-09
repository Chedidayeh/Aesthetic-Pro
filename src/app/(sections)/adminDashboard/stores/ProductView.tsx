/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
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
    CircleX,
    CreditCard,
    DollarSign,
    Heart,
    Menu,
    OctagonAlert,
    Package2,
    Palette,
    Search,
    Shirt,
    Trash2,
    Users,
    X,
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
import { OrderItem, Product, SellerDesign, Store, User } from "@prisma/client"
import { tree } from "next/dist/build/templates/app-page"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { acceptDesign, acceptProduct, deleteStoreById, refuseDesign, refuseProduct } from "./actions"
import { Input } from '@/components/ui/input'
import LoadingState from '@/components/LoadingState'
import ImageSlider from '@/components/PodProducts/ImageSlider'
  

interface ExtraProduct extends Product {
  frontDesign : SellerDesign | null,
  backDesign : SellerDesign | null ,
}

interface ExtraStore extends Store {
    user : User
    products : ExtraProduct[]
    designs  : SellerDesign[]
}
  
  
  
interface StoresViewProps {
  selectedStore: ExtraStore;
  }
  
  const ProductView = ({ selectedStore }: StoresViewProps ) => { 
    const router = useRouter();
    const { toast } = useToast()




    const [reasonForRejection, setReasonForRejection] = useState('');
    const [isDialogOpen, setisDialogOpen] = useState<boolean>(false);









      // search query for products
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const [filterBy, setFilterBy] = useState<string>('');

  const filteredProducts = selectedStore?.products.filter((product) =>
    (filterBy === '' || (filterBy === 'accepted' && product.isProductAccepted) || 
     (filterBy === 'refused' && product.isProductRefused) || 
     (filterBy === 'action' && !product.isProductAccepted && !product.isProductRefused)) &&
    (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().startsWith(searchQuery.toLowerCase()))
  );


    const [open, setOpen] = useState<boolean>(false);

    
    const handleAccept = async (productId : string) =>{

      try {
        setOpen(true)
        await acceptProduct(productId)
        toast({
          title: 'Product Was Successfully Accepted',
          variant: 'default',
        });
        setOpen(false)
        router.refresh()
      } catch (error) {
        setOpen(false)
        toast({
          title: 'Error : Product Was not Accepted',
          variant: 'destructive',
        });
      }

    }

    const handleRefuse = async (productId : string) =>{

      try {
        setOpen(true)
        await refuseProduct(productId, reasonForRejection)
        router.refresh()
        toast({
          title: 'Product Was Successfully Refused',
          variant: 'default',
        });
        setOpen(false)
      } catch (error) {
        console.log(error)
        setOpen(false)
        toast({
          title: 'Error : Product Was not Refused',
          variant: 'destructive',
        });
      }

    }




// Function to handle download
const downloadMockup = async (product: ExtraProduct) => {
  try {
    // Combine all image sources into a single array
    const imageUrls = [
      ...product.croppedFrontProduct,
      ...product.croppedBackProduct,
      product.frontDesign?.imageUrl,
      product.backDesign?.imageUrl,
    ].filter(Boolean); // Filter out any undefined or null values

    // Loop through each imageUrl and download
    for (let i = 0; i < imageUrls.length; i++) {
      const response = await fetch(imageUrls[i]!);
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




    return (
      <>



      {/* store products view */}
      {filteredProducts && (
        <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="">
            <div className="grid gap-2">
              <CardTitle className="font-bold">Store Products :</CardTitle>
              <CardDescription>
              <div className='mt-2 flex flex-col sm:flex-row items-center justify-center'>
              <Input className='w-full sm:w-1/2 lg:w-[40%] mb-2 sm:mb-0' type="text" placeholder="Search for a product by title or by id..." value={searchQuery} onChange={handleSearchChange} />
              <div className='w-full sm:w-auto sm:ml-2'>
                <Select onValueChange={(value) => setFilterBy(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="refused">Refused</SelectItem>
                      <SelectItem value="action">Awaiting action</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>


              </CardDescription>
              <CardContent>

              <div className='mt-4 w-full grid 
              xl:grid-cols-3 
              lg:grid-cols-2 
              md:grid-cols-1 
              sm:grid-cols-1
              gap-y-10
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

  {filteredProducts.map((product, index) => {
    // Combine front and back product URLs
    const combinedUrls = [
      ...product.croppedFrontProduct,
      ...product.croppedBackProduct
    ];

    return (
      <>
        {/* ImageSlider with combinedUrls */}


  {/* Product Cards */}
    <div key={index} className='flex flex-col items-center mb-4'>
    <div className='relative h-52 w-52 sm:h-52 sm:w-52 lg:h-80 lg:w-80'>
       <ImageSlider urls={combinedUrls} />
    </div>

      <div className='mt-16 text-center'>
        <Badge>{product.title}</Badge>
      </div>
      <div className='my-2 text-center'>
        <Badge
        onClick={() => { downloadMockup(product) }} 
        className='bg-gray-500 text-white cursor-pointer'>
          Download Product
        </Badge>
      </div>
        <div className="flex justify-center items-center mt-2">
         {!product.isProductAccepted && !product.isProductRefused && (
            <>
            <AlertDialog open={isDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Reason for rejecting</AlertDialogTitle>
                                      </AlertDialogHeader>
                                      <div className="grid gap-4 py-4">
                                          <Input value={reasonForRejection}
                                          onChange={(e) => setReasonForRejection(e.target.value)} 
                                          type="text" 
                                          placeholder='Type the reason' 
                                          className="w-full bg-gray-100" />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={()=>setisDialogOpen(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction disabled={reasonForRejection === ""} className='bg-red-500 hover:bg-red-400' onClick={()=>{
                                          setisDialogOpen(false)
                                          handleRefuse(product.id)
                                          }}>Delete Product</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
               <Badge onClick={()=>setisDialogOpen(true)} className='hover:text-red-500 cursor-pointer' variant={`outline`}>
                <CircleX/>
               </Badge>
                 <Badge onClick={()=>handleAccept(product.id)} className='ml-2 hover:text-green-500 cursor-pointer' variant={`outline`}>
              <CircleCheck/>
            </Badge>
               </>
                )}
             {product.isProductAccepted &&(
            <Badge className='bg-green-500' variant={`default`}>
             Accepted
             </Badge>
             )}
            {product.isProductRefused &&(
            <Badge className='bg-red-500' variant={`default`}>
             Refused
          </Badge>
       )}
      </div>
    </div>



      </>
    );
  })}


  </div>
              </CardContent>
            </div>
          </CardHeader>
        </Card>
      )}

 
<LoadingState isOpen={open} />


    </>
    );
  }
  
  export default ProductView;