
'use client'
import NextImage from "next/image"
import { CircleUserRound, ShoppingBasket, UserRoundCheck, UserRoundCog, UserRoundPlus, UserRoundX } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { User } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"



const UserProfile = ({ user } : {user : User})=>{

    const router = useRouter()

    return (
        <>
                
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          {user ? (
          <UserRoundCheck className="text-green-600" />
          ):(
          <UserRoundX className="text-red-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-56 mt-2 mr-2">
      {user && (

      <div className="flex justify-center items-center">
        <div className="relative w-[100px] h-[100px] rounded-full bg-gray-100 border-2 border-gray-500 overflow-hidden">
          <NextImage
            src={user?.image ? user.image : "/clientImage.png"}
            alt="clientImage"
            width={500}
            height={500}
            className="rounded-full object-fill"
          />
        </div>
      </div>
      )}
        <DropdownMenuLabel>
          {user ? (
          <p>My Account</p>
          ):(
            <p>No Account</p>
          )}
          </DropdownMenuLabel>
        {user ? (
          <>
            <p className="text-xs ml-2 text-gray-500">{user.email}</p>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={()=>(router.push("/api/auth/logout"))} size={"sm"} variant={"ghost"} className="flex justify-between items-center w-full">
                Sign out
                <UserRoundX size={20} />
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <>        
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
            <Button onClick={()=>(router.push("/auth/sign-up"))} size={"sm"} variant={"ghost"} className="flex justify-between items-center w-full">
               Sign Up 
                <UserRoundPlus size={20} />
            </Button>
            </DropdownMenuItem>              
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <Button onClick={()=>(router.push("/auth/sign-in"))} size={"sm"} variant={"ghost"} className="flex justify-between items-center w-full">
            Sign In
                <UserRoundPlus size={20} />
            </Button>
            </DropdownMenuItem>            
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>

        </>






    )

}

export default UserProfile