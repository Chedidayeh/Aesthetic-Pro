/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import {  RocketIcon } from 'lucide-react'
import {  useState } from 'react'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'


const Page = () => {



  const handleFacebookIconClick = () => {
    const url = "https://www.facebook.com/profile.php?id=61564936846426";
    window.open(url!, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramIconClick = () => {
    const url = "https://www.instagram.com/aestheticpro.tn/";
    window.open(url!, '_blank', 'noopener,noreferrer');
  };


  return (
    <>



    <div className=''>
      <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-base font-medium text-primary'>Contact Us !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Feel free to reach out!
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <RocketIcon className="h-4 w-4 mr-2 text-primary" />
              <p>
                Fast reply.
              </p>
            </div>
        </div>

        <Separator className="my-8"/>

        <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              1- FaceBook Page : 
            </h4>
             <p className="text-gray-400 inline-flex cursor-pointer items-center hover:text-blue-600" onClick={handleFacebookIconClick}>
               Aesthetic Pro
            </p>

          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              2- Instagram Page : 
            </h4>
            <p className="text-gray-400 inline-flex cursor-pointer items-center hover:text-red-600" onClick={handleInstagramIconClick}>
               @aestheticpro.tn
            </p>
          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              3- Email : 
            </h4>
            <p className="text-gray-400 inline-flex hover:text-green-600 items-center">
            astheticprocontact@gmail.com
            </p>
          </div>


  

      </div>
    </div>

    </>
  )
}

export default Page


