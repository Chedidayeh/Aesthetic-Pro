/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { checkUserLike, updateStoreLikes } from "./actions"
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
  import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
  import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
  import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
  import { db } from "@/db"
  import UsersTable from "@/components/adminDashboard/UsersTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderItem, Product, SellerDesign, Store, User } from "@prisma/client"
import { tree } from "next/dist/build/templates/app-page"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from '@/components/ui/input'
import LoadingState from '@/components/LoadingState'
import { Label } from '@/components/ui/label'
  

interface StoreDetails extends Store {
    products: Productswithstore[];
  }
  
  interface Productswithstore extends Product {
    store : Store
  }
  interface ProductReelProps {
    store : StoreDetails
    user : User
    designs : SellerDesign[]
  
  }
  
  const DesignView = ({ store, user , designs }: ProductReelProps) => { 

    const router = useRouter();
    const { toast } = useToast()






    // toggle Mode
    const [isDarkMode, setIsDarkMode] = useState(true);
    const handleToggleMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
    };







// Search query for designs
const [searchQuery, setSearchQuery] = useState('');
const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value);
};

// Sorting function based on sortBy criteria
const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option

const filteredAndSortedDesigns = useMemo(() => {
  // Filter designs based on search query
  const filteredDesigns = (designs || []).filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    design.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort the filtered designs based on the selected sort option
  return filteredDesigns.sort((a, b) => {
    switch (sortBy) {
      case 'low':
        return a.price - b.price;
      case 'high':
        return b.price - a.price;
      case 'sales':
        return b.totalSales - a.totalSales;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}, [designs, searchQuery, sortBy]);

const handleSortChange = (event: string) => {
  setSortBy(event);
};
  
  
      // manage likes :
      const [liked, setLiked] = useState(false);
  
      useEffect(() => {
        // Function to check if the store is liked by the user (optional)
        const checkIfLiked = async () => {
          try {
            const response = await checkUserLike(store!.id , user.id)
            console.log(response)
            setLiked(response);
          } catch (error) {
            console.error('Error checking if liked:', error);
          }
        };
    
        checkIfLiked();
      }, );
  
  
      const handleLikeClick = async () => {
        if (!user) {
          toast({
            title: 'No logged in user found !',
            description: 'Try to login first!',
            variant: 'destructive',
          });
          return;
        }
        try {
          await updateStoreLikes(store?.id!, user.id, !liked)  
          setLiked(!liked);
          toast({
            title: !liked ? 'Store liked' : 'Store unliked',
            description: '',
            variant: 'default',
          }); 
          router.refresh()
          return
        } catch (error) {
          console.error('Error updating likes:', error);
        }
      };


      const copyToClipboard = (text : string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Design Name is Copied",
                variant: 'default',
              }); 
        }).catch((err) => {
          console.error('Could not copy text: ', err);
        });
      };



    return (
      <>
       {/* store designs view */}
       {designs.length > 0 ? (

        <>

          <div className='  bg-muted/50 rounded-xl mx-auto text-center flex flex-col items-center max-w-1xl'>

          <div className="flex flex-col mb-4 mt-4 mx-4">
            <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex flex-col mb-4 lg:flex-row lg:items-center lg:gap-2">

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center sm:mt-0 lg:mt-0 lg:flex-1">
              <Input
                className="w-full sm:w-full mb-2 sm:mb-0 lg:w-full"
                type="text"
                placeholder="Search for a design..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center sm:mt-0 lg:mt-0 lg:flex-1">
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    <SelectItem value="high">Highest Price</SelectItem>
                    <SelectItem value="low">Lowest Price</SelectItem>
                    <SelectItem value="sales">Most Selled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>


            <div className="flex items-center justify-center mt-3 lg:mt-0">
              <Button
                variant="default"
                size="sm"
                className="w-full sm:w-[70%] lg:w-auto"
                onClick={handleToggleMode}
              >
                Toggle Mode
              </Button>
            </div>
            <div className="mt-3 flex justify-center lg:mt-0">
              <div
                className={`h-10 w-10 group cursor-pointer flex items-center justify-center rounded-full
                  ${liked ? 'bg-pink-50 text-red-700' : 'bg-pink-50 text-gray-700'} hover:text-red-700`}
                onClick={handleLikeClick}
              >
                <Heart className={`w-1/2 h-1/2 ${liked ? 'fill-current text-red-700' : ''}`} />
              </div>
            </div>
          </div>

            </div>
            <div className="mt-3 text-gray-600 text-sm">
              Total Designs found: {filteredAndSortedDesigns.length}
            </div>
            <div className="mt-3 text-blue-600 text-sm">
              Click on the design to copy its name then this :
            </div>
            <div className="mt-3  text-sm">
            <Link href={'/MarketPlace/create-client-product/upload'}>
                  <Button size={"sm"} variant={"secondary"}>Try these Designs !</Button>
              </Link>  
          </div>
          </div>
                  </div>


          <ScrollArea
            className={cn(
              'relative h-96 sm:h-[400px] lg:h-[600px] flex-1 my-8 w-full  p-2    flex justify-center flex-col items-center'
            )}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-2">
              {filteredAndSortedDesigns.map((design, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div onClick={() => copyToClipboard(design.name)} className={cn(`border-2 rounded-xl p-1 cursor-pointer `, isDarkMode ? 'bg-gray-900' : 'bg-gray-100' )}>
                    <Badge variant={'default'}>{design.price} TND</Badge>
                    <NextImage
                      alt={`Product image ${index + 1}`}
                      className="aspect-square w-full rounded-md object-contain"
                      height={1000}
                      src={design.imageUrl}
                      width={1000}
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                     <Badge
                    variant={'default'}>
                    {design.name}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>


          </>
        ) : (


          <div className='flex h-full flex-col items-center justify-center space-y-1'>
          <div
            aria-hidden='true'
            className='relative mb-4 h-40 w-40 text-muted-foreground'>
            <img
              src='/hippo-empty-cart.png'
              loading='eager'
              alt='empty shopping cart hippo'
            />
          </div>
          <h3 className='font-semibold text-2xl'>
            This Designs section is empty
          </h3>
          <p className='text-muted-foreground text-center'>
            Whoops! Nothing to show here yet.
          </p>
        </div>

       
        )}

  
  

  
    </>
    );
  }
  
  export default DesignView;