'use client'
import Link from "next/link"
import { CircleUser, Menu, OctagonAlert, Package2, Search } from "lucide-react"
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
import {  doesStoreNameExist, updateSocialLinks, updateStoreBio, updateStoreLogo, updateStoreName } from "./actions"
import { getStoreByUserId, getUser } from "@/actions/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { SingleImageDropzone } from "@/components/sellerDashboard/SingleImageDropzone"

export default function Page() {

    const router = useRouter();
    const { toast } = useToast()
    const [selectedSection, setSelectedSection] = useState("general");
    const [newStoreName, setNewStoreName] = useState("");
    const [storeBio, setStoreBio] = useState(""); 
    const [facebookLink, setFacebookLink] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [file, setFile] = useState<File>();

    const [open, setOpen] = useState<boolean>(false);

    const handleChangeStoreName = async () => {
        try {
            setOpen(true);
            const storeNameExist = await doesStoreNameExist(newStoreName);
            if (storeNameExist) {
                toast({
                    title: 'This Store name is used',
                    description : 'try other one!',
                    variant: 'destructive',
                  });
                  setOpen(false);
                  return
            }
            const user = await getUser()
            const store = await getStoreByUserId(user!.id)
            const res = await updateStoreName(store.id , newStoreName)
            if(res){
                setOpen(false);
                toast({
                    title: 'Store name Was Successfully changed',
                    variant: 'default',
                  });
                router.refresh()
            }
            else {
                setOpen(false);
                toast({
                    title: 'Store name Was not changed',
                    variant: 'destructive',
                  });
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
                });
                console.log(error)
            
        }
    }

    const handleAddSocialLinks = async () => {
        try {
            setOpen(true);
            const user = await getUser()
            const store = await getStoreByUserId(user!.id)
            const res = await updateSocialLinks(store.id, { facebook: facebookLink, instagram: instagramLink });
            if(res){
                setOpen(false);
                toast({
                    title: 'Social links were successfully updated',
                    variant: 'default',
                });
                router.refresh()
            } else {
                setOpen(false);
                toast({
                    title: 'Social links were not updated',
                    variant: 'destructive',
                });
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            setOpen(false);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        }
    }


    const handleUpdateStoreBio = async () => {  // New function to handle store bio update
        try {
            setOpen(true);
            const user = await getUser();
            const store = await getStoreByUserId(user!.id);
            const res = await updateStoreBio(store.id, storeBio);
            if (res) {
                setOpen(false);
                toast({
                    title: 'Store bio was successfully updated',
                    variant: 'default',
                });
                router.refresh();
            } else {
                setOpen(false);
                toast({
                    title: 'Store bio was not updated',
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

     // New function to handle the store logo update
     const handleUpdateStoreLogo = async () => {
        if (!file) {
            toast({
                title: 'No file selected',
                description: 'Please select a file to upload.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setOpen(true);
            const path = await uploadLogo(file);
            if (path) {
                const user = await getUser();
                const store = await getStoreByUserId(user!.id);
                const res = await updateStoreLogo(store.id, path); // Update the logo path in the database

                if (res) {
                    toast({
                        title: 'Store logo updated successfully',
                        variant: 'default',
                    });
                    router.refresh();
                } else {
                    toast({
                        title: 'Store logo update failed',
                        variant: 'destructive',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                variant: 'destructive',
            });
        } finally {
            setOpen(false);
        }
    };


                  // function to upload the seller logo in uploads folder and get the path
                  const uploadLogo = async (file : File) =>{
                    if (!file) {
                      console.log('No file selected.');
                      return;
                    }
    
                    try {
                      const data = new FormData()
                      data.set('file', file)
    
                      const res = await fetch('/api/uploadSellerStoreImg', {
                        method: 'POST',
                        body: data
                      })
    
                      // handle the error
                      if (!res.ok) throw new Error(await res.text())
    
                      // Parse response JSON
                      const result = await res.json()
    
                      // Check if success
                      if (result.success) {
                        const path = result.filePath
                        return path;    
                      
                      } else {
                        // Handle error if success is false
                        console.error('File upload failed:', result.error)
                        toast({
                          title: 'Something went wrong',
                          description: 'Error during seller front design upload. Please try again.',
                          variant: 'destructive',
                      });
                        return null;
                      }
                    } catch (e) {
                      // Handle network errors or other exceptions
                      console.error('Error during seller front design upload:', e)
                      toast({
                        title: 'Something went wrong',
                        description: 'Error during seller front design upload. Please try again.',
                        variant: 'destructive',
                    });
                    }
                  } 

    return (
        <>
            <div className="flex min-h-screen w-full flex-col">
                <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
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
                            <Link href="#" className={`font-semibold ${selectedSection === "SocialLinks" ? "text-primary" : ""}`} onClick={() => setSelectedSection("SocialLinks")}>
                                Social Links
                            </Link>
                        </nav>
                        <div className="grid gap-6">
                            {selectedSection === "general" && (
                                <>
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Store Name</CardTitle>
                                        <CardDescription>
                                            Change your store name.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    <Input 
                                            placeholder="New Store Name" 
                                            value={newStoreName}
                                            onChange={(e) => setNewStoreName(e.target.value)}
                                        />                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={handleChangeStoreName} disabled={newStoreName===""} >Change</Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                        <CardHeader>
                                            <CardTitle>Store Bio</CardTitle>
                                            <CardDescription>Add your store bio.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Input 
                                                placeholder="Describe your store" 
                                                value={storeBio} 
                                                onChange={(e) => setStoreBio(e.target.value)}
                                            />
                                        </CardContent>
                                        <CardFooter className="border-t px-6 py-4">
                                            <Button onClick={handleUpdateStoreBio} disabled={storeBio===""} >Add</Button> 
                                        </CardFooter>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Store Logo</CardTitle>
                                            <CardDescription>Change your store logo.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <SingleImageDropzone
                                                className="border border-blue-800"
                                                width={200}
                                                height={200}
                                                value={file}
                                                onChange={(file) => setFile(file)}
                                            />
                                        </CardContent>
                                        <CardFooter className="border-t px-6 py-4">
                                            <Button onClick={handleUpdateStoreLogo} disabled={!file}>Update</Button> {/* Use the new function */}
                                        </CardFooter>
                                    </Card>

                                </>
                            )}

                            {selectedSection === "SocialLinks" && (
                                <Card x-chunk="dashboard-04-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Social Links</CardTitle>
                                        <CardDescription>
                                            Add your social media links so clients can contact you for custom designs.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input 
                                            placeholder="Facebook link" 
                                            value={facebookLink}
                                            onChange={(e) => setFacebookLink(e.target.value)}
                                        />    
                                        <Input 
                                            placeholder="Instagram link" 
                                            value={instagramLink}
                                            onChange={(e) => setInstagramLink(e.target.value)}
                                        />  
                                    </CardContent>
                                    <CardFooter className="border-t px-6 py-4">
                                        <Button onClick={handleAddSocialLinks} disabled={facebookLink==="" && instagramLink===""} >Add</Button>
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