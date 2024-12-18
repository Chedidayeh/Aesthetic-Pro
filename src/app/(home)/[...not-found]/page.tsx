
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import NextImage from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='container relative flex py-32 flex-col items-center justify-center lg:px-0'>
    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col items-center space-y-2 text-center'>
        <NextImage src="/404.png" alt="404" width={1000} height={1000}  className='h-80 w-96 animate-flashing' />


          <div className='my-4'>
        <h1 className='text-2xl font-semibold tracking-tight'>
            Page Not Found !
        </h1>

        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'gap-1.5',
          })}
          href='/'>
            Return To Home Page
          <ArrowRight className='h-4 w-4' />
        </Link>

        </div>
      </div>
    </div>
  </div>
  );
}
