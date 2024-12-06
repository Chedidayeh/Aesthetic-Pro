import {
  Button,
} from '@/components/ui/button'
import Link from 'next/link'
import {  getAllProductsCategories, getAllProductCollectionNames, getUser } from '@/actions/actions'
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
import {  OctagonAlert } from 'lucide-react';
import { fetchPriceRanges, getFollowedStoreProductsFirst } from './actions'




export default async function Page() {
  const user = await getUser()
  const limit = 4; // Number of products per page
  const page = 1; // Initial page
  const priceRanges = await fetchPriceRanges(user?.id ?? "")
  const { products, totalCount }  = await getFollowedStoreProductsFirst(user!.id , page ,limit);
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
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <FollowedStores
                    initialProducts={products}
                    totalCount={totalCount}
                    initialPage={page}
                    limit={limit}
                    priceRanges={priceRanges}
                     user={user!}
                     categories={categories!}
                     collections={collections}

                />
                </div>
              </section>
          


    </>
  )
}

