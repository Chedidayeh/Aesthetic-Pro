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
import NextImage from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import {  useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import { useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers/reducers';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { CircleCheckBig, CircleDollarSign, FileText, FolderPen, Loader, MousePointerClick, OctagonAlert, Receipt, Smile, Tags } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toPng } from 'html-to-image';
import { SingleImageDropzone } from '@/components/sellerDashboard/SingleImageDropzone';
import { addProductToDb, addProductToDbB, addProductToDbF, getStoreWithProductsCount } from './actions';
import LoadingState from "@/components/LoadingState"
import { getAllCategories, getLevelByNumber, getPlatformForTheWebsite, getStore, getUser } from "@/actions/actions"
import CreateProductView from "./CreateProductView";
import Link from "next/link";

import { unstable_noStore as noStore } from "next/cache"
import { getAllCollections } from "../../adminDashboard/settings/actions"
const Page =  async () => {

  noStore()
  const user = await getUser()
  const store = await getStoreWithProductsCount(user!.id)
  const collections = await getAllCollections()
  const categories = await getAllCategories()
  const platform  = await getPlatformForTheWebsite()

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
              Product Creation is Deactivated ! 
          </AlertDialogTitle>
          <AlertDialogDescription>
              We will send you a notification when product creation is activated !
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
  if ((store.productCount === level.productLimit) && store.unlimitedCreation === false ) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-red-500 mb-2">
              <OctagonAlert className='' />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Product Creation Deactivated!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have reached your product upload limit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/sellerDashboard">
              <Button variant="link">
                Return to Seller Dashboard
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  
  return (

    <>
    <CreateProductView categories={categories} platform={platform!} store={store} collections={collections} />
                          
  </>
  
  );
};

export  default Page ;

