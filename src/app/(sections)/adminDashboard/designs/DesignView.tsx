/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
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
  import { fetchProducts } from "@/actions/actions";
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
import { deleteDesign } from "../../sellerDashboard/designs/actions"
  
  

interface ExtraDesigns extends SellerDesign {
  frontProducts: Product[] | null;
  backProducts: Product[] | null;
  store : Store;
  frontOrders :  OrderItem[]
  backOrders : OrderItem[]
}
  
  
  
interface ProductViewProps {
    designs: ExtraDesigns[];
  }
  
  const DesignView = ({ designs }: ProductViewProps ) => { 
    const router = useRouter();
    const { toast } = useToast()


     // serach
     const [searchQuery, setSearchQuery] = useState('');
     const [filteredOrders, setFilteredOrders] = useState(designs);
     useEffect(() => {
       const lowercasedQuery = searchQuery.toLowerCase();
       const filtered = designs.filter(design =>
        design.id.startsWith(lowercasedQuery) ||
        design.name.toLowerCase().startsWith(lowercasedQuery)

       );
       setFilteredOrders(filtered);
     }, [searchQuery, designs]);

     const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };




    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [ designId , setdesignId] = useState("")
    const handleDelete = async () =>{
        try {
          const res = await deleteDesign(designId)
          if(res){
            setisDeleteOpen(false)
            toast({
              title: 'Design Was Successfully Deleted',
              variant: 'default',
            });
            router.refresh()
          }
          else{
            setisDeleteOpen(false)
            toast({
              title: 'Design has associated order items and can not be deleted',
              variant: 'destructive',
            });
            router.refresh()
          }
        } catch (error) {
            setisDeleteOpen(false)
            console.log(error)
            toast({
                title: 'design Was Not Deleted',
                variant: 'destructive',
              });
        }
    }



    const [isViewOpen, setisViewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [design , setDesign] = useState <string> ()

    const viewDesign = (design : ExtraDesigns) => {
      setDesign(design.imageUrl)
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
 const downloadDesign = async (imageUrl: string) => {
   try {
     setIsDownloadOpen(true);
     const response = await fetch(imageUrl);
     const blob = await response.blob();
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.href = url;
     a.download = "design_image.png"; // You can set the filename here
     document.body.appendChild(a);
     a.click();
     a.remove();
     setIsDownloadOpen(false);
   } catch (error) {
     setIsDownloadOpen(false);
     console.error("Error downloading design:", error);
     toast({
       title: "Download failed",
       variant: "destructive",
     });
   }
 };



     const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    }


    const [selectedFilter, setSelectedFilter] = useState('');
    const handleFilterChange = (value: string) => {
      setSelectedFilter(value);
    };
    useEffect(() => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = designs.filter(design => {
        const matchesSearch = design.id.startsWith(lowercasedQuery) || design.name.toLowerCase().startsWith(lowercasedQuery);
        const matchesFilter = selectedFilter === '' || 
                              (selectedFilter === 'accepted' && design.isDesignAccepted) ||
                              (selectedFilter === 'refused' && design.isDesignRefused) ||
                              (selectedFilter === 'action' && !design.isDesignAccepted && !design.isDesignRefused) ||
                              (selectedFilter === 'noItems' && design.frontOrders.length + design.backOrders.length === 0);
        return matchesSearch && matchesFilter;
      });
      setFilteredOrders(filtered);
    }, [searchQuery, designs, selectedFilter]);
        

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


                                          {/* View design  */}
                                          <AlertDialog open={isViewOpen} >
                                       <AlertDialogTrigger asChild>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className={`flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-slate-200'}`}>

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
                                              <div className="flex items-center justify-center cursor-pointer">
                                              <Badge onClick={toggleDarkMode} variant="secondary">
                                              {darkMode ? 'Light Mode' : 'Dark Mode'}
                                              </Badge>
                                              </div>
                                              <img src={design} alt={`Product Image`}
                                                onContextMenu={(e) => e.preventDefault()}
                                                  className="object-cover" />
                                              </div>

                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={()=>{setisViewOpen(false)}}>Close</AlertDialogCancel>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                  </AlertDialog>


                          {/* The AlertDialog delete design component  */}
                          <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this design ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the design from our MarketPlace.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 
  
  
  <p className="text-sm text-gray-700 mb-2">AdminDashboard/Designs</p>
           <h1 className="text-2xl font-semibold">Manage Designs</h1>
  
  
  
     
  
  
        <div className="flex mt-4 flex-col gap-5 w-full">
  
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
  
  
  
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center bg-muted/50">
          <div className="grid gap-2">
            <CardTitle>Designs</CardTitle>
            <CardDescription>Total: {designs.length}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>


        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
          <Input
            type="search"
            className="w-full sm:w-[50%] "
            placeholder="Enter the design Id, name to make a search..."
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

        <ScrollArea className="mt-4 w-full h-72">
        <Table>
  <TableHeader>
    <TableRow>
      {/* Design Id column */}
      <TableHead className="hidden sm:table-cell">Design Id</TableHead>

      {/* Design Name column */}
      <TableHead>Design Name</TableHead>

      {/* Design price column */}
      <TableHead className="hidden sm:table-cell">Design Price</TableHead>

      {/* Design Store column */}
      <TableHead className="hidden md:table-cell">Design Store</TableHead>

      {/* Is Design Accepted column */}
      <TableHead className="hidden md:table-cell">Is Design Accepted</TableHead>

      {/* Is Design Refused column */}
      <TableHead className="hidden md:table-cell">Is Design Refused</TableHead>

      {/* Ordered Items column */}
      <TableHead className="hidden md:table-cell">Ordered Items</TableHead>

      {/* Actions column */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredOrders.map((design) => (
      <TableRow key={design.id}>
        {/* Design Id cell */}
        <TableCell className="hidden sm:table-cell">{design.id}</TableCell>

        {/* Design Name cell */}
        <TableCell>{design.name}</TableCell>

        {/* Design price cell */}
        <TableCell className="hidden sm:table-cell">{design.price} TND</TableCell>

        {/* Design Store cell */}
        <TableCell className="hidden md:table-cell">{design.store.storeName}</TableCell>

        {/* Is Design Accepted cell */}
        <TableCell className="hidden md:table-cell">{design.isDesignAccepted ? 'Yes' : 'No'}</TableCell>

        {/* Is Design Refused cell */}
        <TableCell className="hidden md:table-cell">{design.isDesignRefused ? 'Yes' : 'No'}</TableCell>

        {/* Ordered Items cell */}
        <TableCell className="hidden md:table-cell text-center">{design.frontOrders.length + design.backOrders.length}</TableCell>

        {/* Actions cell */}
        <TableCell>
          <TooltipProvider>
            <div className="flex items-center">
              {/* View Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Eye
                    onClick={() => {
                      viewDesign(design);
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
                      setdesignId(design.id);
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
                      downloadDesign(design.imageUrl);
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
  
  export default DesignView;