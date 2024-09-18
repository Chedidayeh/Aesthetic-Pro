
import NextImage from 'next/image'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { getPlatformForTheWebsite, getUser } from '@/actions/actions'
import { useEffect, useState } from 'react'
import { Platform, User } from '@prisma/client'

const Footer = async () => {

  const user = await getUser()
  const platform = await getPlatformForTheWebsite()

  return (

<footer className='bg-muted/100 border-t border-gray-800 dark:border-gray-200 my-2 relative'>
  <MaxWidthWrapper>
    <div className='p-4'>
      <div className='flex flex-col sm:flex-row sm:justify-between justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4'>
      <div className="p-5">
  <ul>

  <div style={{ width: '100px', height: '100px' }}>
    <NextImage
        draggable={false}
        src={"/aestheticpro.png"}
        width={1000}
        height={1000}
        alt="logo"
    />
</div>

    <div className="flex gap-6 my-3 pb-5">
      <Link href={"https://www.facebook.com/profile.php?id=61564936846426"}>
      <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600" />
      </Link>
      <Link href={"https://www.instagram.com/astheticpro.tn/"}>
      <FaInstagram className="text-2xl cursor-pointer hover:text-red-600" />
      </Link>
    </div>
  </ul>
</div>

        <div className="p-5">
          <ul>
            <p className="font-bold text-xl pb-4">Services</p>
            <Link href={"/PodProducts/ProductsView"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                        Browse Products
               </li>
          </Link>

                {!user && (
                        <Link href={"/auth/sign-in"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                        Sign In
                        </li>
                      </Link>
                 )} 

            {platform?.closeStoreCreation && user && user.userType === "USER" && (
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
            Become a Seller : Soon Available !
          </li>
            )} 

          {!platform?.closeStoreCreation && user && user.userType === "USER" && (
                        <Link href={"/PodProducts/create-seller-profile"}>
                        <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                        Become a Seller
                        </li>
                      </Link>
            )} 
            
            {user && user.userType === "SELLER" && (
              <Link href={"/sellerDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Selller Dashboard
            </li>
            </Link>
            )}

            {user && user.userType === "ADMIN" && (
              <Link href={"/adminDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Admin Dashboard
            </li>
            </Link>
            )}

            {user && user.userType === "FACTORY" && (
              <Link href={"/factoryDashboard"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Factory Dashboard
            </li>
            </Link>
            )}

          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="font-bold text-xl pb-4">Platform</p>
            <Link href={"/about"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                About Us
              </li>
            </Link>
            <Link href={"/buyingPolicy"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                Buying Policy
              </li>
            </Link>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="font-bold text-xl pb-4">Support</p>
            <Link href={"/contact"}>
              <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                Contact
              </li>
            </Link>
            <li className="text-muted-foreground text-sm pb-2 font-semibold hover:text-blue-600 cursor-pointer">
              Infos Line : +21656027257
            </li>
          </ul>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row sm:justify-between justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4'>
        <div className='text-center sm:text-left'>
          <p className='text-sm text-muted-foreground mx-4'>
            &copy; {new Date().getFullYear()}. All rights reserved. AestheticPro.tn
          </p>
        </div>

        <div className='flex items-center justify-center'>
          <div className='flex flex-col sm:flex-row sm:space-x-8'>
            <Link href='/sellingPolicy' className='text-sm text-muted-foreground hover:text-gray-600 mx-2'>
              Selling Policy
            </Link>
            <Link href='/privacyPolicy' className='text-sm text-muted-foreground hover:text-gray-600 mx-2'>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  </MaxWidthWrapper>
</footer>


  )
}

export default Footer