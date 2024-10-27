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
import { ArrowRight, CircleDollarSign, GalleryHorizontalEnd, Heart, Home, Menu, Shirt, ShoppingBasket, ShoppingCart, UserRoundCog } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { fetchBestSellingProducts, fetchCartProductCount, getAllPodProductsCategories, getUser, getUserOrders } from '@/actions/actions'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import MaxWidthWrapper from '../MaxWidthWrapper'
import UserProfile from './UserProfile'
import { ModeToggle } from '../ModeToggle'
import { fetchCartProducts } from '@/app/(sections)/MarketPlace/cart/actions'
import { getUserFavoriteList } from '@/app/(sections)/MarketPlace/favList/actions'

const Navbar = async () => {

  const categories = await getAllPodProductsCategories()
  const user = await getUser()
  const bestSellingProducts = await fetchBestSellingProducts();
  const cartProductList = await fetchCartProductCount(user?.id ? user.id : "")
  const orders = await getUserOrders(user?.id ? user.id : "")
  const favListProducts = await getUserFavoriteList(user?.id? user?.id : "");

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
          <div
              style={{ width: '50px', height: '50px' }}
              className="h-full xl:right-0 sm:items-center hidden sm:block"
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
            <SheetTrigger className="md:hidden">
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
            </SheetTrigger>
            <SheetContent side="left" className='w-[50%]  mt-4'>
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
                <Link href="/MarketPlace/ProductsView" className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: "hover:text-orange-500"
                })}>
                  <GalleryHorizontalEnd size={15} className='mr-1' />
                  All Products
                </Link>
                </DialogClose>

              {bestSellingProducts!.length > 0 && (
                <DialogClose>
                <Link href="/MarketPlace/BestSelling" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-green-500"
            })}>
              <CircleDollarSign size={15} className='mr-1' />
              Best Selling
            </Link>
                </DialogClose>
              )}
                <DialogClose>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="hover:text-purple-500">
                    <Shirt size={15} className="mr-1" />
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 mt-3 flex flex-col">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <Link key={String(category)}
                        href={`/MarketPlace/category/${category}`} className={buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                        })}>{category}
                        </Link>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No data for now!</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

                </DialogClose>

                <DialogClose>
                <Link href="/MarketPlace/favList" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-red-500"
            })}>
              <Heart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {favListProducts?.length ?? 0}
                </span>
              Fav List
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

            <Link href="/MarketPlace/ProductsView" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-orange-500"
            })}>
              <GalleryHorizontalEnd size={15} className='mr-1' />
              All Products
            </Link>

            {bestSellingProducts!.length > 0 && (
            <Link href="/MarketPlace/BestSelling" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "hover:text-green-500"
            })}>
              <CircleDollarSign size={15} className='mr-1' />
              Best Selling
            </Link>
          )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="hover:text-purple-500">
                  <Shirt size={15} className="mr-1" />
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 mt-3 flex flex-col">
              {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <Link key={String(category)}
                        href={`/MarketPlace/category/${category}`} className={buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                        })}>{category}
                        </Link>

                    ))
                  ) : (
                    <DropdownMenuItem disabled>No data for now!</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
            </DropdownMenu>


            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />

            <Link href="/MarketPlace/favList" className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
              className: "relative hover:text-red-500"
            })}>
              <Heart size={15} className='mr-1' />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {favListProducts?.length ?? 0}
                </span>
              Fav List
            </Link>

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
          <div className='hidden md:flex items-center space-x-4'>
            <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
            {/* User Profile */}
            <UserProfile user={user!} />
            <ModeToggle/>
          </div>


          {/* User Profile for small devices */}
          <div className='md:hidden flex items-center space-x-4'>
          <div
              style={{ width: '50px', height: '50px' }}
              className="h-full mr-16"
            >
              <NextImage
                src="/aestheticpro.png"
                width={1000}
                height={1000}
                alt="logo"
                draggable={false}
              />
            </div>
            <UserProfile user={user!} />
            <ModeToggle/>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
