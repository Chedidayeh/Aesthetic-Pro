'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import React from 'react'
import Link from "next/link"
import { CircleUser, Menu, MoreHorizontal, OctagonAlert, Package2, Search, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import LoadingState from "@/components/LoadingState"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { addTopBarContent, deleteTopBarContent, updateCreation, updatePlatformData, updateStoreCreation } from "./actions"
import { Platform } from '@prisma/client';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"


interface ViewProps {
    platform : Platform
}


const SettingsView = ({ platform }: ViewProps ) => { 



    const router = useRouter();
    const { toast } = useToast()
    const [selectedSection, setSelectedSection] = useState("general");
    const [open, setOpen] = useState<boolean>(false);
    const [newContent, setNewContent] = useState("");

    const [isStoreCreationEnabled, setIsStoreCreationEnabled] = useState(!platform.closeStoreCreation);

    const [isCreationEnabled, setIsCreationEnabled] = useState(!platform.closeCreation);


    const [updatedPlatformData, setUpdatedPlatformData] = useState({
        maxProductSellerProfit: platform.maxProductSellerProfit,
        ExtraDesignForProductPrice:platform.ExtraDesignForProductPrice,
        maxDesignSellerProfit: platform.maxDesignSellerProfit,
        platformDesignProfit: platform.platformDesignProfit,
        clientDesignPrice:platform.clientDesignPrice,
        shippingFee: platform.shippingFee,
        maxProductQuantity: platform.maxProductQuantity,
        affiliateUserProfit : platform.affiliateUserProfit,
        freeShippingFeeLimit : platform.freeShippingFeeLimit
      });

    const handleAddContent = async () => {
        try {
            setOpen(true);
            // Call the function to add new content
            const res = await addTopBarContent(platform.id, newContent);
            if (res) {
                setOpen(false);
                toast({
                    title: 'Content Added Successfully',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Failed to Add Content',
                    variant: 'destructive',
                });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        }
    };




    const handleDeleteContent = async (content: string) => {
        try {
            setOpen(true);
            const res = await deleteTopBarContent(platform.id, content);
            if (res) {
                setOpen(false);
                toast({
                    title: 'Content Deleted Successfully',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Failed to Delete Content',
                    variant: 'destructive',
                });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        }
    };


    const handleToggleStoreCreation = async () => {
        try {
            setOpen(true);
            const res = await updateStoreCreation(platform.id, isStoreCreationEnabled);
            if (res) {
                setIsStoreCreationEnabled(!isStoreCreationEnabled);
                setOpen(false);
                toast({ title: 'Store Creation Updated Successfully', variant: 'default' });
                router.refresh();
            } else {
                setOpen(false);
                toast({ title: 'Failed to Update Store Creation', variant: 'destructive' });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setOpen(false);
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    const handleToggleCreation = async () => {
      try {
          setOpen(true);
          const res = await updateCreation(platform.id, isCreationEnabled);
          if (res) {
              setIsCreationEnabled(!isCreationEnabled);
              setOpen(false);
              toast({ title: 'Creation Updated Successfully', variant: 'default' });
              router.refresh();
          } else {
              setOpen(false);
              toast({ title: 'Failed to Update Creation', variant: 'destructive' });
              router.refresh();
          }
      } catch (error) {
          console.log(error);
          setOpen(false);
          toast({ title: 'Error', variant: 'destructive' });
      }
  };


    const handleUpdatePlatformData = async () => {
        try {
          setOpen(true);
          const res = await updatePlatformData(platform.id, updatedPlatformData);
          if (res) {
            setOpen(false);
            toast({ title: "Platform Data Updated Successfully", variant: "default" });
            router.refresh();
          } else {
            setOpen(false);
            toast({ title: "Failed to Update Platform Data", variant: "destructive" });
            router.refresh();
          }
        } catch (error) {
          console.log(error);
          setOpen(false);
          toast({ title: "Error", variant: "destructive" });
        }
      };

  return (
    <>


    <div className="flex min-h-screen w-full flex-col">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 rounded-2xl bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <nav
                    className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                >
                    <Link href="#" className={`font-semibold ${selectedSection === "general" ? "text-primary" : ""}`} onClick={() => setSelectedSection("general")}>
                        General
                    </Link>
                    <Link href="#" className={`font-semibold ${selectedSection === "StoreCreation" ? "text-primary" : ""}`} onClick={() => setSelectedSection("StoreCreation")}>
                        Store Creation
                    </Link>
                    <Link href="#" className={`font-semibold ${selectedSection === "Creation" ? "text-primary" : ""}`} onClick={() => setSelectedSection("Creation")}>
                        Creation
                    </Link>
                    <Link href="#" className={`font-semibold ${selectedSection === "data" ? "text-primary" : ""}`} onClick={() => setSelectedSection("data")}>
                        Platform Data
                    </Link>
                </nav>
                <div className="grid gap-6">
                    {selectedSection === "general" && (
                                <Card>
                                <CardHeader>
                                    <CardTitle>Top Bar</CardTitle>
                                    <CardDescription>Add content.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input 
                                        placeholder="Add a line" 
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                    />
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button onClick={handleAddContent}>Add</Button>
                                </CardFooter>
                            </Card>
                    )}

                    {selectedSection === "general" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Top Bar</CardTitle>
                                <CardDescription>
                                    contents: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Phrase</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                                {platform.topBarContent.map((phrase, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{phrase}</TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteContent(phrase)}
                                                                    >
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                            </Table>     
                           </CardContent>

                        </Card>

                    )}

                        {selectedSection === "StoreCreation" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Store Creation</CardTitle>
                                <CardDescription>
                                    Configure Store Creation: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="flex items-center space-x-2">
                                            <Switch
                                                id="store-creation-switch"
                                                checked={isStoreCreationEnabled}
                                                onCheckedChange={handleToggleStoreCreation}
                                            />
                                            <Label htmlFor="store-creation-switch">{!platform.closeStoreCreation ? "Disable Store Creation" : "Enable Store Creation"}</Label>
                                        </div>    
                           </CardContent>

                        </Card>

                    )}

                    {selectedSection === "Creation" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Creation</CardTitle>
                                <CardDescription>
                                    Configure Creation: 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="flex items-center space-x-2">
                                            <Switch
                                                id="creation-switch"
                                                checked={isCreationEnabled}
                                                onCheckedChange={handleToggleCreation}
                                            />
                                            <Label htmlFor="creation-switch">{!platform.closeCreation ? "Disable Creation" : "Enable Creation"}</Label>
                                        </div>    
                           </CardContent>

                        </Card>

                    )}

                    {selectedSection === "data" && (
                            <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Platform Data</CardTitle>
                                <CardDescription>
                                    Configure Platform Data : 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Max Product Seller Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.maxProductSellerProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              maxProductSellerProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Extra Design For Product Price</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.ExtraDesignForProductPrice}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              ExtraDesignForProductPrice: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max Design Seller Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.maxDesignSellerProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              maxDesignSellerProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Platform Design Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.platformDesignProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              platformDesignProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>client Design Price</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.clientDesignPrice}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              clientDesignPrice: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Shipping Fee</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.shippingFee}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              shippingFee: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max Product Quantity</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.maxProductQuantity}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              maxProductQuantity: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>affiliate User Profit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.affiliateUserProfit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              affiliateUserProfit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Free Shipping Fee Limit</Label>
                        <Input
                          type="number"
                          value={updatedPlatformData.freeShippingFeeLimit}
                          onChange={(e) =>
                            setUpdatedPlatformData({
                              ...updatedPlatformData,
                              freeShippingFeeLimit: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleUpdatePlatformData}>Update</Button>
                  </CardFooter>
                        </Card>

                    )}
                    
                </div>
                
            </div>
        </main>
    </div>


    <LoadingState isOpen={open} />

</>
  )
}

export default SettingsView
