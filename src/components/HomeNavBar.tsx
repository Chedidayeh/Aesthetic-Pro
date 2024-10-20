import NextImage from 'next/image'
import Link from 'next/link'
import { Dialog, DialogClose } from '@/components/ui/dialog'
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ArrowRight, BookOpenText, Box, CircleDollarSign, GraduationCap, Heart, Home, LayoutPanelTop, Palette, School, Shirt, ShoppingCart, UserRoundCog } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { getUser } from '@/actions/actions'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import UserProfile from './UserProfile'
import { ModeToggle } from './ModeToggle'
import { db } from '@/db'


const Navbar = async () => {

  const user = await getUser()
  const isAdmin = user?.userType === "ADMIN"
  const isUser = user?.userType === "USER"
  const isSeller = user?.userType === "SELLER"
  const isFactoryAdmin = user?.userType === "FACTORY"
  const platform = await db.platform.findFirst()

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200  backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
      <div style={{ width: '50px', height: '50px' }} className='h-full  right-0'>
          <NextImage
              src={"/aestheticpro.png"}
              width={1000}
              height={1000}
              alt="logo"
              draggable={false}
          />
      </div>


          {/* Hamburger Icon for Small Devices */}
          <Dialog>
            <SheetTrigger className="md:hidden">
              <HamburgerMenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className='w-[60%] mt-4'>
              {/* Middle Section for small devices */}
              <div className='md:hidden flex flex-col mt-16 space-y-2'>
                <DialogClose>
                <Link href="/" className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: "hover:text-blue-500"
                })}>
                  <Home size={15} className='mr-1' />
                  Home
                </Link>
                </DialogClose>

                <DialogClose>
                <Link href="/PodProducts" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-red-500"
            })}>
              <Palette size={15} className='mr-1' />
              Pod Products ✨
            </Link>
                </DialogClose>

                <DialogClose>
                <Link href="/about" className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: "hover:text-yellow-500"
                })}>
                  <BookOpenText size={15} className='mr-1' />
                  About Us ✨
                </Link>
                </DialogClose>
                {
                  isAdmin && (
            <DialogClose>
                  <Link
                    href='/adminDashboard'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}>
                    Admin Dashboard ✨
                  </Link>
                </DialogClose>
                  )
                }


                {isFactoryAdmin && (
                  <Link
                    href='/factoryDashboard'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}>
                    Factory Dashboard ✨
                  </Link>
                )}


                {isSeller && (
                  <Link
                    href='/sellerDashboard'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}>
                    Seller Dashboard ✨
                  </Link>
                )}

                {isUser && user.isAffiliate == true && (
                  <Link
                  href='/affiliateDashboard'
                   className={buttonVariants({  
                   size: 'sm',
                   variant: 'outline',
              })}>
                   Affiliate Dashboard ✨
                  </Link>
                )}
                
              </div>
            </SheetContent>
          </Dialog>

          {/* Middle Section */}
          <div className='hidden md:flex h-full left-0 items-center space-x-4'>


          <Link href="/" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-blue-500"
            })}>
              <Home size={15} className='mr-1' />
              Home
            </Link>

            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />


            <Link href="/PodProducts" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-red-500"
            })}>
              <Palette size={15} className='mr-1' />
              Pod Products ✨
            </Link>

            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />

            <Link href="/about" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-yellow-500"
            })}>
              <BookOpenText size={15} className='mr-1' />
              About Us ✨
            </Link>
          </div>

                    {/* Right Section */}
            <div className='hidden md:flex items-center space-x-2'>
            {user  && platform && (
              <>
                {isAdmin && (
                  <Link
                    href='/adminDashboard'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}>
                    Admin Dashboard ✨
                  </Link>
                )}
              

                {isFactoryAdmin && (
                  <Link
                    href='/factoryDashboard'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}>
                    Factory Dashboard ✨
                  </Link>
                )}


                {isSeller && (
                  <Link
                    href='/sellerDashboard'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}>
                    Seller Dashboard ✨
                  </Link>
                )}

              {isUser && user.isAffiliate == true && (
                  <Link
                  href='/affiliateDashboard'
                   className={buttonVariants({  
                   size: 'sm',
                   variant: 'outline',
              })}>
                   Affiliate Dashboard ✨
                  </Link>
                )}
            </>
            )}       

        <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
                 {/* User Profile */}

            <UserProfile user={user!} platform={platform!} />
            <ModeToggle/>

            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
            <Link
              
              href='/PodProducts/create-client-product/select-category'
              className={buttonVariants({
                size: 'sm',
                className: 'hidden sm:flex items-center gap-1',
              })}>
              Create your product
              <ArrowRight className='ml-1.5 h-5 w-5' />
            </Link>

          </div>

          {/* User Profile for small devices */}
          <div className='md:hidden flex items-center space-x-2'>
            <UserProfile user={user!} platform={platform!} />
            <ModeToggle/>
          </div>

        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
