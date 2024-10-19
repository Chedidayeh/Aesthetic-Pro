/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// Indicates this file is a client-side component in Next.js

"use client"
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {  ChangeEvent, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {  CircleCheck, CircleDollarSign, CreditCard, DollarSign, Eye, EyeIcon, Heart, Loader2, OctagonAlert, PenTool, SquarePen, Tags, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
import { Collection, Platform, Product, Store, User } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import ImageSlider from "@/components/PodProducts/ImageSlider";
import LoadingState from "@/components/LoadingState";
import { Separator } from "@/components/ui/separator"
import axios from 'axios';
import { generateShortAffiliateLink } from "./actions"
interface Productswithstore extends Product {
  store : Store
}

interface ProductReelProps {
  products? : Productswithstore[]
  user : User
  affiliateId : string
  categories : string[]
  collections : string[]
  platform : Platform

}

const ProductView = ({ products, user , affiliateId, categories , collections , platform }: ProductReelProps) => {

        const router = useRouter();
        const { toast } = useToast()

          // Sorting function based on sortBy criteria
        const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option
        const [sortByCategory, setSortByCategory] = useState<string>("");
        const [filterByCollection, setFilterByCollection] = useState<string>("");
        
        // serach and sort filter
        const [searchQuery, setSearchQuery] = useState('');
        // affiliateLink state
        const [selectedProduct, setSelectedProduct] = useState<Product>();
        const [open, setOpen] = useState<boolean>(false);
        const [openWindow, setOpenWindow] = useState(false);
        const [shortenedLink, setShortenedLink] = useState<string | null>(null);


        const handleGenerateAffiliateLink = async (product: Product) => {
          setOpen(true)
          const originalAffiliateLink = generateAffiliateLink(product.id);
          const shortLink = await generateShortAffiliateLink(platform,originalAffiliateLink,product.id, affiliateId);
          if(shortLink){
            setShortenedLink(shortLink)
            // Display the affiliate link to the user
            setOpen(false)
            toast({
              title: "Affiliate Link Generated",
              variant: "default",
            });
            setOpenWindow(true)
          }else {
            setOpen(false)
            toast({
              title: "You already created a link for that product !",
              description : "View Manage Links Page",
              variant: "destructive",
              });
          }

        };


        const generateAffiliateLink = (productId: string ): string => {
          return `${window.location.origin}/PodProducts/product/${productId}`;
        };





        const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); 
        };

        const handleSortChange = (e: string) => {
          setSortBy(e);
          setCurrentPage(1); 
        };


        const handleCategorySortChange = (event: string) => {
          setSortByCategory(event);
          setCurrentPage(1); 
      
        };
        const handleCollectionSortChange = (event: string) => {
          setFilterByCollection(event);
          setCurrentPage(1); 

        };


        const filteredAndSortedProducts = useMemo(() => {
          // Step 1: Filter products based on search query
          let filteredProducts = products?.filter((design) => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const lowerCaseName = design.title.toLowerCase();
            const tagsMatch = design.tags && design.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
            return lowerCaseName.includes(lowerCaseQuery) || (design.tags && tagsMatch);
          });
        
          // Step 2: Sort products based on the selected sort option
          filteredProducts = [...(filteredProducts || [])].sort((a, b) => {
            switch (sortBy) {
              case 'low':
                return a.price - b.price;
              case 'high':
                return b.price - a.price;
              case 'sales':
                return b.totalSales - a.totalSales;
              case 'views':
                return b.totalViews - a.totalViews;
              default:
                return 0;
            }
          });
        
          // Step 3: Apply category filter
          if (sortByCategory) {
            filteredProducts = filteredProducts.filter((product) =>
              product.category.toLowerCase().includes(sortByCategory.toLowerCase())
            );
          }
        
        
          // Step 5: Apply collection filter
          if (filterByCollection) {
            filteredProducts = filteredProducts.filter((product) =>
              product.collection.toLowerCase().includes(filterByCollection.toLowerCase())
            );
          }
        
          return filteredProducts;
        }, [products, searchQuery, sortBy, sortByCategory, filterByCollection]);
        
        



                const [productImgs , setproductImgs] = useState <string[]> ([])
                const viewProduct = (product : Product) => {
                  let imgs = [] as string []
                  product.croppedFrontProduct.map((img : string) => {
                    imgs.push(img)
                  })
                  product.croppedBackProduct.map((img : string) => {
                    imgs.push(img)
                  })
                  setproductImgs(imgs)
                }
            

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
     





             // Pagination 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3; // Display products per page

    const paginatedProducts = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredAndSortedProducts.slice(start, start + itemsPerPage);
    }, [filteredAndSortedProducts, currentPage, itemsPerPage]);
  
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  
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




    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(shortenedLink!)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error('Failed to copy the text: ', err);
        });
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



  <p className="text-sm text-gray-700 mb-2">AffiliateDashboard/All Products</p>
  <h1 className="text-2xl font-semibold mb-8">All Products</h1>


  <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-4 sm:px-7">
  <CardDescription>Total Products: {products?.length}</CardDescription>
    <div className="ml-0 sm:ml-5 mt-2">
    <div className="flex flex-col gap-2 md:flex-row">
    <div className="mt-3 flex-1">
        {/* Sorting select */}
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="sales">Most Selled</SelectItem>
              <SelectItem value="high">Highest Price</SelectItem>
              <SelectItem value="low">Lowest Price</SelectItem>              
              <SelectItem value="views">Views</SelectItem>

            </SelectGroup>
          </SelectContent>
        </Select>
        </div>

        <div className="mt-3 flex-1">
            <Select onValueChange={handleCategorySortChange}>
            <SelectTrigger className="w-full">
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
                    <SelectTrigger className="w-full ">
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
        <Input
          type="search"
          className="w-full "
          placeholder="Search for your products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        </div>
      </div>
      <p className="text-gray-600 mt-4 text-sm">
        <span className="text-blue-600 font-medium">Guide :</span> Select the product you want to affiliate !
      </p>
    </div>
  </CardHeader>
  <hr className="border-t border-gray-300 mb-5" />
  <CardContent>
    {products?.length === 0 && (
      <>
        <h1 className="text-center text-3xl font-bold col-span-full">There is No Products for now!</h1>
      </>
    )}

    {filteredAndSortedProducts?.length === 0 && products?.length !== 0 ? (
      <>
        <h1 className="text-center text-3xl font-bold col-span-full">
          No Products found !
        </h1>
      </>
    ) : (
      <>
        <div className="relative mt-5 grid grid-cols-1 mb-20 pb-20">
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
            {/* Product Cards */}
            {paginatedProducts?.map((product, index) => (
                        <div
                        key={index}
                        className={`relative aspect-square border-2 rounded-xl ${
                          selectedProduct?.id === product.id ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >                      
                      <ImageSlider
                        urls={[
                          ...(product.croppedFrontProduct ?? []),
                          ...(product.croppedBackProduct ?? []),
                        ]}
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 z-10 rounded">
                      <Badge 
                       onClick={() => {
                       setSelectedProduct(product)
                      }}
                      className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white px-2 py-1 rounded">
                            Select this Product
                      </Badge>
                      </div>
                      
                      <div className="absolute top-10 right-2 px-2 py-1 z-10 rounded">
                      <Badge 
                       onClick={() => {
                       setIsDownloadOpen(true);
                       viewProduct(product);
                       downloadMockup(productImgs);
                      }}
                      className="bg-purple-500 hover:bg-purple-400 cursor-pointer text-white px-2 py-1 rounded">
                            Download Product
                      </Badge>
                      </div>


                      <div className="absolute top-2 left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <CircleDollarSign className="mr-2 h-4 w-4 text-green-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.price} TND</span>
                        </Badge>
                      </div>

                      <div className="absolute top-8 left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <Eye className="mr-2 h-4 w-4 text-blue-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.totalViews} views</span>
                        </Badge>
                      </div>

                      <div className="absolute top-14  left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <CreditCard className="mr-2 h-4 w-4 text-red-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.totalSales} sales</span>
                         </Badge>
                      </div>

                      <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                          {product.title}
                        </Badge>
                      </div>
                    </div>

            ))}
          </div>
        </div>
        
        {paginatedProducts?.length! >0 && (
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
          )}
      </>
    )}
  </CardContent>
</Card>



      {selectedProduct && (
        <>

<Card className="col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-col md:flex-row items-center">
    <div className="grid gap-2">
      <CardTitle className="font-bold">Product Infos :</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-2">
          <div>
            <p className="font-bold">Product Title :</p>
            <p >{selectedProduct.title}</p>
          </div>
          <div>
            <p className="font-bold">Product Price :</p>
            <p>
              <Badge className="text-bold text-white" >
                {selectedProduct.price} TND
              </Badge>
            </p>
          </div>

          <div>
            <p className="font-bold">Product total sales :</p>
            <p>{selectedProduct.totalSales} sales</p>
          </div>

          <div>
            <p className="font-bold">Product total views :</p>
            <p>{selectedProduct.totalViews} views</p>
          </div>

          <div className="col-span-2 md:col-span-1">
          <Button 
           onClick={() => handleGenerateAffiliateLink(selectedProduct)}
            variant="link" className="text-green-500 flex items-center">
          Generate Affiliate Link
            <CircleDollarSign size={16} className="ml-1 mt-[2px]" />
          </Button>
          </div>



        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent className="p-4 md:p-6 lg:p-8 max-w-full">
  <p className=" flex items-center justify-center font-bold my-4">View Product :</p>
  <div className="flex items-center justify-center w-full p-4">
    <div className="w-full max-w-lg"> {/* You can adjust max-w-lg as per your desired size */}
      <ImageSlider
        urls={[
          ...(selectedProduct.croppedFrontProduct ?? []),
          ...(selectedProduct.croppedBackProduct ?? []),
        ]}
      />
    </div>
  </div>
</CardContent>

</Card>
        
        </>
     
        )}



<AlertDialog open={openWindow}>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-col items-center">
              <div className="text-green-500 mb-2">
                <CircleCheck size={42} />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-center">
                Here's your product special link !
              </AlertDialogTitle>
              <AlertDialogDescription>
                Share this link and gain profits through every sale made :
                <p className="text-xs">
                  click to copy the link !
                </p>
            <div 
              onClick={copyToClipboard} 
              className="mt-2 text-blue-500 font-bold cursor-pointer hover:text-blue-300 transition-colors"
              aria-label="Click to copy affiliate link"
            >                  
            {shortenedLink}
                </div>
                {isCopied && (
              <p className="text-xs text-green-500 mt-2">Link copied to clipboard!</p>
            )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
              onClick={()=>setOpenWindow(false)}
                className='bg-blue-500 hover:bg-blue-300'
              >
                Done
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

<LoadingState isOpen={open} />


                            </>
  
  );
};

export  default ProductView ;

