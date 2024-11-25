/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import { Product } from '@prisma/client'
import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/db'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import NewReleased from './FollowedStores'
import { fetchBestSellingProducts, fetchNewProducts, getAllProductsCategories, getAllProductCollectionNames, getFollowedStoreProductsFirst, getUser } from '@/actions/actions'
import FollowedStores from './FollowedStores'

import { error } from 'console';
import { auth } from '@/auth';
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
import { Frown, OctagonAlert } from 'lucide-react';




export default async function Page() {
  const user = await getUser()
  const followedStoresProducts = user ? await getFollowedStoreProductsFirst(user.id) : [];
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()

  if(!user) {
    return (
      <AlertDialog open={true} >
      <AlertDialogContent>
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-red-500 mb-2">
              <OctagonAlert className=''/>
          </div>
          <AlertDialogTitle className="text-xl font-bold text-center">
              No User found ! 
          </AlertDialogTitle>
          <AlertDialogDescription>
              Log In to view this page !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link  href="/auth/sign-in" ><Button variant="link">
            Log In
              </Button>
              </Link>
          </AlertDialogFooter>
      </AlertDialogContent>
  </AlertDialog>
    )
  }
  
  return (
    <>

          {/* best selling section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <FollowedStores
                     user={user!}
                     products={followedStoresProducts!}
                     categories={categories!}
                     collections={collections}

                />
                </div>
              </section>
          


    </>
  )
}

