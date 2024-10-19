/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import NextImage from 'next/image'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
    Activity,
    ArrowUpRight,
    CircleCheck,
    CircleUser,
    CircleX,
    CreditCard,
    DollarSign,
    Heart,
    Menu,
    OctagonAlert,
    Package2,
    Palette,
    Search,
    Shirt,
    Trash2,
    Users,
    X,
  } from "lucide-react"
  
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  import Link from "next/link";
  
  import { cn } from "@/lib/utils";
  import React, { ChangeEvent, useEffect, useState } from "react"
  import OrderedDesigns from "@/components/sellerDashboard/OrderedDesigns"
  import OrderedProducts from "@/components/sellerDashboard/OrderedProducts"
  import { db } from "@/db"
  import UsersTable from "@/components/adminDashboard/UsersTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderItem, Product, SellerDesign, Store, User } from "@prisma/client"
import { tree } from "next/dist/build/templates/app-page"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { acceptDesign, deleteStoreById, refuseDesign } from "./actions"
import { Input } from '@/components/ui/input'
import LoadingState from '@/components/LoadingState'
import { Label } from '@/components/ui/label'
  

interface ExtraStore extends Store {
    user : User
    products : Product[]
    designs  : SellerDesign[]
}
  
  
  
interface StoresViewProps {
    selectedStore: ExtraStore;
  }
  
  const DesignView = ({ selectedStore }: StoresViewProps ) => { 

    const router = useRouter();
    const { toast } = useToast()


    const [reasonForRejection, setReasonForRejection] = useState('');
    const [isDialogOpen, setisDialogOpen] = useState<boolean>(false);










    // toggle Mode
    const [isDarkMode, setIsDarkMode] = useState(true);
    const handleToggleMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
    };

      // search query for designs
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const [filterBy, setFilterBy] = useState<string>('');

  const filteredDesigns = selectedStore?.designs.filter((design) =>
    (filterBy === '' || (filterBy === 'accepted' && design.isDesignAccepted) || 
     (filterBy === 'refused' && design.isDesignRefused) || 
     (filterBy === 'action' && !design.isDesignAccepted && !design.isDesignRefused)) &&
    (design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     design.id.toLowerCase().startsWith(searchQuery.toLowerCase()))
  );



    const [open, setOpen] = useState<boolean>(false);

    
    const handleAccept = async (designId : string) =>{

      try {
        setOpen(true)
        await acceptDesign(designId)
        toast({
          title: 'Design Was Successfully Accepted',
          variant: 'default',
        });
        setOpen(false)
        router.refresh()
      } catch (error) {
        setOpen(false)
        toast({
          title: 'Error : Design Was not Accepted',
          variant: 'destructive',
        });
      }

    }

    const handleRefuse = async (designId : string) =>{

      try {
        setOpen(true)
        await refuseDesign(designId , reasonForRejection)
        toast({
          title: 'Design Was Successfully Refused',
          variant: 'default',
        });
        setOpen(false)
        router.refresh()
      } catch (error) {
        setOpen(false)
        toast({
          title: 'Error : Design Was not Refused',
          variant: 'destructive',
        });
      }

    }

           // Function to handle download
           const downloadDesign = async (imageUrl: string) => {
            if(imageUrl === '') {
              toast({
                title: "No design found !",
                variant: "destructive",
              });
              return;
            }
            try {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "design_image.png"; // You can set the filename here
              document.body.appendChild(a);
              a.click();
              a.remove();
            } catch (error) {
              console.error("Error downloading design:", error);
              toast({
                title: "Download failed",
                variant: "destructive",
              });
            }
          };



    return (
      <>





       {/* store designs view */}
       {filteredDesigns && (
  <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
    <CardHeader>
      <div className="grid gap-2">
        <CardTitle className="font-bold">Store Designs :</CardTitle>
        <CardDescription>
          <div className='flex items-center justify-center'>
            <Button variant="default" size="sm" className="w-full sm:w-[30%]" onClick={handleToggleMode}>
              Toggle Mode
            </Button>
          </div>
          <div className='mt-2 flex flex-col sm:flex-row items-center justify-center'>
          <Input className='w-full sm:w-[60%] mb-2 sm:mb-0' type="text" placeholder="Search for a design by name or by id..." value={searchQuery} onChange={handleSearchChange} />
          <div className='w-full sm:w-auto sm:ml-2'>
            <Select onValueChange={(value) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="refused">Refused</SelectItem>
                  <SelectItem value="action">Awaiting action</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        </CardDescription>
        <CardContent>
          <ScrollArea
            className={cn(
              'relative h-96 sm:h-[400px] lg:h-[600px] flex-1 my-8 w-full rounded-xl p-2 ring-1 ring-inset ring-gray-900 lg:rounded-2xl flex justify-center flex-col items-center',
              isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            )}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-2">
              {filteredDesigns.map((design, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`border-2 rounded-md p-1 cursor-pointer`}>
                    <Badge variant={'default'}>{design.name}</Badge>
                    <NextImage
                     onContextMenu={(e) => e.preventDefault()}
                     src={`/api/getImage?imageUrl=${encodeURIComponent(design.imageUrl)}`}
                     alt={design.name}
                     loading="eager"
                     blurDataURL="/Loading.png"
                     placeholder="blur"
                     className="aspect-square w-full rounded-md object-contain"
                     height={1000}
                     width={1000}
                    />
                  </div>
                  <div className='my-2 text-center'>
                  <Badge
                  onClick={() => { downloadDesign(design.imageUrl) }} 
                  className='bg-gray-500 text-white cursor-pointer'>
                    Download Design
                  </Badge>
                </div>
                  <div className="flex items-center mt-2">
                    {!design.isDesignAccepted && !design.isDesignRefused && (
                      <>
                        <AlertDialog open={isDialogOpen}>
                          <AlertDialogTrigger asChild />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reason for rejecting</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="grid gap-4 py-4">
                              <Input
                                value={reasonForRejection}
                                onChange={(e) => setReasonForRejection(e.target.value)}
                                type="text"
                                placeholder='Type the reason'
                                className="w-full bg-gray-100"
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setisDialogOpen(false)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction disabled={reasonForRejection === ""} className='bg-red-500 hover:bg-red-400' onClick={() => {
                                setisDialogOpen(false);
                                handleRefuse(design.id);
                              }}>Delete Design</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Badge onClick={() => setisDialogOpen(true)} className='hover:text-red-500 cursor-pointer' variant={`secondary`}>
                          <CircleX />
                        </Badge>
                        <Badge onClick={() => handleAccept(design.id)} className='ml-2 hover:text-green-500 cursor-pointer' variant={`secondary`}>
                          <CircleCheck />
                        </Badge>
                      </>
                    )}
                    {design.isDesignAccepted && (
                      <Badge className='bg-green-500' variant={`default`}>
                        Accepted
                      </Badge>
                    )}
                    {design.isDesignRefused && (
                      <Badge className='bg-red-500' variant={`default`}>
                        Refused
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </div>
    </CardHeader>
  </Card>
)}

  
  
  <LoadingState isOpen={open} />

  
    </>
    );
  }
  
  export default DesignView;