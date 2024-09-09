'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

const LoadingState = ({isOpen} : {isOpen : boolean}) =>{

    return (
        <AlertDialog open={isOpen} >
        <AlertDialogTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
              Loading!
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center">
              This will take a moment.
              <Loader2 className="text-blue-700 h-[50%] w-[50%] animate-spin mt-3" />
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>  
    )
}

export default LoadingState