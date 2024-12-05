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
import {  getAllProductCollectionNames, getUser } from '@/actions/actions'
import ProductsByCategory from './ProductsByCategory'
import { fetchPriceRanges, fetchProductsByCategory } from './actions'



interface PageProps {
  params: {
    category: string
  }
}

export default async function Page({ params }: PageProps) {
  const { category } = params  
  const limit = 4; // Number of products per page
  const page = 1; // Initial page
  const decodedCategory = decodeURIComponent(category)
  const data = await fetchProductsByCategory(decodedCategory , page , limit);
  const user = await getUser()
  const collections = await getAllProductCollectionNames()
  const priceRanges = await fetchPriceRanges(decodedCategory)


  
  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <ProductsByCategory
                    initialProducts={data.products}
                    totalCount={data.totalCount}
                    initialPage={page}
                    limit={limit}
                    priceRanges={priceRanges}
                    user={user!}
                    category={decodedCategory}
                    collections={collections}
                />
                </div>
              </section>
          

    </>
  )
}

