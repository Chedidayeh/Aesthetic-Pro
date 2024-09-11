
  import React from 'react';

  import { getAllCategories, getPlatformForTheWebsite } from "@/actions/actions"

  import CreateDesignView from "./CreateDesignView";
  
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
import { OctagonAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
  
  

  
  const Page =  async () => {
    

    const platform  = await getPlatformForTheWebsite()
  
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

    return (
  
      <>
      <CreateDesignView  platform={platform!} />
                            
    </>
    
    );
  };
  
  export  default Page ;
  
  