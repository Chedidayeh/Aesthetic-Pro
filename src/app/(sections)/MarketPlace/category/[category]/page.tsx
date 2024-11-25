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
import {  fetchProductsByCategory, getAllProductCollectionNames, getUser } from '@/actions/actions'
import ProductsByCategory from './ProductsByCategory'



interface PageProps {
  params: {
    category: string
  }
}

export default async function Page({ params }: PageProps) {
  const { category } = params
  const decodedCategory = decodeURIComponent(category)
  const categoryProducts = await fetchProductsByCategory(decodedCategory);
  const user = await getUser()
  const collections = await getAllProductCollectionNames()

  
  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <ProductsByCategory
                     products={categoryProducts!}
                     user={user!}
                     category={decodedCategory}
                     collections={collections}
                />
                </div>
              </section>
          

    </>
  )
}

