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
import { ArrowRight, BookOpenText, Box, CircleDollarSign, GraduationCap, Heart, Home, LayoutPanelTop, Menu, Palette, School, Shirt, ShoppingBasket, ShoppingCart, Store, UserRoundCog } from 'lucide-react'
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
import { fetchCartProductCount, getUser, getUserOrders } from '@/actions/actions'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import UserProfile from './UserProfile'
import { ModeToggle } from './ModeToggle'
import { db } from '@/db'
import { fetchCartProducts } from '@/app/(sections)/MarketPlace/cart/actions'


const Navbar = async () => {

  const user = await getUser()
  const isAdmin = user?.userType === "ADMIN"
  const isUser = user?.userType === "USER"
  const isSeller = user?.userType === "SELLER"
  const isFactoryAdmin = user?.userType === "FACTORY"
  const platform = await db.platform.findFirst()
  const cartProductList = await fetchCartProductCount(user?.id ? user.id : "")
  const orders = await getUserOrders(user?.id ? user.id : "")
  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full  backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
          <div
            style={{ width: '50px', height: '50px' }}
            className="hidden xl:block h-full xl:right-0 sm:items-center animate-pulse"
          >
            <NextImage
              src="/aestheticpro.png"
              width={1000}
              height={1000}
              alt="logo"
              draggable={false}
            />
          </div>




          {/* Hamburger Icon for Small Devices */}
          <Dialog>
            <SheetTrigger className="flex xl:hidden">
            <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>            
          </SheetTrigger>
            <SheetContent side="left" className='w-[40%] xs:[30%] mt-4'>
              {/* Middle Section for small devices */}
              <div className='flex justify-center items-start flex-col mt-16 space-y-2'>
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
                <Link href="/MarketPlace" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-red-500"
            })}>
              <Store size={15} className='mr-1' />
              MarketPlace ✨
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

                <DialogClose>
                <Link href="/MarketPlace/cart" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-blue-500"
            })}>
              <ShoppingCart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {cartProductList ?? 0}
                </span>
              Cart
            </Link>
                </DialogClose>
               
               
                <DialogClose>

                <Link href="/MarketPlace/userOrders" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-green-500"
            })}>
              <ShoppingBasket size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {orders.length ?? 0}
                </span>
              Your Orders
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
          <div className='hidden xl:flex h-full left-0 items-center space-x-8'>


          <Link href="/" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-blue-500"
            })}>
              <Home size={15} className='mr-1' />
              Home
            </Link>


            <Link href="/MarketPlace" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-red-500"
            })}>
              <Store size={15} className='mr-1' />
              MarketPlace ✨
            </Link>


            <Link href="/about" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-yellow-500"
            })}>
              <BookOpenText size={15} className='mr-1' />
              About Us ✨
            </Link>

            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />


            <Link href="/MarketPlace/cart" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-blue-500"
            })}>
              <ShoppingCart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {cartProductList ?? 0}
                </span>
              Cart
            </Link>

            <Link href="/MarketPlace/userOrders" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-green-500"
            })}>
              <ShoppingBasket size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {orders.length ?? 0}
                </span>
              Your Orders
            </Link>

          </div>

                    {/* Right Section */}
            <div className='hidden xl:flex items-center space-x-2'>
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



          </div>

          {/* Logo visible only in small and medium devices */}
          <div
            style={{ width: '50px', height: '50px' }}
            className="block xl:hidden h-full animate-pulse"
            >
            <NextImage
              src="/aestheticpro.png"
              width={1000}
              height={1000}
              alt="logo"
              draggable={false}
            />
          </div>



          {/* User Profile for small devices */}
          <div className='flex xl:hidden items-center space-x-2'>

            <UserProfile user={user!} platform={platform!} />
            <ModeToggle/>
          </div>

        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
