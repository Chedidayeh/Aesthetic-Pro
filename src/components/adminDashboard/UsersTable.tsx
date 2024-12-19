'use client'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { User, UserType } from "@prisma/client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Ban, CircleX } from "lucide-react";
import { banUser, deleteUserById, getUsersByType, updateUserRole } from "@/actions/actions";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const UsersTable = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersByType();
      setUsers(users);
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearchQuery =
      user.id.includes(searchQuery) ||
      user.name!.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? user.userType === filter.toUpperCase() : true;
    return matchesSearchQuery && matchesFilter;
  });

  const handleDelete = async () => {
    try {
      if (selectedUserId) {
        await deleteUserById(selectedUserId);
        toast({
          title: 'User Was Successfully Deleted',
          variant: 'default',
        });
        setOpenDeleteDialog(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setOpenDeleteDialog(false);
      toast({
        title: 'Error : User Was not Deleted',
        variant: 'destructive',
      });
    }
  };

  const handleBan = async () => {
    try {
      if (selectedUserId) {
        await banUser(selectedUserId);
        toast({
          title: "User has been banned successfully",
          variant: "default",
        });
        setOpenBanDialog(false);
        router.refresh();
      }
    } catch (error) {
      setOpenBanDialog(false);
      toast({
        title: "Failed to ban the user",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userTypeEnum = newRole.toUpperCase() as UserType;
      await updateUserRole(userId, userTypeEnum);
      toast({
        title: 'User role updated successfully',
        variant: 'default',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="col-span-full" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Total: {filteredUsers ? filteredUsers.length : 0}</CardDescription>
          </div>
        </CardHeader>
        <CardDescription className="flex items-center justify-center gap-2">
          <Input
            type="search"
            className="w-[40%]"
            placeholder="Enter users Id, username, email to make a search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                <SelectItem value="user">USER</SelectItem>
                <SelectItem value="seller">SELLER</SelectItem>
                <SelectItem value="admin">ADMIN</SelectItem>
                <SelectItem value="factoryAdmin">FACTORYADMIN</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardDescription>
        <CardContent>
          {filteredUsers && (
            <ScrollArea className="w-full h-72 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Id</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead>Is Email verified</TableHead>
                    <TableHead>Is User banned</TableHead>
                    <TableHead>Is User Affiliate</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Creation Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
                      <TableCell>{user.isUserBanned ? "Yes" : "No"}</TableCell>
                      <TableCell>{user.isAffiliate ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.userType.toLowerCase()}
                          onValueChange={(newValue) => handleRoleChange(user.id, newValue as UserType)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select User Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>User Type</SelectLabel>
                              {Object.values(UserType).map((role) => (
                                <SelectItem key={role.toLowerCase()} value={role.toLowerCase()}>
                                  {role.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <CircleX
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setOpenDeleteDialog(true);
                            }}
                            className="hover:text-red-500 cursor-pointer"
                          />
                          {!user.isUserBanned && (
                            <Ban
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setOpenBanDialog(true);
                              }}
                              className="hover:text-purple-500 cursor-pointer"
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white">Delete</AlertDialogAction>
          <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openBanDialog} onOpenChange={setOpenBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban this user? This action can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleBan} className="bg-red-500 text-white">Ban</AlertDialogAction>
          <AlertDialogCancel onClick={() => setOpenBanDialog(false)}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTable;
