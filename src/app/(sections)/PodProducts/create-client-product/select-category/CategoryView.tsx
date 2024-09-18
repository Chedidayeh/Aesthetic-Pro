/* eslint-disable @next/next/no-img-element */
'use client'
import NextImage from 'next/image'

import * as React from "react";
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { getUser } from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { BackBorder, Category, Color, FrontBorder, Size } from "@prisma/client";
import LoadingState from "@/components/LoadingState";
import LoginModal from '@/components/LoginModal';
import { useState } from 'react';

interface fetchedCat extends Category {
  colors : Color[]
  sizes : Size[]
  frontBorders : FrontBorder[]
  backBorders : BackBorder[]
}

interface CategoryViewProps {
    categories: fetchedCat[];
  }

const CategoryView: React.FC<CategoryViewProps> = ({ categories  }) => {

  const [open, setOpen] = React.useState<boolean>(false);



  const router = useRouter();
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [isButtonPressed, setIsButtonPressed] = React.useState(false);
  const { toast } = useToast()

  const handleCardClick = (index: number) => {
    setSelectedCard(prevState => prevState === index ? null : index);
  };

  React.useEffect(() => {
    setIsButtonDisabled(selectedCard === null);
  }, [selectedCard]);


  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)


  const handleButtonClick = async (index: number | null) => {
    if (index !== null && index !== undefined) {
      const user = await getUser()
      if(!user){
        setIsLoginModalOpen(true)
        toast({
          title: 'No logged in user found !',
          description: 'You need to log In first !',
          variant: 'destructive',
        });
        return
      }
      setIsButtonPressed(true)
      router.push(`/PodProducts/create-client-product/upload?index=${index}`);
      setIsButtonDisabled(true)

    }
  };











  

  

  return (
    <>

<LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

    <LoadingState isOpen={open} />

    <div className={cn(
      'relative h-full border-2 flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
    )}>


      {categories.length > 0 ? (

       <>

        <div className='relative flex flex-1 flex-col items-center justify-center w-full'>
        <div className='mt-6 sm:col-span-9 md:row-end-1'>
          <h3 className='text-3xl font-bold tracking-tight '>
            Select a Category
          </h3>
        </div>
        
        <div className="mt-2">
        <div className='w-full flex gap-6 items-center'>
          <Button
            isLoading={isButtonPressed}
            loadingText="loading" 
            size="default"
            className='w-full'
            onClick={() => handleButtonClick(selectedCard)}
            disabled={isButtonDisabled}
          >
            Continue
            <ArrowRight className='h-4 w-4 ml-1.5 inline' />
          </Button>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2">
        {categories.map((category, index) => (
  <div
    key={index}
    onClick={() => handleCardClick(index)}
    className='cursor-pointer'
  >
    <Card className={cn("border", selectedCard === index && "border-primary")}>
      <CardContent className="flex justify-center p-1 relative">
      <NextImage
        width={1000}
        height={1000}
        src={category.value!}
        alt={category.label}
        className="h-full w-full rounded-xl object-cover"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary">{category.label}</Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{category.price} TND</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
        ))}
      </div>

        </div>


      </>
      ) : (
       <div className='flex h-full flex-col items-center justify-center space-y-1'>
        <div
          aria-hidden='true'
          className='relative mb-4 h-40 w-40 text-muted-foreground'>
          <img
            src='/hippo-empty-cart.png'
            loading='eager'
            alt='empty shopping cart hippo'
          />
        </div>
        <h3 className='font-semibold text-2xl'>
          No Categories found for now !
        </h3>
        <p className='text-muted-foreground text-center'>
          Whoops! Nothing to show here yet.
        </p>
      </div>
) }

    </div>
    </>
  );
}


export default CategoryView;
