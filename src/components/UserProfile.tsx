
"use client"
import NextImage from "next/image"

import { CircleUserRound, ShoppingBasket, UserRound, UserRoundCheck, UserRoundCog, UserRoundPlus, UserRoundX } from "lucide-react"
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
import { Platform, User } from "@prisma/client"
import Link from "next/link"
import { createPlatform } from "@/actions/actions"
import LoadingState from "./LoadingState"
import { useState } from "react"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"




const UserProfile = ({ user , platform } : {user : User , platform : Platform | null})=>{

  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast()
  const router = useRouter()

  // create function
  const create = async () => {
    setOpen(true)
    await createPlatform(user.id)
    toast({
      title: 'Platform Was Successfully Created',
      variant: 'default',
    });
    setOpen(false)

  }

    return (
        <>
                
                <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          {user ? (
          <UserRoundCheck className="text-green-600" />
          ):(
          <UserRound />
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

            {user.userType === "ADMIN" && !platform && (
        <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button onClick={create} size={"sm"}  variant={"ghost"} className="flex justify-between items-center w-full">
                <span> Create Platform</span>
              </Button>
            </DropdownMenuItem>
            </> 
          )}
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
    <LoadingState isOpen={open} />

        </>






    )

}

export default UserProfile