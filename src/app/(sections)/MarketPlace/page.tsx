/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import ProductReel from '@/components/MarketPlace/ProductReel'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import Link from 'next/link'

import PerkSection from '@/components/MarketPlace/PerkSection'
import { fetchBestSellingProducts, fetchNewProducts, fetchTrendingProducts, getFollowedStoreProductsFirst, getProductsGroupedByCollection, getUser } from '@/actions/actions'
import ProductSlider from '@/components/MarketPlace/ProductSlider'
import { fetchDiscountProductsDeals } from './discountDeals/actions'
import { ArrowRight } from 'lucide-react'


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
              <Link href={"/MarketPlace/ProductsView"}>
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
              href='/MarketPlace/FollowedStores'
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
              href='/MarketPlace/discountDeals'
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
            href='/MarketPlace/BestSelling'
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
            href='/MarketPlace/NewlyReleased'
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
                      href={`/MarketPlace/collection/${collection}`}
                      title={`${collection.replace(/_/g, ' ')} Products`}
                      products={products}
                      subtitle={`Explore Our ${collection.replace(/_/g, ' ')} Products!`}
                    />
                  </div>
                </section>
              );
            })}







<div className='py-10 mt-2 mx-auto flex flex-col w-[80%] rounded-2xl bg-center 
    bg-[url("/bgBanner.png")]'>

  <div className="text-center flex flex-col items-center">
    <h1 className="text-3xl font-bold tracking-tight text-white">
      Try to customize{' '}
      <span className="inline-flex items-center gap-1 text-blue-600">
        your own product
      </span>
    </h1>

    <p className='mt-4 text-md max-w-prose text-gray-400'>
    Create and customize your own products!   
     </p>

    <div className="mt-6">
    <Link      
              href='/MarketPlace/create-client-product/select-category'
              className={buttonVariants({
                size: 'sm',
                className: 'items-center gap-1 text-white',
              })}>
              Create your product
              <ArrowRight className='ml-1.5 h-5 w-5' />
            </Link>
    </div>
  </div>

</div>


      




      
    </>
  )
}

