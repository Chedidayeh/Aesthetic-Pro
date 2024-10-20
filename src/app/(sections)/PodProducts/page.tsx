/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import ProductReel from '@/components/PodProducts/ProductReel'
import {
  Button,
} from '@/components/ui/button'
import Link from 'next/link'

import PerkSection from '@/components/PodProducts/PerkSection'
import { fetchBestSellingProducts, fetchNewProducts, fetchTrendingProducts, getFollowedStoreProductsFirst, getProductsGroupedByCollection, getUser } from '@/actions/actions'
import ProductSlider from '@/components/PodProducts/ProductSlider'
import { fetchDiscountProductsDeals } from './discountDeals/actions'


export default async function Page() {

  const newProducts = await fetchNewProducts();
  const productsGroupedByCollection  = await getProductsGroupedByCollection()
  const bestSellingProducts = await fetchBestSellingProducts();
  const discountProductsDeals = await fetchDiscountProductsDeals()
  const trendingProducts = await fetchTrendingProducts()
  const user = await getUser();
  const followedStoresProducts = user ? await getFollowedStoreProductsFirst(user.id) : [];

  // Ensure products are not null or undefined
  const filteredTrendingProducts = trendingProducts ? trendingProducts.slice(0, 8) : [];
  const filteredNewProducts = newProducts ? newProducts.slice(0, 8) : [];
  const filteredBestSellingProducts = bestSellingProducts ? bestSellingProducts.slice(0, 8) : [];
  const filteredDiscountProductsDeals = discountProductsDeals ? discountProductsDeals.slice(0, 8) : [];
  const filteredFollowedStoresProducts = followedStoresProducts ? followedStoresProducts.slice(0, 8) : [];

  
  return (
    <>

    {/* <HeroSection/> */}


        <div className='pt-8 mx-auto text-center flex  flex-col w-full items-center'>
          <p className='text-md max-w-prose  text-muted-foreground'>
           Powered by Tunisian most talented designers ✨
          </p>
        </div>

        {filteredTrendingProducts.length > 0 && (
        <section className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500 w-[90%] mx-auto my-8'>
        <div className='flex flex-col items-center justify-center mt-2'>
            <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
              Discover our Trending Style collection!
            </p>
            <div className='mt-2'>
              <Link href={"/PodProducts/ProductsView"}>
                <Button variant='link'>
                  Shop the Collection &rarr;
                </Button>
              </Link>
            </div>
          </div>
          {/* trending products */}
       <ProductSlider 
            user={user!}
            products={filteredTrendingProducts} />
        </section>
        )}

<PerkSection/>


 {/* Followed Stores Products section */}
 {filteredFollowedStoresProducts.length > 0 && (
        <section className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500 w-[90%] mx-auto my-8'>
          <div className='w-[85%] mx-auto'>
            <ProductReel
              user={user!}
              href='/PodProducts/FollowedStores'
              title='Products from Stores You Follow'
              products={filteredFollowedStoresProducts}
              subtitle='Check out the latest products from your favorite stores!'
            />
          </div>
        </section>
      )}


        {/* discountDeals section */}
        {filteredDiscountProductsDeals.length > 0  && (
        <section className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500 w-[90%] mx-auto my-8'>
          <div className='w-[85%] mx-auto'>
            <ProductReel
              user={user!}
              href='/PodProducts/discountDeals'
              title='Discover Exclusive Deals'
              products={filteredDiscountProductsDeals}
              subtitle='Unveil the Magic of Our Exclusive Products at Special Prices!'
            />
          </div>
        </section>
          )}

                {/* Top selled section */}
        {filteredBestSellingProducts.length > 0 && (
      <section className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500 w-[90%] mx-auto my-8'>
      <div className='w-[85%] mx-auto'>
      <ProductReel
            user={user!}
            href='/PodProducts/BestSelling'
            title='Best Selling Products'
            products={filteredBestSellingProducts}
            subtitle='Explore Our Bestselling Products!'
          />
      </div>
      </section>
    )}
                {/* Newly released section */}
      {filteredNewProducts.length > 0 && (
      <section className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500 w-[90%] mx-auto my-8'>
      <div className='w-[85%] mx-auto'>
      <ProductReel
            user={user!}
            href='/PodProducts/NewlyReleased'
            title='Newly released'
            products={filteredNewProducts}
            subtitle='Explore the new added products !'
          />
      </div>
      </section>
        )}




          {/* collections section */}

          {Object.entries(productsGroupedByCollection!).map(([collection, products]) => {
              // Check if the number of products is greater than 8
              if (products.length < 1) return null;

              return (
                <section key={collection} className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500 w-[90%] mx-auto my-8'>
                  <div className='w-[85%] mx-auto'>
                    <ProductReel
                      user={user!}
                      href={`/PodProducts/collection/${collection}`}
                      title={`${collection.replace(/_/g, ' ')} Products`}
                      products={products}
                      subtitle={`Explore Our ${collection.replace(/_/g, ' ')} Products!`}
                    />
                  </div>
                </section>
              );
            })}










      




      
    </>
  )
}

