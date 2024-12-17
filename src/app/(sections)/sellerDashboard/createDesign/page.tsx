
  import React from 'react';

  import { getLevelByNumber, getPlatformForTheWebsite, getUser } from "@/actions/actions"

  import CreateDesignView from "./CreateDesignView";
  
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { OctagonAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getStoreWithDesignsCount } from './actions';
  
  

  
  const Page =  async () => {
    

    const platform  = await getPlatformForTheWebsite()
    const user = await getUser()
    const store = await getStoreWithDesignsCount(user?.id!)
    const level = await getLevelByNumber(store.level)
  
    if(platform?.closeCreation) {
      return (
        <AlertDialog open={true} >
        <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-red-500 mb-2">
                <OctagonAlert className=''/>
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
                Design Creation is Deactivated ! 
            </AlertDialogTitle>
            <AlertDialogDescription>
                We will send you a notification when Design creation is activated !
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Link  href="/sellerDashboard" ><Button variant="link">
              Return to Seller Dashboard
                </Button>
                </Link>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
      )
    }

    if ((store.designsCount === level.designLimit) && store.unlimitedCreation === false ) {
      return (
        <AlertDialog open={true} >
        <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-red-500 mb-2">
                <OctagonAlert className=''/>
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
                Design Creation is Deactivated ! 
            </AlertDialogTitle>
            <AlertDialogDescription>
            You have reached your design upload limit.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Link  href="/sellerDashboard" ><Button variant="link">
              Return to Seller Dashboard
                </Button>
                </Link>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
      )
    }

    return (
  
      <>
      <CreateDesignView  platform={platform!} store={store} />
                            
    </>
    
    );
  };
  
  export  default Page ;
  
  