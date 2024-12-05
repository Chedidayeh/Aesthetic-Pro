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
import NewReleased from './NewReleased'
import { getAllProductsCategories, getAllProductCollectionNames, getUser } from '@/actions/actions'
import { fetchNewProducts, fetchPriceRanges } from './actions'





export default async function Page() {
  const limit = 4; // Number of products per page
  const page = 1; // Initial page
  const priceRanges = await fetchPriceRanges()
  const { products, totalCount } = await fetchNewProducts(page,limit);
  const user = await getUser()
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()

  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <NewReleased
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

