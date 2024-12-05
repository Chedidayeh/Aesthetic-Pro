
"use client"
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
import {  User } from "@prisma/client"
import { useRouter } from "next/navigation"




const Profile = ({ user } : {user : User})=>{

  const router = useRouter()



    return (
        <>
                
                <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-gray-500" style={{ width: 40, height: 40 }}>
         <NextImage 
          src={user?.image ? user.image : "/sellerImage.png"}
            alt="userImage"
           width={200}
           height={200}
         />
       </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-56 mt-2 mr-2">
      <div className="flex justify-center items-center">
        <div className="relative w-[100px] h-[100px] rounded-full bg-gray-100 border-2 border-gray-500 overflow-hidden">
          <NextImage
            src={user?.image ? user.image : "/sellerImage.png"}
            alt="store"
            objectFit="cover"
            width={500}
            height={500}
            className="rounded-full"
          />
        </div>
      </div>
        <DropdownMenuLabel className="flex justify-center items-center">
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

export default Profile