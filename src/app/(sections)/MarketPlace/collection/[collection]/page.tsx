/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import { Collection, Product } from '@prisma/client'
import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/db'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {    getUser } from '@/actions/actions'
import ProductsByCategory from './ProductsByCollection'
import { fetchPriceRanges, fetchProductsByCollection, getCollectionProductsCategories } from './actions'


interface PageProps {
  params: {
    collection: string
  }
}

export default async function Page({ params }: PageProps) {
  const { collection } = params
  const limit = 4; // Number of products per page
  const page = 1; // Initial page
  const decodedCollection = decodeURIComponent(collection)
  const data = await fetchProductsByCollection(decodedCollection , page , limit);
  const user = await getUser()
  const categories = await getCollectionProductsCategories(decodedCollection)
  const priceRanges = await fetchPriceRanges(decodedCollection)

  
  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <ProductsByCategory
                     initialProducts={data.products}
                     totalCount={data.totalCount}
                     initialPage={page}
                     limit={limit}
                     priceRanges={priceRanges}
                     user={user!}
                     collection={decodedCollection}
                     categories = {categories}
                />
                </div>
              </section>
          

    </>
  )
}

