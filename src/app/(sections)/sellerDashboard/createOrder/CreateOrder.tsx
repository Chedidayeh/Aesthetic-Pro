/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { toast, useToast } from '@/components/ui/use-toast'
import {  ChangeEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {  CircleDollarSign, CreditCard, Eye, Heart, Loader2, OctagonAlert, PenTool, SquarePen, Tags, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useRouter } from 'next/navigation';
import { Platform, Product } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import  { createOrderDb } from "./actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSizes } from "../../PodProducts/product/[productId]/actions"
import { getStoreByUserId, getUser } from "@/actions/actions"
interface DesignViewProps {
  sellerProductsData: Product[];
  platform : Platform
  }


const CreateOrder = ({
  sellerProductsData,
  platform
  }: DesignViewProps) => {
        const router = useRouter();
        const { toast } = useToast()

        
        // serach and sort filter
        const [searchQuery, setSearchQuery] = useState('');
        const [sortOption, setSortOption] = useState('');

        const [isClicked, setIsClicked] = useState(false);



        
  







   
        
                
                // search and sort filter
                
                const filteredProduct = sellerProductsData.filter((design) => {
                  const lowerCaseQuery = searchQuery.toLowerCase();
                  const lowerCaseName = design.title.toLowerCase();
                  const tagsMatch = design.tags && design.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
                  return lowerCaseName.includes(lowerCaseQuery) || (design.tags && tagsMatch);
                });
              
                if (sortOption === 'sales') {
                  filteredProduct.sort((a, b) => b.totalSales - a.totalSales);
                } else if (sortOption === 'price') {
                  filteredProduct.sort((a, b) => b.price - a.price);
                } else if (sortOption === 'views') {
                  filteredProduct.sort((a, b) => b.price - a.price);
                }

                const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                };

                const handleSortChange = (e: string) => {
                    setSortOption(e);
                };





                const [isDialogOpen, setisDialogOpen] = React.useState(false);
                const [selectedCat, setSelectedCat] = React.useState<number | null>(null);
                const [selectedSizes, setselectedSizes] = React.useState<string[] | null>([]);
                const [selectedProduct, setselectedProduct] = React.useState<Product>();
                const [capturedProduct, setcapturedProduct] = React.useState<string[]>([]);
                const [colorIndex, setcolorIndex] = React.useState<number | null>(null);

                const handleCatClick = async (index: number, product: Product) => {
                  const newSelectedCat = selectedCat === index ? null : index;
                  setSelectedCat(newSelectedCat);
                
                  if (newSelectedCat !== null) {
                    const sizes = await getSizes(product.category);
                    setselectedSizes(sizes);
                    setselectedProduct(product);
                
                    const frontCap = product.croppedFrontProduct?.[index] ?? "";
                    const backCap = product.croppedBackProduct?.[index] ?? "";
                    const filteredCapturedProduct = [frontCap, backCap].filter(cap => cap !== "");
                    setcolorIndex(index)
                    setcapturedProduct(filteredCapturedProduct);
                    setisDialogOpen(true);

                  } else {
                    setisDialogOpen(false)
                    setselectedSizes([]);
                    setselectedProduct(undefined);
                    setcapturedProduct([]);
                    
                    toast({
                      title: 'Select a color to continue',
                      variant: 'destructive',
                    });
                    return
                  }
                
                };



                  // create order code : 
                  const [name, setName] = useState("");
                  const [phoneNumber, setPhoneNumber] = useState("");
                  const [address, setAddress] = useState("");
                  const [selectedSize, setSelectedSize] = useState("");
                  const [quantity, setQuantity] = useState(1);
                  const isValid = name.trim() !== "" && phoneNumber.length===8 
                  && address.trim() !== "" && selectedSize !== "" && quantity >=1 && quantity <= platform.maxProductQuantity && !quantity


                  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    setName(event.target.value);
                  };
                
                  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const phoneNumberValue = event.target.value;
                      setPhoneNumber(phoneNumberValue);
                  };
                
                  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(event.target.value);
                  };
                
                  const handleSizeChange = (event: string) => {
                    setSelectedSize(event);
                  };
                
                  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    setQuantity(parseInt(event.target.value));
                  };
                
  
                  // check phone number length
                  const [phoneNumberError, setPhoneNumberError] = useState('');
                  const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
                  const handlePhoneNumberBlur = () => {
                    if (phoneNumber.length !== 8) {
                      setPhoneNumberError('Phone number must be 8 digits long.');
                    } else {
                      setPhoneNumberError('');
                    }
                  };

                

                  // save Order function
                  const createOrder = async () => {
                    try {
                      openDialog()
                      if(!selectedProduct) {
                        toast({
                          title: 'No selected product found',
                          variant: 'destructive',
                        });
                        return
                      }        
                      
                      const user = await getUser()
                      const store = await getStoreByUserId(user?.id!)

                      const result = await createOrderDb(store?.storeName!, selectedProduct,capturedProduct,name,phoneNumber,address,selectedSize,quantity,colorIndex!)

                      if(result.success){
                        toast({
                          title: 'Order Was Successfully Created',
                          description: 'Refrech the page.',
                          variant: 'default',
                        });
                        router.push("/sellerDashboard/orders")
                      }
                      else if (result.error){
                        closeDialog()
                        console.error('Error during order creating:')
                        toast({
                          title: 'Something went wrong',
                          description: 'There was an error on our end. Please try again.',
                          variant: 'destructive',
                      });
                      }
                      

                    } catch (error) {
                      closeDialog()
                      // Handle network errors or other exceptions
                        console.error('Error during order creating:', error)
                        toast({
                          title: 'Something went wrong',
                          description: 'There was an error on our end. Please try again.',
                          variant: 'destructive',
                      });
                    }

                    };


                     // to trigger the alert dialog
                    const alertDialogTriggerRef = useRef<HTMLButtonElement>(null);
                    const alertDialogCancelRef = useRef<HTMLButtonElement>(null);
                    // function will trigger the dialog
                      const openDialog = () => {
                        if (alertDialogTriggerRef.current) {
                          alertDialogTriggerRef.current.click();
                        }
                      };

                      // function will cancel the dialog
                      const closeDialog = () => {
                        if (alertDialogCancelRef.current) {
                          alertDialogCancelRef.current.click();
                        }
                      };





              

                




  return (

    <>


                            {/* The AlertDialog loading component */}
                          <AlertDialog>
                          <AlertDialogTrigger asChild ref={alertDialogTriggerRef}>
                            <button className="hidden">Hidden Trigger</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader className="flex flex-col items-center">
                              <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
                                Creating Your Order!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                {/* Replace Loader2 with your loader component */}
                                <Loader2 className="text-blue-700 h-[50%] w-[50%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogCancel className="hidden" ref={alertDialogCancelRef}>Cancel</AlertDialogCancel>
                          </AlertDialogContent>
                        </AlertDialog>


                        {/* The AlertDialog create order component */}

                    <AlertDialog open={isDialogOpen}>
                          <AlertDialogTrigger asChild>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Creating a client Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Please make sure to fill all the necessary details!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-left">
                                  Client Name :
                                </Label>
                                <Input id="name" type="text" className="col-span-3 " value={name} onChange={handleNameChange} />
                              </div>
                              <div className="grid grid-cols-4 gap-4">
                                  <Label htmlFor="phoneNumber">Phone Number:</Label>
                                  <div className="col-span-3">
                                    <Input 
                                      id="phoneNumber" 
                                      type="number" 
                                      pattern="\d{8}"
                                      onBlur={handlePhoneNumberBlur}
                                      placeholder="99 999 999" 
                                      onChange={handlePhoneNumberChange}
                                      className={`${inputClassName} focus:ring-0  focus:border-green-500`}
                                      required 
                                    />
                                    {phoneNumberError && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {phoneNumberError}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-left">
                                  Client Address:
                                </Label>
                                <Input id="address" maxLength={20} type="text" className="col-span-3 " value={address} onChange={handleAddressChange} />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-left">
                                Product Size :
                              </Label>
                              <Select value={selectedSize} onValueChange={handleSizeChange}>
                                <SelectTrigger className="w-[180px] ">
                                  <SelectValue placeholder="Select a size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select a size</SelectLabel>
                                    {selectedSizes!.map((size, index) => (
                                      <SelectItem key={index} value={size}>{size}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-left">
                                  Product Quantity : <p className="text-xs text-gray-500">Max {platform.maxProductQuantity}</p>
                                </Label>
                                <Input id="quantity" type="number" min={1} max={platform.maxProductQuantity} value={quantity} onChange={handleQuantityChange} className="w-[180px] col-span-3 " />
                              </div>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={()=>setisDialogOpen(false)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction disabled={!isValid} onClick={()=>{
                                setisDialogOpen(false)
                                createOrder()
                                }}>Create</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>




<p className="text-sm text-gray-700 mb-2">SellerDashboard/Create Order</p>

  <h1 className="text-2xl font-semibold mb-8">Create Your Own Order</h1>
  
  
<Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-7">
  <div className="ml-0 sm:ml-5 mt-2">
  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
       
       {/* Sorting select */}
      <Select
          value={sortOption}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-[180px] ">
          <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="views">Views</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>


          <Input
              type="search"
              className="w-full sm:w-[50%] "
              placeholder="Search for your products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />        
            <Link href="/sellerDashboard/createProduct">
              <Button  
              className="w-full sm:w-auto mb-4 mt-0"
              type="submit" 
              loadingText='Redirecting'
              isLoading={isClicked} 
              disabled={isClicked}
              onClick={() => setIsClicked(true)}
              variant="default">Create New Product
               <PenTool className="h-4 w-4 ml-2" />
             </Button>
             </Link>
    </div>
    <p className='text-gray-600 text-sm'><span className='text-blue-600 font-medium'>Guide :</span> Select a product !</p>

  </div>
</CardHeader>
    <hr className="border-t border-gray-300 mb-5" /> {/* Add this line for the header line */}
    <CardContent >

     {sellerProductsData.length == 0  && (
            <>
             <h1 className="text-center text-3xl font-bold col-span-full">You don't have any Products for now !</h1>
                <div className="flex justify-center items-center mt-4">
             <NextImage
                alt=""
                src="/upload.png"
                width={900}
                height={900}
            />
            </div>
             </>
     )}

                  {filteredProduct.length === 0 && sellerProductsData.length != 0  ? (
                     <>
                        <h1 className="text-center text-3xl font-bold col-span-full">No Product found by that
                           <span className='text-purple-800'> Title</span> !</h1>
                            <div className="flex justify-center items-center mt-4">
                        <NextImage
                            alt=""
                            src="/upload.png"
                            width={900}
                            height={900}
                        />
                        </div>
                        </>       
                       ) : (        
                       <>
              <div className="relative mt-5 grid grid-cols-1 mb-20 pb-20">
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">

                     {/* designs Cards */}
                     {filteredProduct.map((product, index) => (               
                            <HoverCard key={product.id}>
                                <HoverCardTrigger asChild>
                                <div className="shadow-md rounded-2xl shadow-gray-300 relative">
                                  <Badge variant="secondary" className="absolute bg-gray-200 top-2 left-2 px-2 py-1 rounded">
                                  <div className="flex items-center">
                                        <CircleDollarSign className="mr-2 h-4 w-4 text-green-800 opacity-70" />{" "}
                                        <span className="text-xs text-gray-600">{product.price} TND</span>
                                    </div>                                  
                                    </Badge>
                                    

                                    {/* View product  */}
                                    <Sheet>
                                    <SheetTrigger asChild>
                                      <Badge
                                        variant="default" 
                                        className="absolute top-2 right-2 px-2 py-1 rounded cursor-pointer">
                                        <div className="flex items-center">
                                          Select
                                        </div>                                  
                                      </Badge>
                                    </SheetTrigger>
                                    <SheetContent side="bottom">

                                      <SheetHeader>
                                        <SheetTitle>Select color</SheetTitle>
                                        <SheetDescription>
                                        </SheetDescription>
                                      </SheetHeader>
                                      <ScrollArea className="w-full h-96">
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 bg-gray-900/5">
                                        {product.croppedFrontProduct.map((image, index) => (
                                          <Card 
                                            onClick={() => handleCatClick(index, product)} 
                                            key={`front-${index}`} // Ensure unique keys
                                            className={cn("border w-full sm:w-48", selectedCat === index && "border-primary")}>
                                            <CardContent className="flex flex-col items-center justify-center p-2">
                                              <NextImage 
                                               src={`/api/getImage?imageUrl=${encodeURIComponent(image)}`}
                                                alt="" 
                                                width={900}
                                                height={900}
                                                className="mb-2 w-full h-auto object-cover" 
                                              />
                                              <div className="flex flex-wrap justify-center gap-2">
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                        {product.croppedBackProduct.map((image, index) => (
                                          <Card 
                                            onClick={() => handleCatClick(index, product)} 
                                            key={`back-${index}`} // Ensure unique keys
                                            className={cn("border w-full sm:w-48", selectedCat === index && "border-primary")}>
                                            <CardContent className="flex flex-col items-center justify-center p-2">
                                              <NextImage 
                                                src={image} 
                                                alt="" 
                                                width={900}
                                                height={900}
                                                className="mb-2 w-full h-auto object-cover" 
                                              />
                                              <div className="flex flex-wrap justify-center gap-2">
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                      </ScrollArea>
                                      <SheetFooter>
                                        <SheetClose asChild>
                                        </SheetClose>
                                      </SheetFooter>

                                    </SheetContent>
                                  </Sheet>


                                  <NextImage
                                      src={`/api/getImage?imageUrl=${encodeURIComponent(product.croppedFrontProduct?.[0] ?? product.croppedBackProduct?.[0])}`}
                                      alt={product.title}
                                      width={1000}
                                      height={1000}
                                      className="border-black"
                                  />

                            <div className="absolute bottom-2 left-0 right-0 z-10 text-center">
                                <Badge variant="secondary" className="bg-gray-200 text-gray-800">
                                  {product.title}
                                </Badge>
                              </div>


                              </div>
                              </HoverCardTrigger>
                                <HoverCardContent className="w-50 bg-gray-200">
                                <div className="flex justify-between space-x-4">
                                    <div className="space-y-1">
                                    <div className="flex items-center pt-2">
                                        <CreditCard className="mr-2 h-4 w-4 text-green-800 opacity-70" />{" "}
                                        <span className="text-xs text-muted-foreground">{product.totalSales} Sales</span>
                                    </div>
                                    </div>
                                </div>
                                </HoverCardContent>
                            </HoverCard>

                            ))}
        
        </div>
      </div>
      </>
    )}

    </CardContent>
    <CardFooter className='relative flex flex-col items-center justify-center' />
  </Card>

                             
 

                            

                            </>
  
  );
};

export  default CreateOrder ;

