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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Product, Store, User } from '@prisma/client'
import { useState } from "react"
import ProductListing from "@/components/MarketPlace/ProductListing"
import { getFollowedStoreProductsFirst } from './actions'
import LoadingState from '@/components/LoadingState'

interface Productswithstore extends Product {
  store : Store
}
interface ProductReelProps {
  initialProducts : Productswithstore[]
  totalCount : number
  initialPage:number
  limit:number
  priceRanges : [number, number][]
  user : User
  categories : string[]
  collections : string[]

}

const FollowedStores = ({ initialProducts,totalCount,initialPage, limit, priceRanges, user , categories , collections}: ProductReelProps) => {

  const [products, setProducts] = useState(initialProducts);
  const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option
  const [filterByCategory, setFilterByCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [filterByCollection, setFilterByCollection] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(initialPage);  
  // totalCount state
  const [totalCountState, setTotalCountState] = useState(totalCount);

  const [open, setOpen] = useState<boolean>(false);

  
  const handleSortChange = async (event: string) => {
    setOpen(true)
    setCurrentPage(1); // Reset to first page on sort change
    setSortBy(event);
    const { products , totalCount } = await getFollowedStoreProductsFirst(user.id,1, limit, event, filterByCategory, filterByCollection, priceRange);
    setProducts(products);
    setTotalCountState(totalCount)
    setOpen(false)
  };
  
  const handleCategorySortChange = async (event: string) => {
    setOpen(true)
    setCurrentPage(1); // Reset to first page on category change
    setFilterByCategory(event);
    const { products , totalCount} = await getFollowedStoreProductsFirst(user.id,1, limit, sortBy, event, filterByCollection, priceRange);
    setProducts(products);
    setTotalCountState(totalCount)
    setOpen(false)


  };
  
  const handleCollectionSortChange = async (event: string) => {
    setOpen(true)
    setCurrentPage(1); // Reset to first page on collection change
    setFilterByCollection(event);
    const { products , totalCount} = await getFollowedStoreProductsFirst(user.id,1, limit, sortBy, filterByCategory, event, priceRange);
    setProducts(products);
    setTotalCountState(totalCount)
    setOpen(false)


  };
  
  const handlePriceRangeChange = async (value: string) => {
    setOpen(true)
    const rangeIndex = parseInt(value, 10);
    setPriceRange(priceRanges[rangeIndex]);
    setCurrentPage(1); // Reset to first page on price range change
    const { products, totalCount } = await getFollowedStoreProductsFirst(user.id,1, limit, sortBy, filterByCategory, filterByCollection, priceRanges[rangeIndex]);
    setProducts(products);
    setTotalCountState(totalCount)
    setOpen(false)


  };
  





  const handlePageChange = async (page: number) => {
    setOpen(true)
    if (page >= 1 && page <= totalPages) {
      const { products , totalCount} = await getFollowedStoreProductsFirst(user.id,page, limit, sortBy, filterByCategory, filterByCollection, priceRange);
      setProducts(products);
      setCurrentPage(page);
      setTotalCountState(totalCount)
      setOpen(false)

    }
  };

  const totalPages = Math.ceil(totalCountState / limit)


  const renderPaginationItems = () => {
    const paginationItems = [];
  
    // If total pages are 10 or less, render all pages
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i} // Include isActive prop here
              style={{ cursor: 'pointer' }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show the first page
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={currentPage === 1} // Include isActive prop here
            style={{ cursor: 'pointer' }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
  
      // Add start ellipsis if necessary
      if (currentPage > 4) {
        paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
      }
  
      // Render middle pages
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);
  
      for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i} // Include isActive prop here
              style={{ cursor: 'pointer' }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
  
      // Add end ellipsis if necessary
      if (currentPage < totalPages - 3) {
        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
      }
  
      // Always show the last page
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages} // Include isActive prop here
            style={{ cursor: 'pointer' }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    return paginationItems;
  };

  



  return (
    <section className='py-4'>
     
     <div className='bg-muted/50 rounded-xl py-10 mx-auto text-center flex flex-col items-center max-w-1xl'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          Products from stores {' '}
            <span className='text-red-500'>
            you follow
            </span>
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
          Check out the latest products from your favorite stores!
            </p>

            <div className="flex flex-col">

            <div className="flex flex-col gap-2 md:flex-row">
            <div className="mt-3 flex-1">
        <Select onValueChange={handleSortChange}>
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
            <Select onValueChange={handleCategorySortChange}>
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
                <Select onValueChange={handleCollectionSortChange}>
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
    <Select onValueChange={handlePriceRangeChange}>
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

  <div className="mt-4 text-gray-600 text-sm flex-1">
    <div className="mt-4"> {priceRange[0] === 0 && priceRange[1] === 0
      ? 'Select a price range'
      : `${priceRange[0]} TND - ${priceRange[1]} TND`}</div>
    </div>
  <div className="mt-3 text-gray-600 text-sm">
    Products found: {totalCountState}
  </div>

  <div className="mt-3 text-gray-500 text-sm">
    Current Page : {currentPage}
  </div>
            
            </div>

              
            </div>

            <div className='relative my-4'>

            {products.length === 0 ? (
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
                This section is empty for now !
              </h3>
              <p className='text-muted-foreground text-center'>
                Whoops! Nothing to show here yet.
              </p>
            </div>
            ) : (
              <>

<LoadingState isOpen={open} />


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


          <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
              <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    if (currentPage === 1) {
                      e.preventDefault(); // Block interaction if disabled
                      return;
                    }
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                  aria-disabled={currentPage === 1}
                  style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    if (currentPage === totalPages) {
                      e.preventDefault(); // Block interaction if disabled
                      return;
                    }
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                  aria-disabled={currentPage === totalPages}
                  style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                />
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




export default FollowedStores