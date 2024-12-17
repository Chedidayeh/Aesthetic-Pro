/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAllProductsCategories, getAllProductCollectionNames, getUser } from '@/actions/actions'
import FavList from './FavList'
import { getUserFavoriteList } from './actions'





export default async function Page() {
  const user = await getUser()
  const products = await getUserFavoriteList(user?.id? user?.id : "");
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()

  return (
    <>

          {/* fav list section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <FavList
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

