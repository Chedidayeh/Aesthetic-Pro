/* eslint-disable @next/next/no-async-client-component */
'use server'

import { db } from '@/db';
import { error } from 'console';
import DesignView from './DesignView';
import { auth } from '@/auth';
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
import { Frown, Loader } from 'lucide-react';
import { getLevelByNumber, getPlatformForTheWebsite } from '@/actions/actions';



const Page = async () => {

  try {
    const session = await auth();
    if(!session) return null

    const store = await db.store.findUnique({
      where:{userId:session.user.id}
    })
    
  const sellersDesigns = await db.sellerDesign.findMany({
    where: { 
      storeId: store?.id,
      isDesignForSale : true 
    }  
  });

    if(!sellersDesigns){
    throw error ("there's no sellersDesigns");
    }

  const platform = await getPlatformForTheWebsite()
 
  const level = await getLevelByNumber(store!.level)


  return (

   <DesignView
    SellerDesignsData={sellersDesigns}
    platform = {platform!}
    level={level}
    store={store!}

  />  );
  } catch (error) {
    console.error('Error fetching data:', error);
    return 

    
  }


  

};

export  default Page ;

