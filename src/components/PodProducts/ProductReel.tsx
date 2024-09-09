'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from 'next/link'
import ProductListing from './ProductListing'
import { Product, Store, User } from '@prisma/client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState } from "react"

interface Productswithstore extends Product {
  store : Store
}
interface ProductReelProps {
  user?: User
  title?: string
  href?: string
  products : Productswithstore[]
  subtitle?: string

}

const ProductReel = (props: ProductReelProps) => {
  const { user,title, subtitle, href , products } = props
  const sortedProducts = products?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 8) //only 8 products will be shown


  //slide products
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalProducts = sortedProducts?.length || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };


  return (
    <section className='py-12'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='text-2xl font-bold  sm:text-2xl'>
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>
              {subtitle}
            </p>
          ) : null}
        </div>

        {href ? (
          <div className="text-center">
          <Link
            href={href}
            className=' text-sm font-medium text-blue-600 hover:text-blue-500'>
            Shop the collection{' '}
            <span aria-hidden='true'>&rarr;</span>
          </Link>
          </div>
        ) : null}
      </div>


            <div className='relative'>
            {sortedProducts?.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <h3 className='font-semibold text-2xl'>
                  this section is empty for now !
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
              sm:grid-cols-1
              gap-y-10
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4'>

            {sortedProducts?.slice(currentPage - 1, currentPage + 3).map((product, index) => (
              <ProductListing
                user={user!}
                key={`product-${index}`}
                product={product}
                index={index+1}
              />
            ))} 

          </div>


          <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious className="cursor-pointer" onClick={handlePrevPage} />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext className="cursor-pointer" onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        </>
            )}


      </div>
    </section>
  )


  
}




export default ProductReel