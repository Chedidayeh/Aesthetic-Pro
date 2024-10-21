'use server'

import { db } from '@/db';
import { error } from 'console';
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
import { Frown, OctagonAlert } from 'lucide-react';
import OrderData from './OrderData';
import { getUser } from '@/actions/actions';
import { getUserOrders } from './actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


const Page = async () => {

try {

  const session = await auth();

  if(!session?.user) {
    return (
      <AlertDialog open={true} >
      <AlertDialogContent>
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-red-500 mb-2">
              <OctagonAlert className=''/>
          </div>
          <AlertDialogTitle className="text-xl font-bold text-center">
              No User found ! 
          </AlertDialogTitle>
          <AlertDialogDescription>
              Log In to view this page !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link  href="/auth/sign-in" ><Button variant="link">
            Log In
              </Button>
              </Link>
          </AlertDialogFooter>
      </AlertDialogContent>
  </AlertDialog>
    )
  }

  const orders = await getUserOrders(session.user.id)

    
    return (
    <OrderData
        ordersData={orders}
    />
    );

  }
  catch (error) {
    console.log(error)
  }

}

export default Page ;

