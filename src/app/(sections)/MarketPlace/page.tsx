/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */



import View from './View'
import {  getAllProductsCategories, getAllProductCollectionNames, getUser, fetchPriceRanges, fetchProducts, getPlatformForTheWebsite } from '@/actions/actions'




const Page = async () => {
  const user = await getUser()
  const categories = await getAllProductsCategories()
  const collections = await getAllProductCollectionNames()

  const platform = await getPlatformForTheWebsite()
  const limit = platform!.productsLimitPerPage;
  const page = 1; // Initial page
  const priceRanges = await fetchPriceRanges()


  const { products, totalCount } = await fetchProducts(page, limit);



  return (
    <>

          {/* new Released section */}
              <section className='border-t border-gray-200  w-full mx-auto' >
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <View
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
export default Page

