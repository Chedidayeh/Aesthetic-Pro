/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */



import View from './View'
import {  fetchAllProducts, getAllPodProductsCategories, getAllPodProductsCollections, getUser } from '@/actions/actions'





export default async function Page() {
  const products = await fetchAllProducts();
  const user = await getUser()
  const categories = await getAllPodProductsCategories()
  const collections = await getAllPodProductsCollections()

  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200  w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <View
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

