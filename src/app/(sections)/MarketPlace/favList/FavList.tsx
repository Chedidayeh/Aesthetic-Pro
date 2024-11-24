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
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface Productswithstore extends Product {
  store : Store
}

interface ProductReelProps {
  products? : Productswithstore[]
  user : User
  categories : string[]
  collections : string[]

}
const FavList = ({ products, user , categories , collections }: ProductReelProps) => {


  // Sorting function based on sortBy criteria
  const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option
  const [sortByCategory, setSortByCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [filterByCollection, setFilterByCollection] = useState<string>("");

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


  const sortedProducts = useMemo(() => {
    return [...(products || [])].sort((a, b) => {    switch (sortBy) {
      case 'low':
        return a.price - b.price;
        case 'high':
        return b.price - a.price;
      case 'sales':
        return b.totalSales - a.totalSales; 
      default:
        return 0
    }
  });
}, [products, sortBy]);


  // Memoize the filtered products to avoid unnecessary computations
  const filteredProducts = useMemo(() => {
    let result = sortedProducts;
  
    if (sortByCategory) {
      result = result.filter((product) =>
        product.category.toLowerCase().includes(sortByCategory.toLowerCase())
      );
    }
    if (priceRange[0] !== 0 && priceRange[1] !== 0) { // Apply price range filter only if slider is interacted with
      result = result.filter((product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }
    if (filterByCollection) {
      result = result.filter((product) =>
        product.collection.toLowerCase().includes(filterByCollection.toLowerCase())
      );
    }

    return result;
  }, [sortedProducts, sortByCategory, priceRange, filterByCollection]);

  const handleSortChange = (event: string) => {
    setSortBy(event); 
    setCurrentPage(1); // Reset to first page on sort change

  };


  const handleCategorySortChange = (event: string) => {
    setSortByCategory(event);
    setCurrentPage(1); // Reset to first page on sort change

  };
  const handleCollectionSortChange = (event: string) => {
    setFilterByCollection(event);
    setCurrentPage(1); // Reset to first page on sort change

  };
  const handlePriceRangeChange = (value: string) => {
    const rangeIndex = parseInt(value, 10);
    setPriceRange(priceRanges[rangeIndex]);
    setCurrentPage(1); // Reset to first page on price range change
  };


        // Pagination 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 16; // Display products per page

    const paginatedProducts = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);
  
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    const renderPaginationItems = () => {
      const paginationItems = [];

      // Less than or equal to 10 pages
      if (totalPages <= 2) {
        for (let i = 1; i <= totalPages; i++) {
          paginationItems.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i);
                }}
                isActive={currentPage === i}
                style={{ cursor: 'pointer' }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } 

      // More than 10 pages:
      else {

          // Start ellipsis logic
        if (currentPage > 3) {
          paginationItems.push(
            <PaginationItem key={1}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
                style={{ cursor: 'pointer' }}
              >
                1
              </PaginationLink>
            </PaginationItem>,
            <PaginationEllipsis key="start-ellipsis" />
          );
        }


    // Middle pages logic
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
                isActive={currentPage === i}
                style={{ cursor: 'pointer' }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }


    // End ellipsis logic
        if (currentPage < totalPages - 2) {
          paginationItems.push(
            <PaginationEllipsis key="end-ellipsis" />,
            <PaginationItem key={totalPages}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
                style={{ cursor: 'pointer' }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
  
      return paginationItems;
    };

  return (
    <section className='py-4'>
     
     <div className='bg-muted/50 rounded-xl py-10 mx-auto text-center flex flex-col items-center max-w-1xl'>
          <h1 className='text-4xl font-bold tracking-tight  sm:text-5xl'>
            Your{' '}
            <span className='text-blue-600'>
            FavList
            </span>
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
              Enjoy shopping
            </p> 


            <div className="flex flex-col">
            <div className="flex flex-col gap-2 md:flex-row">
            <div className="mt-3 flex-1">
        <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
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
    Total Products found: {paginatedProducts.length}
  </div>

            </div>

              
            </div>

            <div className='relative my-4'>

            {paginatedProducts.length === 0 ? (
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
                  Your FavList is empty
                </h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Nothing to show here yet.
                </p>
                <Link href="/MarketPlace" className='text-blue-600 text-sm'>
                Add items to your FavList
                </Link>
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

            {paginatedProducts?.map((product, index) => (
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
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'disabled' : ''}
                  aria-disabled={currentPage === 1}
                  style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'disabled' : ''}
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




export default FavList