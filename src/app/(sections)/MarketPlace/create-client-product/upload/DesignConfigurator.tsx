/* eslint-disable react/no-unescaped-entities */
'use client' 
 
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Pica from 'pica';

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
import {  ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
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


import { RootState } from '@/store/reducers/reducers';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ChevronsUpDown, CircleCheckBig, CircleDollarSign, FileText, FolderPen, Loader, Loader2, MousePointerClick, Receipt, Smile, Tags } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toPng } from 'html-to-image';
import { SingleImageDropzone } from '@/components/sellerDashboard/SingleImageDropzone';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getUserPreOrderByUserId, savePreOrderB, savePreOrderF, savePreOrderFB1, savePreOrderFB2, savePreOrderFBClient, savePreOrderFBSeller, uploadDesignDataUrlToFirebase, uploadProductToFirebase } from "./actions"
import { getUser } from "@/actions/actions"
import Link from "next/link"
import { BackBorder, Category, Color, FrontBorder, Platform, SellerDesign, Size, Store, User } from "@prisma/client"
import LoadingState from "@/components/LoadingState"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllCategories } from "../select-category/actions"
import path from "path"
import { storage } from "@/firebase/firebaseConfig"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"



interface SellersDesignsData extends SellerDesign {
    store : Store
}

interface DesignConfiguratorProps {
  SellersDesignsData: SellersDesignsData[];
  categoryProduct : fetchedCat ;
  selectedCategory : fetchedCat
  platform : Platform
  user : User
}

interface fetchedCat extends Category {
  colors : Color[]
  sizes : Size[]
  frontBorders : FrontBorder[]
  backBorders : BackBorder[]
}

const DesignConfigurator: React.FC<DesignConfiguratorProps> = ({ SellersDesignsData , categoryProduct , selectedCategory , platform , user  }) => {

  const [categories, setCategories] = React.useState<fetchedCat[]>([])
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setOpen(true)
        const data = await getAllCategories()
        setCategories(data)
      } catch (error) {
        setOpen(false)
        console.log(error)

      } finally {
        setOpen(false)
      }
    }

    fetchCategories()
  }, [])


  const { toast } = useToast()
  const router = useRouter();
  const [selectedP, setSelectedProduct] = useState(selectedCategory ? selectedCategory : categoryProduct )

      // Define the types for the options state
      const [options, setOptions] = useState<{
        color: (typeof selectedP.colors)[number]; // Use typeof to infer the type of elements in the colors array
        size: (typeof selectedP.sizes)[number];
      }>({
        color: selectedP.colors[0], // Set the initial color based on the first element of the colors array
        size: selectedP.sizes[0],
      });


  const [selectedCat, setSelectedCat] = React.useState<number | null>(null);

  // to capture the mockups
  let FrontcontainerRef= useRef<HTMLDivElement>(null)
  let BackcontainerRef= useRef<HTMLDivElement>(null)
  // to trigger the alert dialog
  const alertDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const alertDialogCancelRef = useRef<HTMLButtonElement>(null);

  const [isBorderHidden, setIsBorderHidden] = useState(true);
  const [isBackBorderHidden, setisBackBorderHidden] = useState(true);

      // isClicked state
  const [isClicked, setIsClicked] = useState(false);

  const [selectedCatColor, setselectedCatColor] = useState<Color>(selectedP.colors[0]); // to change the category colors
  const MAX_FILE_SIZE = 5 * 1024 * 1024;


  // design  width and height
  const [Frontwidth, setFrontwidth] = React.useState<number>(3000);
  const [Frontheight, setFrontheight] = React.useState<number>(3000);
  const [Backwidth, setBackwidth] = React.useState<number>(3000);
  const [Backheight, setBackheight] = React.useState<number>(3000);


  const [selectedFrontDesignId, setselectedFrontDesignId] = useState<string>("");
  const [selectedBackDesignId, setselectedBackDesignId] = useState<string>("");
  const [selectedFrontDesign, setselectedFrontDesign] = useState<string>("");
  const [selectedBackDesign, setselectedBackDesign] = useState<string>("");
  const [selectedFrontIndex, setSelectedFrontIndex] = useState<Number | null>(null);
  const [selectedBackIndex, setSelectedBackIndex] = useState<Number | null>(null);

  

  // switch
  const [addFrontDesign, setAddFrontDesign] = useState(true);
  const [addBackDesign, setAddBackDesign] = useState(false);

  // order Data
  const [selectedColor, setSelectedColor] = useState(selectedP.colors[0].label);
  const [frontDesignPrice, setFrontDesignPrice] = useState(0);
  const [backDesignPrice, setBackDesignPrice] = useState(0);
  const [clientFrontDesignPrice, setclientFrontDesignPrice] = useState(0);
  const [clientBackDesignPrice, setclientBackDesignPrice] = useState(0);
  const selectedSize = options.size.label;
  const [quantity, setQuantity] = useState(1);
  const totalPrice = (selectedP.price + frontDesignPrice + backDesignPrice + clientFrontDesignPrice + clientBackDesignPrice )  * quantity
  const productPrice = selectedP.price + frontDesignPrice + backDesignPrice + clientFrontDesignPrice + clientBackDesignPrice




  const [FrontDesignFile, setFrontDesignFile] = useState<File>();
  const [BackDesignFile, setBackDesignFile] = useState<File>();



  // dahsed border dimentions:
  // front :
  const [frontBorderTop , setfrontborderTop] = useState(selectedP.frontBorders[0].value)
  const [frontBorderBottom , setfrontBorderBottom] = useState(selectedP.frontBorders[1].value)
  const [frontBorderRight , setfrontBorderRight] = useState(selectedP.frontBorders[2].value)
  const [frontBorderLeft , setfrontBorderLeft] = useState(selectedP.frontBorders[3].value)
  // Back :
  const [backBorderTop , setbackborderTop] = useState(selectedP.backBorders[0].value)
  const [backBorderBottom , setbackBorderBottom] = useState(selectedP.backBorders[1].value)
  const [backBorderRight , setbackBorderRight] = useState(selectedP.backBorders[2].value)
  const [backBorderLeft , setbackBorderLeft] = useState(selectedP.backBorders[3].value)








  const handleCatClick = (index: number , category : fetchedCat ) => {
    // border for front design
    setfrontborderTop(category.frontBorders[0].value)
    setfrontBorderBottom(category.frontBorders[1].value)
    setfrontBorderRight(category.frontBorders[2].value)
    setfrontBorderLeft(category.frontBorders[3].value)


    // border for back design
    setbackborderTop(category.backBorders[0].value)
    setbackBorderBottom(category.backBorders[1].value)
    setbackBorderRight(category.backBorders[2].value)
    setbackBorderLeft(category.backBorders[3].value)

    setSelectedProduct(category)
    setselectedCatColor(category.colors[0])
    setSelectedCat(prevState => prevState === index ? null : index);
    }



  function View (){
    setIsBorderHidden(true);
  }

  function notView (){
    setIsBorderHidden(false);
  }

  function ViewBack (){
    setisBackBorderHidden(true)
  }

  function notViewBack (){
    setisBackBorderHidden(false)
  }



  // Function to handle Front file upload
const handleFileChange = (file : File) => {
  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      setclientFrontDesignPrice(0)
      setFrontDesignFile(undefined)
      toast({
        title: 'File size exceeds the limit.',
        description: 'Please choose a file equal or smaller than 5MB.',
        variant: 'destructive',
      });

    } else {

      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) { 

          const dataUrl = e.target.result as string;
          const image = new Image();

          image.onload = () => {
            const { width, height } = image;
            setFrontwidth(width);
            setFrontheight(height);
            setIsBorderHidden(false);
            setselectedFrontDesign(dataUrl);
            setFrontDesignPrice(0)
            setclientFrontDesignPrice(platform.clientDesignPrice)
            setSelectedFrontIndex(null);

          };

          image.src = dataUrl;
        }
      };
      reader.readAsDataURL(file);

      

    }
  }
  
};

  // Function to handle Back file upload
  const handleBackFileChange = (file : File) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setBackDesignFile(undefined)
        setclientBackDesignPrice(0)
        toast({
          title: 'File size exceeds the limit.',
          description: 'Please choose a file equal or smaller than 5MB.',
          variant: 'destructive',
        });
  
      } else {
  
        const reader = new FileReader();
  
        reader.onload = (e) => {
          if (e.target) { 
  
            const dataUrl = e.target.result as string;
            const image = new Image();
  
            image.onload = () => {
              const { width, height } = image;
              setBackwidth(width);
              setBackheight(height);
              setisBackBorderHidden(false);
              setselectedBackDesign(dataUrl);
              setBackDesignPrice(0)
              setclientBackDesignPrice(platform.clientDesignPrice)
              setSelectedBackIndex(null)
            };
  
            image.src = dataUrl;
          }
        };
        reader.readAsDataURL(file);
  
        
  
      }
    }
  };


      // change color
    const handleColorChange = (color :any ) => {
      setselectedCatColor(color);
      setSelectedColor(color.label)    
    };

      //set quantity and update price
    const updatePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuantity(parseInt(e.target.value, 10));
    };



      //switch 
    const handleFrontSwitchChange = () => {
      setAddFrontDesign(!addFrontDesign);
      setFrontDesignPrice(0)
      setclientFrontDesignPrice(0)
      setSelectedFrontIndex(null)
      setselectedFrontDesignId("")
      setselectedFrontDesign("")
      setIsBorderHidden(true);
    };

    const handleBackSwitchChange = () => {
      setAddBackDesign(!addBackDesign);
      setBackDesignPrice(0)
      setclientBackDesignPrice(0)
      setSelectedBackIndex(null)
      setselectedBackDesignId("")
      setselectedBackDesign("")
      setisBackBorderHidden(true);

    };




    const handleFrontClick = (design: SellersDesignsData, index: number) => {
      if (selectedFrontIndex === index) {
        // If the clicked design is already selected, deselect it
        setSelectedFrontIndex(null);
        setselectedFrontDesign("");
        setFrontwidth(3000);
        setFrontheight(3000);
        setIsBorderHidden(true);
        setFrontDesignPrice(0);
        setselectedFrontDesignId("");
      } else {
        // Select the clicked design
        setSelectedFrontIndex(index);
        setselectedFrontDesign(design.imageUrl);
        setFrontwidth(design.width);
        setFrontheight(design.height);
        setIsBorderHidden(false);
        setFrontDesignPrice(design.price);
        setclientFrontDesignPrice(0)
        setselectedFrontDesignId(design.id);
      }
    };
    

    const handleBackClick = (design: SellersDesignsData, index: number) => {
      if (selectedBackIndex === index) {
        // If the clicked design is already selected, deselect it
        setSelectedBackIndex(null);
        setselectedBackDesign("");
        setBackwidth(3000);
        setBackheight(3000);
        setisBackBorderHidden(true);
        setBackDesignPrice(0);
        setselectedBackDesignId("");
      } else {
        // Select the clicked design
        setSelectedBackIndex(index);
        setselectedBackDesign(design.imageUrl);
        setBackwidth(design.width);
        setBackheight(design.height);
        setisBackBorderHidden(false);
        setBackDesignPrice(design.price);
        setclientBackDesignPrice(0)
        setselectedBackDesignId(design.id);
      }
    };
    


    // toggle Mode
    const [isDarkMode, setIsDarkMode] = useState(true);
    const handleToggleMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
    };



// Search query for designs
const [searchQuery, setSearchQuery] = useState('');
const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value);
};

// Sorting function based on sortBy criteria
const [sortBy, setSortBy] = useState<string>(''); // State for selected sort option

const filteredAndSortedDesigns = useMemo(() => {
  // Filter designs based on search query
  const filteredDesigns = (SellersDesignsData || []).filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    design.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    design.store.storeName.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

// Sort the filtered designs based on the selected sort option
return filteredDesigns.sort((a, b) => {
  switch (sortBy) {
    case 'low':
      return a.price - b.price;
    case 'high':
      return b.price - a.price;
    case 'sales':
      return b.totalSales - a.totalSales;
    default:
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
});


}, [SellersDesignsData, searchQuery , sortBy]);

const handleSortChange = (event: string) => {
  setSortBy(event);
};
  









  
         
         
         
            function base64ToBlob(base64: string, mimeType: string) {
              const byteCharacters = atob(base64)
              const byteNumbers = new Array(byteCharacters.length)
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
              }
              const byteArray = new Uint8Array(byteNumbers)
              return new Blob([byteArray], { type: mimeType })
            }

           
              
                
                const openDialog = () => {
                  if (alertDialogTriggerRef.current) {
                    alertDialogTriggerRef.current.click();
                  }
                };

                // function will cancel the dialog
                const closeDialog = () => {
                  if (alertDialogCancelRef.current) {
                    alertDialogCancelRef.current.click();
                  }
                };
     
                const uploadDesign = async (file: File) => {
                  const designNameWithoutExt = path.parse(file.name).name;
                  const storageRef = ref(storage, `orders/clients orders/${user.name}/clients designs/${designNameWithoutExt}-${Date.now()}.png`);
                
                  try {
                    const snapshot = await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    if(downloadURL) {
                      toast({
                       title: 'Design Upload Success',
                        description: 'Design image uploaded successfully!',
                        });
                        return downloadURL
                    }
                  } catch (error) {
                    console.error("Error uploading design:", error);
                    toast({
                    title: 'Upload Error',
                    description: 'Error uploading the image!',
                    variant: 'destructive',
                    });              
                  }
                }

                const uploadCapturedMockup = async (file: File) => {
                  const pica = new Pica(); // Correct instantiation
                
                  try {
                    // Create an image element
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    
                    // Wait for the image to load
                    await new Promise<void>((resolve) => {
                      img.onload = () => resolve();
                    });
                
                    // Create a canvas for resizing
                    const canvas = document.createElement('canvas');
                    const targetWidth = 800; // Set your desired width
                    const targetHeight = (img.height / img.width) * targetWidth; // Maintain aspect ratio
                
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                
                    // Use Pica to resize the image
                    await pica.resize(img, canvas);
                
                    // Convert the canvas to a Blob
                    const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
                      canvas.toBlob((blob) => {
                        if (blob) {
                          resolve(blob); // Resolve with the Blob
                        } else {
                          reject(new Error('Failed to convert canvas to Blob')); // Reject if null
                        }
                      }, 'image/png', 0.9); // Adjust quality (0.9 = 90%)
                    });
                
                    // Upload the optimized image
                    const storageRef = ref(storage, `orders/clients orders/${user.name}/clients products/${Date.now()}.png`);
                    const snapshot = await uploadBytes(storageRef, optimizedBlob);
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    
                    if (downloadURL) {
                      toast({
                        title: 'Product Image Upload Success',
                        description: 'Product image uploaded successfully!',
                      });
                      return downloadURL;
                    }
                  } catch (error) {
                    console.error('Error uploading image:', error);
                    toast({
                      title: 'Upload Failed',
                      description: 'There was an error uploading the product image. Please try again.',
                    });
                    throw error; // Optionally re-throw the error if needed
                  }
                };

 
                

                const savePreOrder = async () => {
                  try {

                    openDialog();
                    setIsClicked(true)
                    setIsBorderHidden(true);
                    setisBackBorderHidden(true);
                    
                    const user = await getUser();
                    const checkPreOrder = await getUserPreOrderByUserId(user!.id);
                    if (checkPreOrder) {
                      closeDialog();
                      showToast(
                        'You already made a preOrder!',
                        'You either confirm or delete that preOrder to make a new one!',
                        'destructive'
                      );
                      return;
                    }
                 

                
                    // Handle different design conditions
                    if (addFrontDesign && !addBackDesign) {
                      await handleFrontDesign(user!);
                    } else if (addBackDesign && !addFrontDesign) {
                      await handleBackDesign(user!);
                    } else if (addFrontDesign && addBackDesign) {
                      await handleBothDesigns(user!);
                    }
                  } catch (error) {
                    console.error(error);
                    showToast('Error!', 'Please try again later!', 'destructive');
            
                  }
                };
                
                const handleFrontDesign = async (user : User) => {
                  const img = document.querySelector(".front-product") as HTMLImageElement;
                  img.src = selectedCatColor.frontImageUrl;
                
                  if (frontDesignPrice === 0) {
                    const frontDesignPath = await uploadDesign(FrontDesignFile!);
                    await saveCapturedFrontDesign(user, frontDesignPath!, 'front', false);
                  } else {
                    const design = document.querySelector(".front-design") as HTMLImageElement;
                    if (design) {
                      design.src = selectedFrontDesign;
                    }        
                    await saveCapturedFrontDesign(user, selectedFrontDesignId, 'front', true);
                  }
                };
                
                const handleBackDesign = async (user : User) => {
                  const img = document.querySelector(".back-product") as HTMLImageElement;
                  img.src = selectedCatColor.backImageUrl;
                
                  if (backDesignPrice === 0) {
                    const backDesignPath = await uploadDesign(BackDesignFile!);
                    await saveCapturedBackDesign(user, backDesignPath!, 'back', false);
                  } else {
                    const design = document.querySelector(".back-design") as HTMLImageElement;
                    if (design) {
                    design.src = selectedBackDesign;
                    }        
                    await saveCapturedBackDesign(user, selectedBackDesignId, 'back', true);
                  }
                };
                
                const handleBothDesigns = async (user: User) => {
                  const frontImg = document.querySelector(".front-product") as HTMLImageElement;
                  frontImg.src = selectedCatColor.frontImageUrl;
                  const backImg = document.querySelector(".back-product") as HTMLImageElement;
                  backImg.src = selectedCatColor.backImageUrl;
            
                  if (frontDesignPrice === 0 && backDesignPrice !== 0) {
                    const frontDesignPath = await uploadDesign(FrontDesignFile!);
                    const design = document.querySelector(".back-design") as HTMLImageElement;
                    if (design) {
                      design.src = selectedBackDesign;
                    }
                    const paths = await saveCapturedBothDesigns();
                    const result = await savePreOrderFB1(user?.id!,frontDesignPath!,selectedBackDesignId,totalPrice,productPrice,quantity,selectedColor,selectedSize,selectedP.label,paths)
                    handleSaveResult(result);
                  }
                  else if (frontDesignPrice !== 0 && backDesignPrice === 0) {
                    const backDesignPath = await uploadDesign(BackDesignFile!);
                    const design = document.querySelector(".front-design") as HTMLImageElement;
                    if (design) {
                      design.src = selectedFrontDesign;
                      } 
                    const paths = await saveCapturedBothDesigns();
                    const result = await savePreOrderFB2(user?.id!,backDesignPath!,selectedFrontDesignId,totalPrice,productPrice,quantity,selectedColor,selectedSize,selectedP.label,paths)
                    handleSaveResult(result);
                  }
                  else if (frontDesignPrice !== 0 && backDesignPrice !== 0) {
                    const designFront = document.querySelector(".front-design") as HTMLImageElement;
                    if (designFront) {
                      designFront.src = selectedFrontDesign;
                      }
                    const designBack = document.querySelector(".back-design") as HTMLImageElement;
                    if (designBack) {
                      designBack.src = selectedBackDesign;
                        }
                    const paths = await saveCapturedBothDesigns();
                    const result = await savePreOrderFBSeller(user?.id!,selectedFrontDesignId,selectedBackDesignId,totalPrice,productPrice,quantity,selectedColor,selectedSize,selectedP.label,paths)
                    handleSaveResult(result);
                  }
                  else if (frontDesignPrice === 0 && backDesignPrice === 0) {
                    const frontDesignPath = await uploadDesign(FrontDesignFile!);
                    const backDesignPath = await uploadDesign(BackDesignFile!);
                    const paths = await saveCapturedBothDesigns();
                    const result = await savePreOrderFBClient(user?.id!,frontDesignPath!,backDesignPath!,totalPrice,productPrice,quantity,selectedColor,selectedSize,selectedP.label,paths)
                    handleSaveResult(result);
                  }
                
                };
                
            
                const saveCapturedFrontDesign = async (user : User, designPath : string, designType : string, isSellerDesign : boolean) => {
                  const containerRef = designType === 'front' ? FrontcontainerRef : BackcontainerRef;
                  const dataUrl = await toPng(containerRef.current!, { cacheBust: false, pixelRatio: 10 });
                
                  const file = getFile(dataUrl);
                  const capturedProductPath = await uploadCapturedMockup(file);
                  const paths = [capturedProductPath!];
                
                  const result = await savePreOrderF(user?.id!, designPath, totalPrice,productPrice, quantity, selectedColor, selectedSize, selectedP.label, paths, isSellerDesign);
                
                  handleSaveResult(result);
                };
            
            
                const saveCapturedBackDesign = async (user : User, designPath : string, designType : string, isSellerDesign : boolean) => {
                  const containerRef = designType === 'front' ? FrontcontainerRef : BackcontainerRef;
                  const dataUrl = await toPng(containerRef.current!, { cacheBust: false, pixelRatio: 10 });
                
                  const file = getFile(dataUrl);
                  const capturedProductPath = await uploadCapturedMockup(file);
                  const paths = [capturedProductPath!];
                
                  const result = await savePreOrderB(user?.id!, designPath, totalPrice,productPrice, quantity, selectedColor, selectedSize, selectedP.label, paths, isSellerDesign);
                
                  handleSaveResult(result);
                };
                
            
                const saveCapturedBothDesigns = async () => {
                  const frontDataUrl = await toPng(FrontcontainerRef.current!, { cacheBust: false, pixelRatio: 10 });
                  const backDataUrl = await toPng(BackcontainerRef.current!, { cacheBust: false, pixelRatio: 10 });
                
                  const frontFile = getFile(frontDataUrl);
                  const backFile = getFile(backDataUrl);
                
                  const frontCapturedPath = await uploadCapturedMockup(frontFile);
                  const backCapturedPath = await uploadCapturedMockup(backFile);
                
                  return [frontCapturedPath!, backCapturedPath!];
                };
                
                const handleSaveResult = (result : {
                  success: boolean;
                  preOrderId: string;
              } | {
                  success: boolean;
                  preOrderId: null;
              }) => {
                  if (result.success) {
                    showToast('Great!', 'PreOrder Saved successfully.', 'default');
                    router.push("/MarketPlace/create-client-product/preview?preOrderId=" + result.preOrderId);
                  } else {
                    closeDialog();
                    showToast('Error', 'Failed to Save preOrder! Please try again later.', 'destructive');
                  }
                };
                
                const showToast = (title : string, description : string, variant : any) => {
                  toast({ title, description, variant });
                };
                
            
                const getFile = (dataUrl : string) => {
                  const base64Data = dataUrl.split(',')[1];
                  const blob = base64ToBlob(base64Data, 'image/png');
                  return new File([blob], `order.png`, { type: 'image/png' });
                };



  return (

    <>
    <LoadingState isOpen={open} />


                      {/* The AlertDialog component */}
                      <AlertDialog>
                          <AlertDialogTrigger asChild ref={alertDialogTriggerRef}>
                            <button className="hidden">Hidden Trigger</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader className="flex flex-col items-center">
                              <div></div>
                              <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
                                Passing to shipping informations !
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col items-center">
                                This will take a moment.
                                {/* Replace Loader2 with your loader component */}
                                <Loader2 className="text-blue-700 h-[50%] w-[50%] animate-spin mt-3" />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogCancel className="hidden" ref={alertDialogCancelRef}>Cancel</AlertDialogCancel>
                          </AlertDialogContent>
                        </AlertDialog>






              <div className='relative mt-5 grid grid-cols-1  mb-20 pb-20'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:grid-cols-2">

                          {/* first card */}
                     <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                        <CardHeader className="py-2">
                        </CardHeader>
                        <CardContent className="items-center space-y-6 grid" >                          

                            



                                 {/* Switch component front */}
                                  <div className="flex items-center mt-4 space-x-2">
                                <Switch id="front" defaultChecked={addFrontDesign} onClick={handleFrontSwitchChange } />
                                <Label htmlFor="front">Add Front Design</Label>
                               </div>

                                {/* Switch component back */}
                              <div className="flex items-center mt-4 space-x-2">
                                <Switch  id="back" defaultChecked={addBackDesign} onClick={handleBackSwitchChange } />
                                <Label htmlFor="back">Add Back Design</Label>
                               </div>

                               {(addFrontDesign || addBackDesign)  && (

                                <>

                                {/* category selection */}
                                <h3>Change Category :</h3>
                             <div className="ml-5">
                                <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="secondary">Select</Button>
                              </SheetTrigger>
                              <SheetContent side="bottom" >
                                <SheetHeader>
                                  <SheetTitle>Select Category</SheetTitle>
                                  <SheetDescription>
                                  </SheetDescription>
                                </SheetHeader>

                                <div className="grid grid-cols-6 gap-1  bg-gray-900/5">
                                    {categories.map((category, index) => (
                                      <Card onClick={() => handleCatClick (index , category )} 
                                      key={index} className={cn("border w-48", selectedCat === index && "border-primary")}>
                                        <CardContent className="flex flex-col items-center justify-center p-2">
                                          <NextImage
                                            width={900}
                                            height={900}
                                            src={category.value!} 
                                            alt={category.label} 
                                            className="mb-2" 
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                          />
                                          <div className="flex flex-wrap justify-center gap-2">
                                            <Badge variant="secondary">{category.label}</Badge>
                                            <Badge variant="secondary">{category.price} TND</Badge>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>

                                <SheetFooter>
                                  <SheetClose asChild>
                                  </SheetClose>
                                </SheetFooter>
                              </SheetContent>
                              </Sheet>
                              </div>

                              <div className='space-y-2'>
                                <h3>Upload a Design:</h3>
                                <p className='text-xs text-zinc-500 ml-5'>PNG, JPG, JPEG max (5MB)</p>
                                <p className="text-xs text-zinc-500 ml-5">recommended (3000px*3000px)</p>
                                <p className='text-xs text-zinc-500 ml-5'>One Design will cost {platform.clientDesignPrice} TND !</p>  
                              <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 space-y-4 lg:space-y-0">
                                {/* front design input */}
                                {addFrontDesign && (
                                  <div>
                                    <SingleImageDropzone
                                      className="border border-blue-800"
                                      width={200}
                                      height={200}
                                      value={FrontDesignFile}
                                      onChange={(file) => {
                                        setFrontDesignFile(file);
                                        setclientFrontDesignPrice(platform.clientDesignPrice);
                                        if (!file) {
                                          setFrontDesignPrice(0);
                                          setclientFrontDesignPrice(0);
                                          setIsBorderHidden(true);
                                          setselectedFrontDesign("");
                                          setSelectedFrontIndex(null);
                                        }
                                        if (file) {
                                          handleFileChange(file);
                                        }
                                      }}
                                    />
                                  </div>
                                )}
                                
                                {/* back design input */}
                                {addBackDesign && (
                                  <div>
                                    <SingleImageDropzone
                                      className="border border-blue-800"
                                      width={200}
                                      height={200}
                                      value={BackDesignFile}
                                      onChange={(file) => {
                                        setBackDesignFile(file);
                                        setclientBackDesignPrice(platform.clientDesignPrice);
                                        if (!file) {
                                          setBackDesignPrice(0);
                                          setclientBackDesignPrice(0);
                                          setisBackBorderHidden(true);
                                          setselectedBackDesign("");
                                          setSelectedBackIndex(null);
                                        }
                                        if (file) {
                                          handleBackFileChange(file);
                                        }
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              </div>


                              {SellersDesignsData.length > 0 && (
                          <>
                            <h3>Or choose an Existing design:</h3>

                              <div className="flex items-center justify-center">
                              <Button variant="secondary" size="sm" className="w-[30%]" onClick={handleToggleMode}>
                              Toggle Mode
                            </Button>                              
                            </div>
                            <div>
                            <Input type="text" placeholder="Search for a design by name or by store name..." value={searchQuery} onChange={handleSearchChange} />
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center sm:mt-0 lg:mt-0 lg:flex-1">
                            <Select onValueChange={handleSortChange}>
                              <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Sort By" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Select</SelectLabel>
                                  <SelectItem value="high">Highest Price</SelectItem>
                                  <SelectItem value="low">Lowest Price</SelectItem>
                                  <SelectItem value="sales">Most Selled</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                            
                            {addFrontDesign && (

                              <>

                            <div className="flex items-center justify-center">
                            Front design
                            </div>


                              {/* designs scroll area */}
                              <ScrollArea 
                              className={cn(
                                'relative h-96 flex-1 my-16 w-full rounded-xl p-2 ring-1 ring-inset ring-gray-900 lg:rounded-2xl flex justify-center flex-col items-center',
                                isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
                              )}
                              >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 p-2">
                          {filteredAndSortedDesigns.map((design, index) => (
                                  <div key={index} className="flex flex-col items-center">
                                    <div
                                      className={`border rounded-md p-1 cursor-pointer ${selectedFrontIndex === index ? 'border-blue-500' : ''}`}
                                      onClick={() => handleFrontClick(design,index)}
                                    >
                                      <Badge variant={`${selectedFrontIndex === index ? 'default' : 'secondary' }`}>
                                        {design.price}TND
                                      </Badge>
                                      <NextImage
                                        alt={`front design image ${index + 1}`}
                                        className="aspect-square w-full rounded-md object-contain"
                                        loading="eager"
                                        blurDataURL="/Loading.png"
                                        placeholder="blur"
                                        height={1000}
                                        src={design.imageUrl}
                                        width={1000}
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                      />
                                    </div>
                                    <Badge variant={`${selectedFrontIndex === index ? 'default' : 'secondary' }`}>{design.name}</Badge>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>

                            </>

                            )}

                            {addBackDesign && (

                            <>

                            <div className="flex items-center justify-center">
                            Back design
                            </div>

                              {/* designs scroll area */}
                              <ScrollArea 
                              className={cn(
                                'relative h-96 flex-1 my-16 w-full rounded-xl p-2 ring-1 ring-inset ring-gray-900 lg:rounded-2xl flex justify-center flex-col items-center',
                                isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
                              )}
                              >
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 p-2">
                          {filteredAndSortedDesigns.map((design, index) => (
                                  <div key={index} className="flex flex-col items-center">
                                    <div
                                      className={`border rounded-md p-1 cursor-pointer ${selectedBackIndex === index ? 'border-blue-500' : ''}`}
                                      onClick={() => handleBackClick(design,index)}
                                    >
                                       <Badge variant={`${selectedBackIndex === index ? 'default' : 'secondary' }`}>
                                        {design.price}TND
                                      </Badge>
                                      <NextImage
                                        loading="eager"
                                        blurDataURL="/Loading.png"
                                        placeholder="blur"
                                        alt={`back design image ${index + 1}`}
                                        className="aspect-square w-full rounded-md object-contain"
                                        height={1000}
                                        src={design.imageUrl}
                                        width={1000}
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}                                      />
                                    </div>
                                    <Badge variant={`${selectedBackIndex === index ? 'default' : 'secondary' }`}>{design.name}</Badge>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>

                            </>

                              )}
                           </>
                          )}

                              </>
                              )}




                        </CardContent>
                        <CardFooter className="flex items-center justify-center">

                               {(addFrontDesign || addBackDesign)  && (

                                <>

                              {/* order details */}
                            <div className="flex-1 text-center"> 
                                <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="default">Create Order</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
                                <div className='flex flex-col gap-6 px-4 py-6'>
                                  
                                  {/* Colors */}
                                  <RadioGroup
                                    value={options.color}
                                    onChange={(val) => {
                                      setOptions((prev) => ({
                                        ...prev,
                                        color: val,
                                      }));
                                      handleColorChange(val); // Call handleColorChange to update the selected color
                                    }}
                                  >
                                    <Label>Color: {options.color.label}</Label>
                                    <div className='mt-3 flex flex-wrap gap-2'>
                                      {selectedP.colors.map((color: Color) => ( // Use selectedProduct.colors instead of colors
                                        <RadioGroup.Option
                                          key={color.label}
                                          value={color}
                                          className={({ active, checked }) =>
                                            cn(
                                              'relative flex cursor-pointer items-center justify-center rounded-full p-1 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                                              {
                                                [`border-${color.tw}`]: active || checked,
                                              }
                                            )
                                          }
                                        >
                                          <span
                                            className={cn(
                                              `bg-${color.tw}`,
                                              color.label === 'White' ? 'dark:bg-white' : `dark:bg-${color.tw}`,
                                              'h-8 w-8 rounded-full border border-black border-opacity-10'
                                            )}
                                          />
                                        </RadioGroup.Option>
                                      ))}
                                    </div>
                                  </RadioGroup>

                                  <div className='relative flex flex-col gap-3 w-full'>
                                    {/* Size */}
                                    <Label>Size</Label>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant='outline'
                                          role='combobox'
                                          className='w-full justify-between'>
                                          {options.size.label}
                                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        {selectedP.sizes.map((size: Size) => (
                                          <DropdownMenuItem
                                            key={size.value}
                                            className={cn(
                                              'flex text-sm gap-1 items-center p-1.5 cursor-default ',
                                              {
                                                '': size.label === options.size.label,
                                              }
                                            )}
                                            onClick={() => {
                                              setOptions((prev) => ({ ...prev, size }));
                                            }}>
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                size.label === options.size.label ? 'opacity-100' : 'opacity-0'
                                              )}
                                            />
                                            {size.label}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Quantity */}
                                    <Label>Quantity ( Min : 1 , Max : {platform.maxProductQuantity} )</Label>
                                    <Input type="number" value={quantity} onChange={updatePrice} min={1} max={platform.maxProductQuantity} />
                                  </div>

                                  <div className="text-center mt-4">
                                    <Button
                                      disabled={!((addFrontDesign && selectedFrontDesign !== "") 
                                        || !addFrontDesign) 
                                        || !((addBackDesign && selectedBackDesign !== "") 
                                        || !addBackDesign) || isClicked || quantity < 1 || quantity > platform.maxProductQuantity || !quantity}
                                      onClick={savePreOrder}
                                      size='default'
                                      className='w-full'>
                                      Pass To Order Confirmation
                                      <ArrowRight className='h-5 w-5 ml-1.5 inline' />
                                    </Button>
                                    
                                    <div className="mt-4">
                                      <Badge variant="outline" className="text-base">
                                        <span className="text-gray-600">Total: {totalPrice.toFixed(2)} TND</span> 
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>

                                </Popover>

                                <Link href="/MarketPlace/create-client-product/preview">
                            <Button variant="link">See Order Preview</Button>
                            </Link>

                                </div>

                                </>
                               )}



                      </CardFooter>
                      </Card>



     


                    {(addFrontDesign || addBackDesign) && (

                    <Card x-chunk="dashboard-05-chunk-3" className={cn(' lg:rounded-2xl shadow-lg')}>
                    <CardHeader className="px-7 flex flex-col items-center justify-center">

                    <RadioGroup
                                    value={options.color}
                                    onChange={(val) => {
                                      setOptions((prev) => ({
                                        ...prev,
                                        color: val,
                                      }));
                                      handleColorChange(val); // Call handleColorChange to update the selected color
                                    }}
                                  >
                                    <Label>Color: {options.color.label}</Label>
                                    <div className='mt-3 flex flex-wrap gap-2'>
                                      {selectedP.colors.map((color: Color) => ( // Use selectedProduct.colors instead of colors
                                        <RadioGroup.Option
                                          key={color.label}
                                          value={color}
                                          className={({ active, checked }) =>
                                            cn(
                                              'relative flex cursor-pointer items-center justify-center rounded-full p-1 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                                              {
                                                [`border-${color.tw}`]: active || checked,
                                              }
                                            )
                                          }
                                        >
                                          <span
                                            className={cn(
                                              `bg-${color.tw}`,
                                              color.label === 'White' ? 'dark:bg-white' : `dark:bg-${color.tw}`,
                                              'h-8 w-8 rounded-full border border-black border-opacity-10'
                                            )}
                                          />
                                        </RadioGroup.Option>
                                      ))}
                                    </div>
                                  </RadioGroup>

                          </CardHeader>
                      <CardContent >

                      { addFrontDesign  &&(

                        <>
                      <div className="text-center">
                        <h1 className='text-3xl font-extrabold'>Front Design</h1>
                      </div>
                      <div className='w-full h-px bg-zinc-200 my-5' />

                      <div ref={FrontcontainerRef}  className="relative">
                            <NextImage
                              src={selectedCatColor?.frontImageUrl || "" }
                              alt="Product"
                              width={3000}
                              height={3000}
                              className="rounded-2xl front-product"
                            />
                            <div className="absolute inset-0 rounded-2xl border-2">
                            <div 
                            style={{ top: frontBorderTop , bottom : frontBorderBottom , right : frontBorderRight , left: frontBorderLeft }} 
                            className={cn(`absolute  overflow-hidden ${!isBorderHidden ? 'rounded-md border-2 border-dashed border-gray-400' : ''}`)}>
                            <Rnd
                            default={{
                              x: 5,
                              y: 40,
                              height: Frontwidth /15,
                              width: Frontheight / 15,
                            }}
                            lockAspectRatio       
                            className={cn("absolute z-50", { 'border-[3px] border-primary': !isBorderHidden })}
                          >
                            <div className='relative w-full h-full'>
                              {selectedFrontDesign && (
                                <NextImage
                                  src={selectedFrontDesign}
                                  fill
                                  alt='your image'
                                  className='pointer-events-none object-contain front-design cursor-grab'
                                />
                              )}
                            </div>
                          </Rnd>
                            </div>
                            </div>

                          </div>

                                <div className="text-center">
                                  <Button className='mt-4'
                                    onMouseDown={View}
                                    onMouseUp={notView}
                                    disabled={!selectedFrontDesign} 
                                    >
                                    Hold to Preview
                                    <MousePointerClick className='ml-1'/>
                                  </Button>
                                </div>

                    <div className='w-full h-px bg-zinc-200 my-5' />
                    </>
                      )}


                      { addBackDesign  &&(

                        <>
                            <div className="text-center">
                              <h1 className='text-3xl font-extrabold'>Back Design</h1>
                              </div>
                            <div className='w-full h-px bg-zinc-200 my-5' />

                      <div ref={BackcontainerRef} className="relative">
                                <NextImage
                                  src={selectedCatColor?.backImageUrl || ""}
                                  alt="Product"
                                  width={3000}
                                  height={3000}
                                  className="rounded-2xl back-product "
                                />
                                <div className="absolute inset-0 rounded-2xl border-2">
                                <div 
                                style={{ top: backBorderTop , bottom : backBorderBottom , right : backBorderRight , left: backBorderLeft }} 
                                className={cn(`absolute  overflow-hidden ${!isBackBorderHidden ? 'rounded-md border-2 border-dashed border-gray-400' : ''}`)}>
                                <Rnd
                                default={{
                                  x: 5,
                                  y: 40,
                                  height: Backwidth /15,
                                  width: Backheight / 15,
                                }}
                                lockAspectRatio       
                                className={cn("absolute z-50", { 'border-[3px] border-primary': !isBackBorderHidden })}
                              >
                                <div className='relative w-full h-full'>
                                  {selectedBackDesign && (
                                    <NextImage
                                      src={selectedBackDesign}
                                      fill
                                      alt='your image'
                                      className='pointer-events-none object-contain cursor-grab back-design'
                                    /> 
                                  )}
                                </div>
                              </Rnd>
                                </div>
                                </div>

                          </div>

                                <div className="text-center">
                                      <Button className='mt-4'
                                        onMouseDown={ViewBack}
                                        onMouseUp={notViewBack}
                                        disabled={!selectedBackDesign} 
                                      >
                                        Hold to Preview
                                      <MousePointerClick className='ml-1'/>
                                      </Button>
                                    </div>
                          </>
                      )}

                    </CardContent>
                    <CardFooter className='relative flex flex-col items-center justify-center'>
                                <div className="text-center text-2xl">
                                  <Label className='text-lg'>
                                    <span className="text-blue-600 ">Guide</span>: Hold one of the blue edges and drag to resize
                                  </Label>
                                </div>
                    </CardFooter>
                    </Card>


                    )}





    

                              </div>
                            </div>
                            

                            </>
  
  );
};

export  default DesignConfigurator ;

