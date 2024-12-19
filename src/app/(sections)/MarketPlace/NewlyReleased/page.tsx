/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import NewReleased from './NewReleased'
import { getAllProductsCategories, getAllProductCollectionNames, getUser, getPlatformForTheWebsite } from '@/actions/actions'
import { fetchNewProducts, fetchPriceRanges } from './actions'





export default async function Page() {
    const platform = await getPlatformForTheWebsite()
    const limit = platform!.productsLimitPerPage;
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
                <div className='w-[95%] lg:w-[85%] mx-auto'>
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

