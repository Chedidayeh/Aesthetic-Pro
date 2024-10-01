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
    CircleUser,
    CloudDownload,
    CreditCard,
    DollarSign,
    Eye,
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
import { OrderItem, Product, SellerDesign, Store, User } from "@prisma/client"
import { tree } from "next/dist/build/templates/app-page"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { deleteProduct } from "../../sellerDashboard/products/actions"
  
  

interface ExtraProducts extends Product {
  store : Store
  frontDesign: SellerDesign | null;
  backDesign: SellerDesign | null;
  order : OrderItem[]
}
  
  
  
interface ProductViewProps {
    products: ExtraProducts[];
  }
  
  const ProductView = ({ products }: ProductViewProps ) => { 
    const router = useRouter();
    const { toast } = useToast()
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [ productId , setProductId] = useState("")

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const handleFilterChange = (value: string) => {
      setSelectedFilter(value);
    };
    useEffect(() => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter(product => {
        const matchesSearch = product.id.startsWith(lowercasedQuery) || product.title.toLowerCase().startsWith(lowercasedQuery);
        const matchesFilter = selectedFilter === '' || 
                              (selectedFilter === 'accepted' && product.isProductAccepted) ||
                              (selectedFilter === 'refused' && product.isProductRefused) ||
                              (selectedFilter === 'action' && !product.isProductAccepted && !product.isProductRefused) ||
                              (selectedFilter === 'noItems' && product.order.length === 0)
        return matchesSearch && matchesFilter;
      });
      setFilteredOrders(filtered);
    }, [searchQuery, products, selectedFilter]);
        


     // serach
     const [filteredOrders, setFilteredOrders] = useState(products);
     useEffect(() => {
       const lowercasedQuery = searchQuery.toLowerCase();
       const filtered = products.filter(product =>
        product.id.startsWith(lowercasedQuery) ||
        product.store.storeName!.toLowerCase().startsWith(lowercasedQuery) ||
        product.title.toLowerCase().startsWith(lowercasedQuery)

       );
       setFilteredOrders(filtered);
     }, [searchQuery, products]);

     const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };



    const handleDelete = async () =>{
        try {
          const res = await deleteProduct(productId)
          if(res){
            setisDeleteOpen(false)
            toast({
              title: 'Product Was Successfully Deleted',
              variant: 'default',
            });
            router.refresh()
          }
          else{
            setisDeleteOpen(false)
            toast({
              title: 'Product has associated order items and can not be deleted',
              variant: 'destructive',
            });
            router.refresh()
          }
        } catch (error) {
            setisDeleteOpen(false)
            console.log(error)
            toast({
                title: 'Product Was Not Deleted',
                variant: 'destructive',
              });
        }
    }

    const [isViewOpen, setisViewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productImgs , setproductImgs] = useState <string[]> ([])
    const viewProduct = (product : ExtraProducts) => {
      let imgs = [] as string []
      product.croppedFrontProduct.map((img : string) => {
        imgs.push(img)
      })
      product.croppedBackProduct.map((img : string) => {
        imgs.push(img)
      })
      setproductImgs(imgs)
    }


    // Function to change the state after a delay
    const changeStateAfterDelay = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000); // Change to 1000 milliseconds for 1 second
    };



     // State variables
 const [isDownloadOpen, setIsDownloadOpen] = useState(false);

// Function to handle download
const downloadMockup = async (imageUrls: string[]) => {
  try {
    setIsDownloadOpen(true);

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

    setIsDownloadOpen(false);
  } catch (error) {
    setIsDownloadOpen(false);
    console.error("Error downloading designs:", error);
    toast({
      title: "Download failed",
      variant: "destructive",
    });
  }
};



    return (
      <>


                                              {/* downloading Loader  */}
                                              <AlertDialog open={isDownloadOpen} >
                                       <AlertDialogTrigger asChild>
                                        </AlertDialogTrigger>
                                          <AlertDialogContent className=" flex flex-col items-center justify-center">
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
                                              <Loader2 className="animate-spin text-blue-800 h-[50%] w-[50%]" />
                                              <AlertDialogTitle className="flex flex-col items-center justify-center">Loading</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription className="flex flex-col items-center justify-center">
                                              Please wait while downloading...
                                            </AlertDialogDescription>
                                                    <AlertDialogFooter>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                  </AlertDialog>



                                          {/* View product  */}
                                          <AlertDialog open={isViewOpen} >
                                       <AlertDialogTrigger asChild>
                                        </AlertDialogTrigger>
                                          <AlertDialogContent className=" flex flex-col items-center justify-center">

                                            {isLoading===true && (
                                              <>
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
                                              <Loader2 className="animate-spin text-blue-800 h-[50%] w-[50%]" />
                                              <AlertDialogTitle className="flex flex-col items-center justify-center">Loading</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription className="flex flex-col items-center justify-center">
                                              Please wait while the content is loading...
                                            </AlertDialogDescription>
                                            </>
                                            )}
                                            
                                              <div className={cn(`${isLoading===true ? 'hidden' : ''} `)}>
                                              <Carousel className="w-full max-w-xs">
                                            <CarouselContent>
                                              {productImgs.map((image, index) => (
                                                <CarouselItem key={index}>
                                                  <div className="p-1">
                                                        <NextImage width={900} height={900}
                                                        //  src={`/api/getImage?imageUrl=${encodeURIComponent(image)}`}
                                                         src={image}
                                                         alt={`Product Image ${index + 1}`} className="object-cover" />
                                                  </div>
                                                </CarouselItem>
                                              ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                              </Carousel>
                                              </div>

                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={()=>{setisViewOpen(false)}}>Close</AlertDialogCancel>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                  </AlertDialog>


                          {/* The AlertDialog delete product component  */}
                          <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this product ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the product from our MarketPlace.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 
  
  
  <p className="text-sm text-gray-700 mb-2">AdminDashboard/Products</p>
           <h1 className="text-2xl font-semibold">Manage Products</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Products</CardTitle>
            <CardDescription>Total: {products.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>


        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <Input
          type="search"
          className="w-full sm:w-[50%] "
          placeholder="Enter the product Id, title, store Name to make a search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] ">
            <SelectValue placeholder="Filter By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select</SelectLabel>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="refused">Refused</SelectItem>
              <SelectItem value="action">Awaiting action</SelectItem>
              <SelectItem value="noItems">No Items</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

        <ScrollArea className="mt-4 w-full h-full">
        <Table>
  <TableHeader>
    <TableRow>
      {/* Product Id column */}
      <TableHead className="hidden sm:table-cell">Product Id</TableHead>

      {/* Product Title column */}
      <TableHead>Product Title</TableHead>

      {/* Product Category column */}
      <TableHead className="hidden sm:table-cell">Product Category</TableHead>

      {/* Product price column */}
      <TableHead className="hidden sm:table-cell">Product Price</TableHead>

      {/* Product Store column */}
      <TableHead className="hidden md:table-cell">Product Store</TableHead>

      {/* Is Product Accepted column */}
      <TableHead className="hidden md:table-cell w-[5%]">Is Product Accepted</TableHead>

      {/* Is Product Refused column */}
      <TableHead className="hidden md:table-cell w-[5%]">Is Product Refused</TableHead>

      {/* Ordered Items column */}
      <TableHead className="hidden md:table-cell w-[5%]">Ordered Items</TableHead>

      {/* Actions column */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredOrders.map((product) => (
      <TableRow key={product.id}>
        {/* Product Id cell */}
        <TableCell className="hidden sm:table-cell">{product.id}</TableCell>

        {/* Product Title cell */}
        <TableCell>{product.title}</TableCell>

        {/* Product Category cell */}
        <TableCell className="hidden sm:table-cell">{product.category}</TableCell>

        {/* Product price cell */}
        <TableCell className="hidden sm:table-cell">{product.price.toFixed(2)} TND</TableCell>

        {/* Product Store cell */}
        <TableCell className="hidden md:table-cell">{product.store.storeName}</TableCell>

        {/* Is Product Accepted cell */}
        <TableCell className="hidden md:table-cell">{product.isProductAccepted ? 'Yes' : 'No'}</TableCell>

        {/* Is Product Refused cell */}
        <TableCell className="hidden md:table-cell">{product.isProductRefused ? 'Yes' : 'No'}</TableCell>

        {/* Ordered Items cell */}
        <TableCell className="hidden md:table-cell text-center">{product.order.length}</TableCell>

        {/* Actions cell */}
        <TableCell>
          <TooltipProvider>
            <div className="flex items-center">
              {/* View Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Eye
                    onClick={() => {
                      viewProduct(product);
                      setisViewOpen(true);
                      setIsLoading(true);
                      changeStateAfterDelay();
                    }}
                    className="cursor-pointer hover:text-blue-500"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>View</p>
                </TooltipContent>
              </Tooltip>

              {/* Delete Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Trash2
                    onClick={() => {
                      setisDeleteOpen(true);
                      setProductId(product.id);
                    }}
                    className="cursor-pointer hover:text-red-500 ml-2"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-red-500">
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>

              {/* Upload Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <CloudDownload
                    onClick={() => {
                      setIsDownloadOpen(true);
                      viewProduct(product);
                      downloadMockup(productImgs);
                    }}
                    className="cursor-pointer hover:text-purple-500 ml-2"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-purple-500">
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

          </ScrollArea>
        </CardContent>
      </Card>  
        


      </section>
  
  
  
      <section className={cn(' grid grid-cols-1 p-11 gap-4 transition-all lg:grid-cols-4')}>
  </section>
  
    </div>
  
    </>
    );
  }
  
  export default ProductView;