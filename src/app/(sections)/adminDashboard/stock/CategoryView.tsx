/* eslint-disable @next/next/no-img-element */
'use client'
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
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import * as React from "react";
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, OctagonAlert, PlusCircle, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { BackBorder, Category, Color, FrontBorder, Size } from "@prisma/client";
import LoadingState from "@/components/LoadingState";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table } from '@/components/ui/table';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { addColorsToCategory, addSizesToCategory, deleteColor, deleteSize } from "./action";
import { SingleImageDropzone } from "@/components/sellerDashboard/SingleImageDropzone";

interface fetchedCat extends Category {
    colors : Color[]
    sizes : Size[]
    frontBorders : FrontBorder[]
    backBorders : BackBorder[]
  }
  interface ProductViewProps {
    categories: fetchedCat[];
  }
  const CategoryView = ({ categories }: ProductViewProps ) => { 

    const [open, setOpen] = useState<boolean>(false);

    const router = useRouter();
    const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
    const [selectedCat, setSelectedCat] = React.useState<fetchedCat | null>();
    const { toast } = useToast()
  
    const handleCardClick = (index: number) => {
        if (selectedCard === index) {
          // If the same card is clicked, unselect it
          setSelectedCard(null);
          setSelectedCat(null); // Reset selected category
        } else {
          // Select a new card
          setSelectedCard(index);
          setSelectedCat(categories[index]);
        }
      };
      
  
  
  
  
  

  
  
    const [newSizes, setNewSizes] = useState([
      { label: "", value: "" },
    ]);

    const [colors, setColors] = useState([
      { label: "", value: "", tw: "", frontImage: null as File | null, backImage: null as File | null },
    ]);

    const handleAddColor = () => {
      setColors([
        ...colors,
        { label: "", value: "", tw: "", frontImage: null, backImage: null },
      ]);
    };
    
    const handleAddnewSize = () => {
      setNewSizes([...newSizes, { label: "", value: "" }]);
    };
  
    const handleRemovenewSize = (index: number) => {
      const newFrontBorders = newSizes.filter((_, i) => i !== index);
      setNewSizes(newFrontBorders);
    };

    const handleRemoveColor = (index: number) => {
        const newColors = colors.filter((_, i) => i !== index);
        setColors(newColors);
      };
    

    // state for sizeId
    const [sizeId, setSizeId] = useState<string>('')
    // state for ColorId
    const [colorId, setColorId] = useState<string>('')
    // sate for dialog
    const [isColorDeleteOpen, setIsColorDeleteOpen] = useState(false)
    const [isSizeDeleteOpen, setIsSizeDeleteOpen] = useState(false);

    const handleSizeDelete = async () =>{
        try {
          await deleteSize(sizeId)
             setIsSizeDeleteOpen(false)
            toast({
              title: 'Size Was Successfully Deleted',
              variant: 'default',
            });
            router.refresh()

        } catch (error) {
            setIsSizeDeleteOpen(false)
            console.log(error)
            toast({
                title: 'Size Was Not Deleted',
                variant: 'destructive',
              });
        }
    }

    // function for handleColorDelete
    const handleColorDelete = async () =>{
        try {
            setOpen(true)

            await deleteColor(colorId)
            setIsColorDeleteOpen(false)
            toast({
                title: 'Color Was Successfully Deleted',
                variant: 'default',
                });
                router.refresh()
                setOpen(true)
                } catch (error) {
                    setIsColorDeleteOpen(false)
                    console.log(error)
                    toast({
                        title: 'Color Was Not Deleted',
                        variant: 'destructive',
                        });
                        setOpen(true)
                        }
                        }

  
    const handleSaveCategory = async () => {
      if (newSizes[0].label  ==="" && colors[0].label ==="" ) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
  
      try {
        setOpen(true)
        if(colors[0].label !==""){
          const newColors = await Promise.all(colors.map(async (color) => {
            const frontImageUrl = color.frontImage ? await uploadImage(color.frontImage) : "";
            const backImageUrl = color.backImage ? await uploadImage(color.backImage) : "";
            return {
              label: color.label,
              value: color.value,
              tw: color.tw,
              frontImageUrl: frontImageUrl || "",
              backImageUrl: backImageUrl || "",
            };
          }));

            await addColorsToCategory(selectedCat?.id!, newColors);
            toast({
            title: "Colors added successfully",
            variant: "default",
            });
            setOpen(false)
        }

        if(newSizes[0].label !==""){
            await addSizesToCategory(selectedCat?.id!, newSizes);
            toast({
            title: "Sizes added successfully",
            variant: "default",
            });
            setOpen(false)
        }
  
        
      } catch (error) {
        setOpen(false)
        console.log(error)
        toast({
            title: "adding failed",
            variant: "destructive",
          }); 
      }
     
    };


                    // function to upload a file image and get its path
                    const uploadImage = (file: File): Promise<string | null> => {
                      return new Promise((resolve, reject) => {
                        if (!file) {
                          console.log('No file selected.');
                          resolve(null);
                          return;
                        }
                    
                        // Read the file as a base64 string
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = async () => {
                          const base64data = reader.result?.toString().split(',')[1]; // Get the base64 string only
                    
                          try {
                            const response = await fetch('/api/uploadCategory', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ file: base64data , category : selectedCat?.label }),
                            });
                    
                            if (!response.ok) {
                              throw new Error('Failed to upload category image');
                            }
                    
                            const data = await response.json();
                            const path = data.url; // Get the uploaded URL
                    
                            toast({
                              title: 'category Upload Success',
                              description: 'category image uploaded successfully!',
                            });
                    
                            resolve(path); // Resolve the promise with the URL
                          } catch (error) {
                            toast({
                              title: 'Upload Error',
                              description: 'Error uploading the category image!',
                              variant: 'destructive',
                            });
                            console.error(error);
                            reject(error); // Reject the promise on error
                          }
                        };
                      });
                    };
  return (
    <>

                              {/* The AlertDialog delete size component  */}
                              <AlertDialog open={isSizeDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this size ?
                                               </AlertDialogTitle>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setIsSizeDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleSizeDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 

                              {/* The AlertDialog delete size component  */}
                              <AlertDialog open={isColorDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this color ?
                                               </AlertDialogTitle>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setIsColorDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleColorDelete()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog> 


 <p className="text-sm text-gray-700 mb-2">adminDashboard/stock</p>
 <h1 className="text-2xl font-semibold">Manage Stock</h1>


    <div className={cn(
      'relative border-2 flex-1 my-4 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
    )}>

      {categories.length > 0 ? (
       <>
        <div className='relative flex flex-1 flex-col items-center justify-center w-full'>
        
        <div className='mt-2 sm:col-span-9 md:row-end-1'>
          <h3 className='text-2xl font-bold tracking-tight '>
            Select a Category
          </h3>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2">
        {categories.map((category, index) => (
        <div
            key={index}
            onClick={() => {
                setSelectedCat(category)
                handleCardClick(index)}}     
            className='cursor-pointer'    >
            <Card className={cn("border", selectedCard === index && "border-primary")}>
                <CardContent className="flex  justify-center p-1 relative">
                <NextImage
                src={category.value}
                alt={category.label}
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                style={{ borderRadius: '0.5rem' }}
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

    {selectedCat &&   (
        <>

        {/* manage sizes */}

     <div className='flex items-center justify-center my-4'>
    <h3 className='text-xl font-bold tracking-tight '>
    Available Sizes    
    </h3>
    </div>

    <div className="flex items-center space-x-4">
  {/* Label for delete action */}
  <p className="text-xs text-red-500">Click to delete</p>

  {/* Badges */}
  <div className="flex flex-wrap space-x-2">
    {selectedCat.sizes.map((size) => (
      <Badge
        key={size.value}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
            setIsSizeDeleteOpen(true);
          setSizeId(size.id);
        }} 
      >
        {size.label}
      </Badge>
    ))}
  </div>
</div>



    <div className='flex items-center justify-center my-4'>
    <h3 className='text-xl font-bold tracking-tight '>
    Add Sizes    
    </h3>
    </div>

    
            <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
              <CardContent className='my-2'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Label</TableHead>
                      <TableHead className="w-[50%]">Value</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newSizes.map((size, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">
                          <Input
                            type="text"
                            placeholder="Small"
                            value={size.label}
                            onChange={(e) => {
                              const Sizes = [...newSizes];
                              Sizes[index].label = e.target.value;
                              setNewSizes(Sizes);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="S"
                            value={size.value}
                            onChange={(e) => {
                              const Sizes = [...newSizes];
                              Sizes[index].value = e.target.value;
                              setNewSizes(Sizes);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <X
                            className="text-gray-600 hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemovenewSize(index)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1" onClick={handleAddnewSize}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Size
                </Button>
              </CardFooter>
            </Card>



        {/* manage colors */}

        <div className='flex items-center justify-center my-4'>
    <h3 className='text-xl font-bold tracking-tight '>
    Available Colors    
    </h3>
    </div>

    <div className="flex items-center space-x-4">
  {/* Label for delete action */}
  <p className="text-xs text-red-500">Click to delete</p>

  {/* Badges */}
  <div className="flex flex-wrap space-x-2">
    {selectedCat.colors.map((color) => (
      <Badge
        key={color.value}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
         setIsColorDeleteOpen(true);
          setColorId(color.id);
        }} 
      >
        {color.label}
      </Badge>
    ))}
  </div>
</div>



    <div className='flex items-center justify-center my-4'>
    <h3 className='text-xl font-bold tracking-tight '>
    Add Colors    
    </h3>
    </div>

                {/* category colors */}
                <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
              <CardHeader>
                <CardTitle>Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[10%]">Label</TableHead>
                      <TableHead className="w-[10%]">Value</TableHead>
                      <TableHead className="w-[12%]">Tw</TableHead>
                      <TableHead>FrontImageUrl</TableHead>
                      <TableHead>BackImageUrl</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colors.map((color, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">
                          <Input
                            type="text"
                            placeholder="Black"
                            value={color.label}
                            onChange={(e) => {
                              const newColors = [...colors];
                              newColors[index].label = e.target.value;
                              setColors(newColors);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="black"
                            value={color.value}
                            onChange={(e) => {
                              const newColors = [...colors];
                              newColors[index].value = e.target.value;
                              setColors(newColors);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="zinc-900"
                            value={color.tw}
                            onChange={(e) => {
                              const newColors = [...colors];
                              newColors[index].tw = e.target.value;
                              setColors(newColors);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                        <SingleImageDropzone
                        className="border border-blue-800"
                        width={200}
                        height={200}
                        value={color.frontImage!}
                        onChange={(file) => {
                          const newColors = [...colors];
                          newColors[index].frontImage = file!;
                          setColors(newColors);
                        }}
                      />
                        </TableCell>
                        <TableCell>
                        <SingleImageDropzone
                        className="border border-blue-800"
                        width={200}
                        height={200}
                        value={color.backImage!}
                        onChange={(file) => {
                          const newColors = [...colors];
                          newColors[index].backImage = file!;
                          setColors(newColors);
                        }}
                      />
                        </TableCell>
                        <TableCell>
                          <X
                            className="text-gray-600 hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveColor(index)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1" onClick={handleAddColor}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Color
                </Button>
              </CardFooter>
            </Card>


            <div className="my-4">
            {/* Save Category Button */}
            <Button size="sm" onClick={handleSaveCategory}>
              Save Category
            </Button>
            </div>


                </>

                
    )}
        </div>
      </>
      ) : (
       <div className='flex h-full flex-col items-center justify-center space-y-1'>
        <div
          aria-hidden='true'
          className='relative mb-4 h-40 w-40 text-muted-foreground'>
          <NextImage
            src='/hippo-empty-cart.png'
            loading='eager'
            alt='empty shopping cart hippo'
          />
        </div>
        <h3 className='font-semibold text-2xl'>
          No Categories found for now !
        </h3>
      </div>
) }

    </div>
    
    <LoadingState isOpen={open} />

    </>
  )
}

export default CategoryView
