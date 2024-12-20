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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {  ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import {  CircleCheck, CircleDollarSign, CreditCard, Eye, Loader, Search, Shirt } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
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
 
import { useRouter } from 'next/navigation';
import { Platform, Product, Store, User } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import ImageSlider from "@/components/MarketPlace/ImageSlider";
import LoadingState from "@/components/LoadingState";
import { Separator } from "@/components/ui/separator"
import { fetchAllProducts, generateShortAffiliateLink } from "./actions"
interface Productswithstore extends Product {
  store : Store
}

interface ProductReelProps {
  initialProducts : Productswithstore[]
  totalCount : number
  initialPage:number
  limit:number
  user : User
  affiliateId : string
  categories : string[]
  collections : string[]
  platform : Platform

}

const ProductView = ({ initialProducts,totalCount,initialPage, limit, user , affiliateId, categories , collections , platform }: ProductReelProps) => {

        const router = useRouter();
        const { toast } = useToast()

        const [products, setProducts] = useState(initialProducts);
        const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option
        const [filterByCategory, setFilterByCategory] = useState<string>("");
        const [filterByCollection, setFilterByCollection] = useState<string>("");
        const [currentPage, setCurrentPage] = useState(initialPage);  
        // totalCount state
        const [totalCountState, setTotalCountState] = useState(totalCount);
      
        const [open, setOpen] = useState<boolean>(false);
        
        // serach and sort filter
        const [searchQuery, setSearchQuery] = useState('');
        // affiliateLink state
        const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
        const [selectedProduct, setSelectedProduct] = useState<Productswithstore | null>();
        const [openWindow, setOpenWindow] = useState(false);
        const [shortenedLink, setShortenedLink] = useState<string | null>(null);


        const productDetailsRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
          if (selectedProduct && productDetailsRef.current) {
              productDetailsRef.current!.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // Try 'start' or 'center' depending on your needs
                inline: 'nearest', // Try 'center', 'start', or 'nearest' depending on your needs
              });
          }
        }, [selectedProduct , productDetailsRef]);



        const handleGenerateAffiliateLink = async (product: Product) => {
          try {
            setOpen(true);
            
            const originalAffiliateLink = generateAffiliateLink(product.id);
            
            const shortLink = await generateShortAffiliateLink(platform, originalAffiliateLink, product.id, affiliateId);
            
            if (shortLink) {
              setShortenedLink(shortLink);
              // Display the affiliate link to the user
              setOpen(false);
              toast({
                title: "Affiliate Link Generated",
                variant: "default",
              });
              setOpenWindow(true);
            } else {
              setOpen(false);
              toast({
                title: "You already created a link for that product!",
                description: "View Manage Links Page",
                variant: "destructive",
              });
            }
          } catch (error) {
            setOpen(false);
            console.error("Error generating affiliate link:", error);
            toast({
              title: "Error generating affiliate link",
              description: "Please try again later.",
              variant: "destructive",
            });
          }
        };
        


        const generateAffiliateLink = (productId: string ): string => {
          return `${window.location.origin}/MarketPlace/product/${productId}`;
        };



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




    const handleProductClick = (index: number) => {
      if (index === selectedProductIndex) {
        setSelectedProductIndex(null);
        setSelectedProduct(null);
      } else {
        setSelectedProductIndex(index);
        setSelectedProduct(products[index] || null);
      }
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

    const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
      try {
        setOpen(true);
        setCurrentPage(1);
        const { products, totalCount } = await fetchAllProducts(1, limit, sortBy, filterByCategory, filterByCollection, searchQuery);
        setProducts(products);
        setTotalCountState(totalCount);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    

    const handleSortChange = async (event: string) => {
      try {
        setOpen(true);
        setCurrentPage(1); // Reset to first page on sort change
        setSortBy(event);
        const { products, totalCount } = await fetchAllProducts(1, limit, event, filterByCategory, filterByCollection, searchQuery);
        setProducts(products);
        setTotalCountState(totalCount);
      } catch (error) {
        console.error("Error sorting products:", error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    
    
    const handleCategorySortChange = async (event: string) => {
      try {
        setOpen(true);
        setCurrentPage(1); // Reset to first page on category change
        setFilterByCategory(event);
        const { products, totalCount } = await fetchAllProducts(1, limit, sortBy, event, filterByCollection, searchQuery);
        setProducts(products);
        setTotalCountState(totalCount);
      } catch (error) {
        console.error("Error filtering products by category:", error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    
    
    const handleCollectionSortChange = async (event: string) => {
      try {
        setOpen(true);
        setCurrentPage(1); // Reset to first page on collection change
        setFilterByCollection(event);
        const { products, totalCount } = await fetchAllProducts(1, limit, sortBy, filterByCategory, event, searchQuery);
        setProducts(products);
        setTotalCountState(totalCount);
      } catch (error) {
        console.error("Error filtering products by collection:", error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
      }
    };
    
    
    const handlePageChange = async (page: number) => {
      try {
        setOpen(true);
        if (page >= 1 && page <= totalPages) {
          const { products, totalCount } = await fetchAllProducts(page, limit, sortBy, filterByCategory, filterByCollection, searchQuery);
          setProducts(products);
          setCurrentPage(page);
          setTotalCountState(totalCount);
        }
      } catch (error) {
        console.error("Error fetching products for page change:", error);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      } finally {
        setOpen(false);
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

    <>

                                              {/* downloading Loader  */}
                                              <AlertDialog open={isDownloadOpen} >
                                       <AlertDialogTrigger asChild>
                                        </AlertDialogTrigger>
                                          <AlertDialogContent className=" flex flex-col items-center justify-center">
                                              <AlertDialogHeader className="flex flex-col items-center justify-center">
          <Loader className="text-blue-700 h-[30%] w-[30%] animate-spin mt-3" />
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

  {selectedProduct && (
        <>
<Card   ref={productDetailsRef}  // Add the ref to the element you want to scroll to
 className="col-span-full mt-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="">
    <div className="grid gap-2">
      <CardTitle className="font-bold">Product Infos :</CardTitle>
      <CardDescription>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mt-2">
          <div>
            <p className="font-bold">Product Title :</p>
            <p >{selectedProduct.title}</p>
          </div>
          <div>
            <p className="font-bold">Product Price :</p>
            <p>
              <Badge className="text-bold text-white" >
                {selectedProduct.price.toFixed(2)} TND
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

          <div>
            <p className="font-bold">Your Profit : ( {platform.affiliateUserProfit} % )</p>
            <p>{((selectedProduct.price * platform.affiliateUserProfit) / 100).toFixed(2)} TND  ( on every sale )</p>
          </div>

                      <div className="px-2 py-1 z-10 rounded">
                      <Badge 
                       onClick={() => {
                       setIsDownloadOpen(true);
                       viewProduct(selectedProduct);
                       downloadMockup(productImgs);
                      }}
                      className="bg-purple-500 hover:bg-purple-400 cursor-pointer text-white px-2 py-1 rounded">
                            Download Product
                      </Badge>
                      </div>

          <Button 
           onClick={() => handleGenerateAffiliateLink(selectedProduct)}
            variant="link" className="text-green-500 animate-wiggle">
          Generate Affiliate Link
            <CircleDollarSign size={16} className="ml-1 mt-[2px]" />
          </Button>



        </div>
      </CardDescription>
    </div>
  </CardHeader>
  <Separator className="w-full" />
  <CardContent className="p-4 md:p-6 lg:p-8 max-w-full">
  <p className=" flex items-center justify-center font-bold my-4">View Product :</p>
  <div className="flex items-center justify-center p-4">
    <div className="w-full max-w-xs md:max-w-lg"
        >
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



  <Card className="col-span-full my-4" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="px-4 sm:px-7">
  <CardDescription>Total Products: {totalCount}</CardDescription>
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

                <div className="mt-3 flex items-center space-x-3">
  <Input
    type="search"
    className="flex-1"
    placeholder="Search for your products..."
    value={searchQuery}
    onChange={handleSearchChange}
  />
  <Button
    disabled={searchQuery === ""}
    onClick={handleSearch}
    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
  >
    Search
    <Search size={14} className="ml-1" />
  </Button>
</div>

      </div>
      <p className="text-gray-600 mt-4 text-sm">
        <span className="text-blue-600 font-medium">Guide :</span> Select the product you want to affiliate !
      </p>
      <p className="text-gray-600 mt-4 text-sm">
        Products Found : {totalCountState}
      </p>

      <div className="mt-3 text-gray-500 text-sm">
    Current Page : {currentPage}
  </div>

    </div>
  </CardHeader>
  <hr className="border-t border-gray-300 mb-5" />
  <CardContent>
    {totalCount === 0 && (
      <>
        <h1 className="text-center text-3xl font-bold col-span-full">There is No Products for now!</h1>
      </>
    )}

    {totalCountState === 0 ? (
      <>
        <h1 className="text-center text-3xl font-bold col-span-full">
          No Products found !
        </h1>
      </>
    ) : (
      <>
        <div className="relative mt-5 grid grid-cols-1 mb-20 pb-20">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2">
            {/* Product Cards */}
            {products?.map((product, index) => (
                        <div
                        key={index}
                        className={`relative cursor-pointer aspect-square border-2 rounded-xl ${
                          selectedProduct?.id === product.id ? 'border-blue-500' : 'border-transparent'
                        }`}
                        onClick={() => {            
                          setSelectedProduct(product)
                          handleProductClick(index)
                         }}
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
                    


                      <div className="absolute top-2 left-2 px-2 py-1 z-10 rounded">
                        <Badge variant="secondary" className="bg-gray-200">
                          <CircleDollarSign className="mr-2 h-4 w-4 text-green-800 opacity-70" />
                          <span className="text-xs text-gray-600">{product.price.toFixed(2)} TND</span>
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
        
        {totalCountState >0 && (
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
          )}
      </>
    )}
  </CardContent>
</Card>




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
                <p className="text-xs mt-4">
                  click to copy the link !
                </p>
            <Badge 
              onClick={copyToClipboard} 
              className="my-6 text-white text-sm animate-pulse font-bold cursor-pointer transition-colors"
              aria-label="Click to copy affiliate link"
            >                  
            {shortenedLink}
                </Badge>
                {isCopied && (
              <p className="text-xs text-green-500">Link copied to clipboard!</p>
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

