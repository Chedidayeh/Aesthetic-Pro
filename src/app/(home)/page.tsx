/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Marquee from "react-fast-marquee";
import {
  Button,
} from '@/components/ui/button'

import Link from 'next/link'

import NextImage from 'next/image'
import ProductSlider from "@/components/PodProducts/ProductSlider";
import { fetchTrendingProducts, getFollowedStoreProductsFirst, getUser } from "@/actions/actions";
import ProductReel from "@/components/PodProducts/ProductReel";





export default async function Page() {
  const user = await getUser();

  
  const trendingProducts = await fetchTrendingProducts()
  const filteredTrendingProducts = trendingProducts ? trendingProducts.slice(0, 8) : [];



  const followedStoresProducts = user ? await getFollowedStoreProductsFirst(user.id) : [];
  const filteredFollowedStoresProducts = followedStoresProducts ? followedStoresProducts.slice(0, 8) : [];

  return (
    <>

    {/* hero section */}
    <div className='py-20 mt-2 mx-auto text-center flex flex-col w-[80%] rounded-2xl items-center bg-center 
    bg-[url("/bgBanner.png")]'>
  <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl'>
  Aesthetic Prints, {' '}
    <span className='text-blue-600'>
    Pro Quality
    </span>
  </h1>
  <p className='mt-6 text-md max-w-prose text-muted-foreground'>
    With AestheticPro.tn !
  </p>
</div>





<section className='bg-muted/50 border-2 rounded-2xl dark:border-slate-50 border-slate-500  w-[90%] mx-auto my-8'>
<div className='flex flex-col items-center justify-center mt-2'>
    <p className='mt-4 text-sm max-w-prose text-muted-foreground'>
      Discover our Pod Styled collection!
    </p>
    <div className='mt-2'>
      <Link href={"/PodProducts"}>
        <Button variant='link' className="animate-wiggle">
          Browse Now &rarr;
        </Button>
      </Link>
    </div>
  </div>
    <Marquee>
  <div className='flex flex-wrap justify-center  my-4'>
    <NextImage src={"/trending13.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending11.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending4.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending5.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending7.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending3.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending8.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending2.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending9.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending1.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending16.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending6.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending10.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending12.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending14.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
    <NextImage src={"/trending15.jpg"} className='rounded-2xl aspect-square mx-4' width={400} height={400} alt=''/>
  </div>
  </Marquee>
</section>



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



      
    </>
  )
}

