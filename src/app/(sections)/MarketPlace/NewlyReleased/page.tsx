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
import { fetchNewProducts, getAllPodProductsCategories, getAllPodProductsCollections, getUser } from '@/actions/actions'





export default async function Page() {
  const products = await fetchNewProducts();
  const user = await getUser()
  const categories = await getAllPodProductsCategories()
  const collections = await getAllPodProductsCollections()

  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <NewReleased
                     user={user!}
                     products={products!}
                     categories={categories!}
                     collections={collections}

                />
                </div>
              </section>
          


    </>
  )
}

