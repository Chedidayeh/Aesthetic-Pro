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
import { CircleCheckBig, CircleDollarSign, FileText, FolderPen, Loader, Loader2, MousePointerClick, Receipt, Smile, Tags } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toPng } from 'html-to-image';
import { SingleImageDropzone } from '@/components/sellerDashboard/SingleImageDropzone';
import { addProductToDb, addProductToDbB, addProductToDbF } from './actions';
import LoadingState from "@/components/LoadingState"
import { getAllCategories, getPlatformForTheWebsite } from "@/actions/actions"
import { Category, Color, Size, FrontBorder, BackBorder } from "@prisma/client"
import CreateProductView from "./CreateProductView";






type SelectedColorsState = {
  [colorLabel: string]: boolean; // Use string index signature to represent color labels as keys with boolean values
};

interface fetchedCat extends Category {
  colors : Color[]
  sizes : Size[]
  frontBorders : FrontBorder[]
  backBorders : BackBorder[]
}


const Page =  async () => {
  
  const categories = await getAllCategories()
  const platform  = await getPlatformForTheWebsite()


  return (

    <>
    <CreateProductView categories={categories} platform={platform!} />
                          
  </>
  
  );
};

export  default Page ;

