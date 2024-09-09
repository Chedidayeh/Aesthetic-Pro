/* eslint-disable @next/next/no-img-element */
'use client'
import NextImage from 'next/image'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import Link from 'next/link'
import { Product, SellerDesign, User } from '@prisma/client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProductListing from "@/components/PodProducts/ProductListing"
import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Store} from '@prisma/client'
import { checkUserLike, updateStoreLikes } from "./actions"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge'
import ProductsView from './ProductsView'
import DesignView from './DesignView'
import { FaFacebook, FaInstagram } from 'react-icons/fa'

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
  categories : string[]
  collections : string[]


}
const StoreView = ({ store, user , designs , categories , collections }: ProductReelProps) => {
  

    const [activeTab, setActiveTab] = useState('Products');
    const handleTabChange = (value : string) => {
      setActiveTab(value);
    };

    const handleFacebookIconClick = () => {
      const url = store.facebookLink;
      window.open(url!, '_blank', 'noopener,noreferrer');
    };

    const handleInstagramIconClick = () => {
      const url = store.instagramLink;
      window.open(url!, '_blank', 'noopener,noreferrer');
    };

  return (

    
    <section className='py-4'>
     
     <div className='py-10 bg-muted/50 rounded-xl mx-auto text-center flex flex-col items-center max-w-1xl'>

     <div className="flex flex-col items-center text-center">

     <div className="relative w-[200px] h-[200px] rounded-full bg-gray-100 border-2 shadow-xl shadow-blue-200 border-gray-500 overflow-hidden">
          <NextImage
            src={`/api/getImage?imageUrl=${encodeURIComponent(store.logoUrl)}`}
            alt="store"
            layout="fill"
            objectFit="cover"
            quality={40}
            className="rounded-full"
          />
     </div>
  
  <h1 className="text-xl mt-4 font-bold tracking-tight sm:text-xl">
    <span className="text-blue-600">
      {store?.storeName}{' '}
    </span>
  </h1>
  <p className="mt-2 text-sm text-muted-foreground">
    {store?.storeBio}
  </p>

  <div className='my-2'>
  <p className='text-sm'>Contact the seller</p>
  </div>
  {store.facebookLink && store.instagramLink && (
<>
  <div className="flex gap-6 my-2">
    {store.facebookLink && (
  <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600 " onClick={handleFacebookIconClick} />
    )}
    {store.instagramLink && (
  <FaInstagram className="text-2xl cursor-pointer hover:text-red-600" onClick={handleInstagramIconClick} />
    )}
  </div>
  <div className=''>
  <p className='text-sm'>or</p>
  </div>
  </>
 )}
  <div className='my-2'>
  <p className='text-sm'>+216 {store.userPhoneNumber}</p>
  </div>
</div>


<div className="mt-4 items-center justify-center flex">
            <Tabs defaultValue="Products" className="w-full sm:w-[500px]" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Products">Store Products</TabsTrigger>
          <TabsTrigger value="Designs">Store Designs</TabsTrigger>
        </TabsList>
      </Tabs>

          </div>
     
          </div>


          {activeTab === 'Products' && (
            <div className='mt-2'>
            <ProductsView store={store} user={user} categories={categories} collections={collections} />
            </div>
            )}

          {activeTab === 'Designs' && (
            <div className='mt-2'>
            <DesignView store={store} user={user} designs={designs} />
            </div>
            )}




    </section>
  )


  
}




export default StoreView