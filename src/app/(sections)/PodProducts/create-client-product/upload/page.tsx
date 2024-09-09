/* eslint-disable @next/next/no-async-client-component */
'use server'
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

import { db } from '@/db';
import { error } from 'console';
import DesignConfigurator from './DesignConfigurator';
import { BackBorder, Category, Color, FrontBorder, Size } from '@prisma/client';
import { getAllCategories } from '../select-category/actions';
import { OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPlatformForTheWebsite } from "@/actions/actions";



interface PageProps {
  searchParams: {
    [key: string]: string  | undefined
  }
}


const Page = async ({ searchParams }: PageProps) => {
  const categories = await getAllCategories()

  const { category , index } = searchParams;

  const selectedCat = categories[parseInt(index!)];

  const categoryProduct = getCategoryByLabel(category? category : "");

  function getCategoryByLabel(label: string) {
    if(label !== "") return categories.find(category => category.label === label);
    return categories[0]
  }
  
  const sellersDesigns = await db.sellerDesign.findMany({
    where: { 
      isDesignForSale : true,
      isDesignAccepted : true,
    },
    include : {
      store : true
    }
  });

    if(!sellersDesigns){
    throw error ("there's no sellersDesigns");
    }


    const platform  = await getPlatformForTheWebsite()

  


  return (
    <>

    {categories.length !== 0 ? ( 

      <DesignConfigurator
      SellersDesignsData={sellersDesigns}
      categoryProduct={categoryProduct!}
      selectedCategory = {selectedCat}
      platform={platform!}
    />
    ) : (
      <>
      <AlertDialog open={true} >
<AlertDialogContent>
<AlertDialogHeader className="flex flex-col items-center">
<div className="text-red-500 mb-2">
<OctagonAlert className=''/>
</div>
<AlertDialogTitle className="text-xl font-bold text-center">
No Categories found ! 
</AlertDialogTitle>
<AlertDialogDescription>
Please return to the home page !
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<Link  href="/PodProducts" ><Button variant="link">
  Return
    </Button>
    </Link>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
</>
    ) }

</>

  
  );
};

export  default Page ;

