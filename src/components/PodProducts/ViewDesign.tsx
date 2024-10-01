/* eslint-disable @next/next/no-img-element */
'use client'

import NextImage from "next/image"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
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
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";


const ViewDesign = ( {designs} : { designs: string[] } ) => {


    const [isOpen, setisOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
  };

    return (

      <>
              <AlertDialog open={isOpen}  >
        <AlertDialogContent className={`flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-slate-200'}`}>
        <div className="flex items-center justify-center cursor-pointer">
          <Badge onClick={toggleDarkMode} variant="secondary">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Badge>
          </div>
        <Carousel className="w-full max-w-xs">
    
               
           <CarouselContent>
                
               {designs.map((image, index) => (
                  <CarouselItem key={index}>
                        <div className="p-1">
                             <NextImage 
                            //  src={`/api/getImage?imageUrl=${encodeURIComponent(image)}`}
                             src={image}
                             width={500} height={500} alt={`design Image ${index + 1}`}
                             onContextMenu={(e) => e.preventDefault()}
                              className="object-contain" />
                        </div>
                            </CarouselItem>
                       ))}
                 </CarouselContent>
              <CarouselPrevious />
                <CarouselNext />
         </Carousel>               
          
        <AlertDialogFooter>
        <AlertDialogCancel onClick={()=>setisOpen(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>

      <Button onClick={() => setisOpen(true)} variant="secondary">
                  View Design
      </Button>
      </>

    )

}

export default ViewDesign