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
import {  fetchProductsByCategory, fetchProductsByCollection, getUser } from '@/actions/actions'
import ProductsByCategory from './ProductsByCollection'
import PerkSection from '@/components/PodProducts/PerkSection'
import { getAllPodProductsCategories, getAllPodProductsCollection } from './actions'


interface PageProps {
  params: {
    collection: string
  }
}

// export async function generateStaticParams() {
//   const collections = await getAllPodProductsCollection()
//   return collections.map((collection) => ({
//     collection,
//   }))
// }

export default async function Page({ params }: PageProps) {
  const { collection } = params
  const decodedCollection = decodeURIComponent(collection)
  const collectionProducts = await fetchProductsByCollection(decodedCollection as Collection);
  const user = await getUser()
  const categories = await getAllPodProductsCategories(decodedCollection)

  
  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <ProductsByCategory
                     collection={decodedCollection}
                     user={user!}
                     products={collectionProducts!}
                     categories = {categories}
                />
                </div>
              </section>
          

    </>
  )
}

