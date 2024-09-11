/* eslint-disable react/no-unescaped-entities */
import NextImage from 'next/image'
import Link from 'next/link'
import { getOrder, getPlatformForTheWebsite, getUser } from '@/actions/actions'

interface PageProps {
  searchParams: {
    [key: string]: string  | undefined
  }
}

const ThankYouPage = async ({
  searchParams,
}: PageProps) => {
  const {orderId} = searchParams
    
  const order = await getOrder(orderId!)

  const platform = await getPlatformForTheWebsite()

  return (

    <>

    {!order && (

<main className='relative lg:min-h-full'>
<div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
  <NextImage
    fill
    src='/checkout-thank-you.jpg'
    className='h-full w-full object-cover object-center'
    alt='thank you for your order'
  />
</div>

<div>
  <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
    <div className='lg:col-start-2'>
      <p className='text-sm font-medium text-blue-600'>
        Order not found
      </p>
      <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
        You didn't made any order !
      </h1>

      <div className='mt-16 text-sm font-medium'>

        <div className='mt-16 border-t border-gray-200 py-6 text-right'>
          <Link
            href='/PodProducts'
            className='text-sm font-medium text-blue-600 hover:text-blue-500'>
            Continue shopping &rarr;
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>
</main>

    )}

    
    
    {order && (

    <main className='relative lg:min-h-full'>
      <div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
        <NextImage
          fill
          src='/checkout-thank-you.jpg'
          className='h-full w-full object-cover object-center'
          alt='thank you for your order'
        />
      </div>

      <div>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
          <div className='lg:col-start-2'>
            <p className='text-sm font-medium text-blue-600'>
              Order successful
            </p>
            <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
              Thanks for ordering
            </h1>
              <p className='mt-2 text-base text-muted-foreground'>
                We appreciate your order, and we&apos;re
                currently processing it. So hang tight and
                we&apos;ll send it to you right away !
              </p>
              <div className=' mt-2 text-left'>
                <Link
                  href='/PodProducts/userOrders'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                  View your orders &rarr;
                </Link>
              </div>
              <div className='mt-2'>
              <span className=' text-red-500 text-sm'>We'll call you very soon to confirm your order !</span>
              </div>

            <div className='mt-16 text-sm font-medium'>
              <div className='text-muted-foreground'>
                Order Id
              </div>
              <div className='mt-2 '>
              {orderId}
              </div>

              <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                
              </ul>

              <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                <div className='flex justify-between'>
                  <p>Subtotal</p>
                  <p className=''>
                  {(order.amount - order.shippingFee).toFixed(2) } TND
                  </p>
                </div>

                <div className='flex justify-between'>
                  <p>Shipping Fee</p>
                  <p className=''>
                    {order.shippingFee.toFixed(2)} TND
                  </p>
                </div>

                <div className='flex items-center justify-between border-t border-gray-200 pt-6 '>
                  <p className='text-base'>Total</p>
                  <p className='text-base'>
                  {order?.amount.toFixed(2)} TND

                  </p>
                </div>
              </div>

              <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                <Link
                  href='/PodProducts'
                  className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                  Continue shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
   )}
    </>
  )
}

export default ThankYouPage