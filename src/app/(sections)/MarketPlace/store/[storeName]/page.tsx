/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Button,
} from '@/components/ui/button'
import {
  OctagonAlert,
} from 'lucide-react'
import Link from 'next/link'
import {  getAllProductsCategories, getAllProductCollectionNames, getUser } from '@/actions/actions'
import StoreView from './StoreView'
import {  checkIfUserFollowsStore, fetchPriceRanges, getDesignsByStoreId, getStoreByStoreName, getStoreFollowersCount, getStoreProducts, getStoreProductsCount } from './actions'


interface PageProps {
  params: {
    storeName: string
  }
}



export default async function Page({ params }: PageProps) {
  const { storeName } = params
  const limit = 4; // Number of products per page
  const page = 1; // Initial page
  const decodedStoreName = decodeURIComponent(storeName)
  const user = await getUser()
  const store = await getStoreByStoreName(decodedStoreName)
  const storeProductsCount = await getStoreProductsCount (store?.id!)
  const { products, totalCount } = await getStoreProducts(store?.id! , page , limit)  
  const storeDesigns = await getDesignsByStoreId(store?.id ?? "")
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()
  const followersCount = await getStoreFollowersCount(store!.id);
  const follows = await checkIfUserFollowsStore(user?.id ?? "", store!.id);
  const priceRanges = await fetchPriceRanges(store?.id!)

  return (
    <>

          {/* store section */}
          {store ? (

            <>
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <StoreView  
                    initialProducts={products}
                    totalCount={totalCount}
                    initialPage={page}
                    limit={limit}
                    priceRanges={priceRanges}
                     store={store}
                     user={user!}
                     storeProductsCount={storeProductsCount}
                     designs={storeDesigns!}
                     categories={categories}
                     collections={collections}
                     followersCount={followersCount}
                     follows={follows}
                />
                </div>
              </section>

            </>

            ) : (
              <>
                      <AlertDialog open={true} >
    <AlertDialogContent>
    <AlertDialogHeader className="flex flex-col items-center">
        <div className="text-red-500 mb-2">
            <OctagonAlert className=''/>
        </div>
        <AlertDialogTitle className="text-xl font-bold text-center">
            No Store found ! 
        </AlertDialogTitle>
        <AlertDialogDescription>
            Please return to the home page !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link  href="/MarketPlace" ><Button variant="link">
                  Return
                    </Button>
                    </Link>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
              </>
            )}
              
          

    </>
  )
}

