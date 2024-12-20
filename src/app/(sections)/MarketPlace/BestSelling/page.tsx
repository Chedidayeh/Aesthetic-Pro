/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { getAllProductsCategories, getAllProductCollectionNames, getUser, getPlatformForTheWebsite } from '@/actions/actions'
import BestSelling from './BestSelling'
import { fetchBestSellingProducts, fetchPriceRanges } from './actions'





export default async function Page() {
  const user = await getUser()
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()
  const platform  = await getPlatformForTheWebsite()
  const limit = platform!.productsLimitPerPage; // Number of products per page
  
  const page = 1; // Initial page

  const data = await fetchBestSellingProducts(page, limit);
  const priceRanges = await fetchPriceRanges()

  
  return (
    <>

          {/* best selling section */}
              <section className='border-t border-gray-200 w-full mx-auto' >
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <BestSelling
                initialProducts={data.products}
                totalCount={data.totalCount}
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

