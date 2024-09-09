'use client'

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Notification } from "@prisma/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { deleteNotificationById, markNotificationAsViewed } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
interface NotiViewProps {
  notifications: Notification[];
}

const ViewNotification = ({ notifications }: NotiViewProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const router = useRouter();
  const { toast } = useToast()
  const Delete = async (Id : string) =>{

    try {
        setOpen(true)
        const res = await deleteNotificationById(Id)
        if(res){
          toast({
            title: "Notifications was deleted!",
            variant: "default",
          });
          setOpen(false)
          router.refresh()
        }else{
          setOpen(false)
          toast({
            title: "Something went wrong!",
            variant: "destructive",
          });
        }
        
      } catch (error) {
        setOpen(false)
        console.log(error)
        toast({
            title: "Notifications was not deleted!",
          variant: "destructive",
        });
      }

  }


  const updateNotification = async (id :string) =>{
    if(!id) return
    await markNotificationAsViewed(id)
  }



  return (
    <>

      <p className="text-sm text-gray-700 mb-2">SellerDashboard/Notifications</p>
      <h1 className="text-2xl font-semibold mb-8">All Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Total : {notifications.length}</CardDescription>
          <CardDescription>View your Notifications.</CardDescription>
          <CardDescription>Unread notifications is marked with <span className="text-blue-500">blue color</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Received At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  className={notification.isViewed ? "" : "border-l-4 border-blue-500"}
                >                  
                <TableCell className={notification.isViewed ? "" : " text-blue-500"}>{notification.sender}</TableCell>
                  <TableCell className={notification.isViewed ? "" : " text-blue-500"}>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal size={16}  />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            setSelectedNotification(notification)
                            updateNotification(notification.id)
                          }}
                            className={notification.isViewed ? "" : " text-blue-500"}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className={!notification.isViewed ? "" : " text-red-500"} onClick={() => Delete(notification.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedNotification && (
        <AlertDialog open={selectedNotification !== null} onOpenChange={() => setSelectedNotification(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Notification Content</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="text-gray-600">{selectedNotification.content}</div>
            <AlertDialogCancel onClick={()=>router.refresh()} className="w-20">Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      )}

<LoadingState isOpen={open} />

    </>
  );
};

export default ViewNotification;
