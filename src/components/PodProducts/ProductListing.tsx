'use client'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NextImage from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'
import { Product, Store, User, UserType } from '@prisma/client'
import ImageSlider from './ImageSlider'
import { Badge } from "../ui/badge"
import { Label } from "@radix-ui/react-label"
import { Heart, Loader2, ShoppingBag } from "lucide-react"
import { buttonVariants } from "../ui/button"
import { auth } from "@/auth"
import { useToast } from "../ui/use-toast"
import classNames from 'classnames';
import session from "redux-persist/lib/storage/session"
import { addProductToFavList, checkProductInFavList, removeProductFromFavList } from "@/actions/actions"
import { useRouter } from "next/navigation"
import LoginModal from "../LoginModal"
import clsx from "clsx"

interface Productswithstore extends Product {
  store : Store
}
interface ProductListingProps {
  user:User
  product: Productswithstore
  index: number
}

const ProductListing = ({
  user,
  product,
  index,
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isFavSaved, setIsFavSaved] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const alertDialogTriggerRef = useRef<HTMLButtonElement>(null)

    // Interleave the arrays
    function interleaveArrays(arr1 : string[], arr2 : string[]) {
      const maxLength = Math.max(arr1.length, arr2.length);
      const result = [];
  
      for (let i = 0; i < maxLength; i++) {
        if (i < arr1.length) {
          result.push(arr1[i]);
        }
        if (i < arr2.length) {
          result.push(arr2[i]);
        }
      }
  
      return result;
    }

  const combinedUrls = interleaveArrays(
    product.croppedFrontProduct || [],
    product.croppedBackProduct || []
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    if (combinedUrls.length > 0) {
      const intervalId = setInterval(() => {
        setFade(true)
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % combinedUrls.length)
          setFade(false)
        }, 500) // Duration of fade out
      }, 4000) // Change image every 3 seconds

      return () => clearInterval(intervalId)
    }
  }, [combinedUrls])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 475)
    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    const checkFavStatus = async () => {
      try {
        const isProductSaved = await checkProductInFavList(product.id, user.id)
        setIsFavSaved(isProductSaved)
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }
    checkFavStatus()
  }, [product.id, user?.id])

  const saveToFavList = useCallback(async () => {
    try {
      if (!user) {
        toast({
          title: 'No logged in user found!',
          description: 'Try to login first!',
          variant: 'destructive',
        })
        return
      }

      let result
      if (!isFavSaved) {
        result = await addProductToFavList(product.id, user.id)
        if (result) {
          setIsFavSaved(true)
          toast({
            title: 'Product added to fav list!',
            variant: 'default',
          })
        }
      } else {
        result = await removeProductFromFavList(product.id, user.id)
        if (result) {
          setIsFavSaved(false)
          toast({
            title: 'Product removed from fav list!',
            variant: 'default',
          })
        }
      }
      router.refresh()
    } catch (error) {
      console.error('Error saving product to Fav list:', error)
      toast({
        title: 'Error saving product to Fav list!',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }, [isFavSaved, product.id,user, router, toast])

  const openDialog = useCallback(() => {
    alertDialogTriggerRef.current?.click()
  }, [])



  if (!product || !isVisible) return <ProductPlaceholder />

  if (isVisible && product) {
    return (

      <>

                           {/* The AlertDialog component */}
                           <AlertDialog>
                          <AlertDialogTrigger asChild ref={alertDialogTriggerRef}>
                            <button className="hidden">Hidden Trigger</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
                                Loading your product!
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                <Loader2 className="text-blue-700 h-[50%] w-[50%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>  
      
      
 <Card>
      <div className="mx-2 my-2">
      <div className="mb-2 mt-0 flex items-center"> {/* Added flex container */}
  <div className="flex-grow"> {/* Added flex-grow to take remaining space */}
    <Badge variant="secondary">
      <Link href={`/PodProducts/store/${product.store.storeName}`} className=" animate-pulse font-bold group text-xs hover:text-blue-500 cursor-pointer relative block">
        {product.store.storeName}
        <span className="absolute font-normal bottom-5 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          View store
        </span>
      </Link>
    </Badge>
  </div>
  {product.topSales && (
  <div className="ml-2"> {/* Added margin for separation */}
  <Badge variant="outline" className="bg-emerald-700 text-white">Best sell</Badge>
</div>
  )}
  {product.NewProduct && (
    <>
  <div className="ml-2"> {/* Added margin for separation */}
  <Badge variant="outline" className="bg-blue-700 text-white">New</Badge>
</div>

</>
  )}
    {product.isDiscountEnabled && (
    <>
  <div className="ml-2"> {/* Added margin for separation */}
  <Badge variant="outline" className="bg-red-700 text-white">{product.discount}% OFF</Badge>
</div>
</>
  )}
</div>

        <Link
        onClick={openDialog}
        className={cn(
          'invisible  cursor-pointer group/main',
          {
            'visible animate-in fade-in-5': isVisible,
          }
        )}
        href={`/PodProducts/product/${product.id}`}>
    <div className="border-2 overflow-hidden rounded-2xl">
    {combinedUrls.length > 0 && (
        <>
          <NextImage
            src={`/api/getImage?imageUrl=${encodeURIComponent(combinedUrls[currentIndex])}`}
            alt="Product Image"
            loading="lazy"
            width={1000}
            height={1000}
            placeholder="blur"
            blurDataURL="/Loading.png"
            className={clsx("transition-all duration-700 hover:scale-150", {
              'opacity-0': fade ,
              'opacity-100': !fade ,
            })}
            style={{ transitionProperty: 'opacity, transform' }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </>
      )}
    </div>
        </Link>

        <div className="flex mt-2 ml-3 items-center justify-between">
    <div>
        <Label>{product.title}</Label>
        <p className="text-sm text-gray-600">{product.category}</p>
    </div>
        {/* add to fav list icon */}
    <div onClick={saveToFavList} className="relative group rounded-full p-2  text-gray-600 cursor-pointer ">
        <Heart className={`${isFavSaved ? 'text-red-600 fill-current' : 'text-gray-600 hover:text-red-600'}`} />
        <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        {isFavSaved ? 'Saved!' : 'Save in fav list'}
        </span>
    </div>
    
    </div>


      <div className="mt-1 flex items-center justify-between">
        <div className="ml-2">
        <div className="flex space-x-4">
          {product.isDiscountEnabled && (
          <div className="font-bold rounded-xl text-gray-400 text-md line-through">
            {(product.oldPrice ?? product.price  ).toFixed(2)} TND
          </div>
             )}
        <div className={`font-bold rounded-xl text-blue-600 text-md ${product.isDiscountEnabled ? 'animate-wiggle' : ''}`}>
        {(product.price).toFixed(2)} TND
          </div>
        </div>
        </div>
        {/* add to cart list icon */}
        <Link onClick={openDialog} href={`/PodProducts/product/${product.id}`}>
        <div className="relative group rounded-full p-2  text-gray-600 cursor-pointer ">
          <ShoppingBag className='text-gray-600 hover:text-blue-600' />
          <span className="absolute bottom-4 right-2 transform -translate-x-1/2 w-max px-2 py-1 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Add to cart
          </span>
          </div> 
        </Link>
      </div>    
        </div>
    </Card>
             
    </>
      

    )
  }
}

const ProductPlaceholder = () => {
  return (
    <div className='flex flex-col'>
      <div className='rounded-2xl mb-2 mt-4'>
        <Skeleton className='h-4 w-20' />
      </div>
      <div className=' overflow-hidden rounded-2xl'>
        <Skeleton className='h-[340px] w-[275px]' />
      </div>
      <div className='mx-3'>
        <Skeleton className='h-4 w-36 mt-3' />
        <Skeleton className='h-4 w-24 mt-2' />
      </div>
      <div className='ml-2'>
        <Skeleton className='h-6 w-20 mt-4' />
      </div>
    </div>
  )
}

export default ProductListing
