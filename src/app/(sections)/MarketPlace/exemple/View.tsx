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
import { Product, Store, User } from '@prisma/client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProductListing from "@/components/MarketPlace/ProductListing"
import { useEffect, useMemo, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Loader } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { fetchProducts } from '@/actions/actions'

interface Productswithstore extends Product {
  store : Store
}

interface ProductReelProps {
  initialProducts : Productswithstore[]
  totalCount : number
  initialPage:number
  limit:number
  user : User
  categories : string[]
  collections : string[]

}

const View = ({ initialProducts,totalCount,initialPage, limit, user , categories , collections }: ProductReelProps) => {
  const [products, setProducts] = useState(initialProducts);

  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);


  useEffect(() => {
      const fetchNewProducts = async () => {
        if (products.length < totalCount && inView) {
        try {
        setIsLoading(true);
        const {products} = await fetchProducts(currentPage + 1 , limit )
        if (products.length > 0) {
          setProducts(prevProducts => {
            const newProducts = products.filter(
                product => !prevProducts.some(p => p.id === product.id)
            );
            return [...prevProducts, ...newProducts];
          });
          setCurrentPage(currentPage + 1);
          setIsLoading(false);
        }
        } catch (error) {
          console.error('Error during affiliate click handling:', error);
          // Optionally handle errors, e.g., show an error message to the user
        }
    }else{
      setIsLoading(false);
    }
    }
    fetchNewProducts()
  }, [inView, products, isLoading, limit, totalCount, currentPage]);

   // Calculate the price range intervals
   function calculatePriceRanges(products: Product[]): [number, number][] {
    if (products.length === 0) return [];
  
    const prices = products.map(product => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
  
    // If minPrice and maxPrice are the same, there's no range, return a single range
    if (range === 0) return [[minPrice, maxPrice]];
  
    // Calculate three price ranges, dividing the range into three equal parts
    const step = range / 3;
  
    const priceRanges: [number, number][] = [
      [minPrice, minPrice + step],
      [minPrice + step, minPrice + 2 * step],
      [minPrice + 2 * step, maxPrice]
    ];
  
    // Round the price ranges to remove decimals
    return priceRanges.map(([min, max]) => [Math.floor(min), Math.floor(max)]);
  }
  

  const priceRanges: [number, number][] = useMemo(() => calculatePriceRanges(products || []), [products]);








  



  return (
    <section className='py-4'>
     
     <div className='bg-muted/50 rounded-xl py-10 mx-auto text-center flex flex-col items-center max-w-1xl'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            Market
            <span className='text-yellow-400'>
            Place
            </span>
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
              Discover our products collection
            </p>    
            <div className="flex flex-col">
            <div className="flex flex-col gap-2 md:flex-row">
            <div className="mt-3 flex-1">
        <Select>
            <SelectTrigger className="w-[180px] ">
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
    <div className="mt-3 flex-1">
            <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter By Category" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
            </SelectContent>
        </Select> 
    </div>
    <div className="mt-3 flex-1">
                <Select >
                    <SelectTrigger className="w-[180px] ">
                    <SelectValue placeholder="Filter By Collection" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    {collections.map((collection, index) => (
                    <SelectItem key={index} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
    <div className="mt-3 flex-1">
    <Select>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select Price Range" />
    </SelectTrigger>
    <SelectContent>
    <SelectGroup>
       <SelectLabel>Select Price Range</SelectLabel>
      {priceRanges.map((range, index) => (
       <SelectItem key={index} value={index.toString()}>
        {range[0]} TND - {range[1]} TND
       </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
    </div>
  </div>

  <div className="mt-3 text-gray-500 text-sm">
    Total Products found : {totalCount}
  </div>
    
</div>

              
            </div>

            <div className='relative my-4'>
            {products!.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
              <div
                aria-hidden='true'
                className='relative mb-4 h-40 w-40 text-muted-foreground'>
                    <NextImage
                  fill
                  src='/hippo-empty-cart.png'
                  loading='eager'
                  alt='empty shopping cart hippo'
                />
              </div>
              <h3 className='font-semibold text-2xl'>
                No Products found !
              </h3>
              <p className='text-muted-foreground text-center'>
                Whoops! Nothing to show here yet.
              </p>
            </div>
            ) : (
              <>
            <div className=' w-full grid 
              lg:grid-cols-4 
              md:grid-cols-2 
              sm:grid-cols-2
              grid-cols-2
              gap-y-4
              gap-2
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

            {products?.map((product, index) => (
              <ProductListing
                user={user}
                key={`product-${index}`}
                product={product}
                index={index+1}
              />
            ))}

          </div>
          <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          {inView && isLoading && (
            <Loader className="animate-spin mt-8 text-blue-500"/>
          )}
          {!isLoading && (
            <Label className='flex justify-center items-center text-blue-500 font-semibold animate-pulse mt-8'>
              No more products to display ! 
            </Label>
          )}
        </div>
         </section>
        </>
            )}
   
      </div>
    </section>
  )


  
}




export default View