'use client'
import { db } from "@/db";
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
import { Ban, CircleX, X } from "lucide-react";
import { banUser, deleteUserById, getUsersByType, updateUserRole } from "@/actions/actions";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import LoadingState from "../LoadingState";




const UsersTable = () => {

  const router = useRouter();
  const { toast } = useToast()

  
  const [users, setUsers] = useState<User[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

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

  const handleFilterChange = (value : string) => {
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

  const [open, setOpen] = useState<boolean>(false);


  const handleDelete = async (userId : string) => {
    try {
          setOpen(true)
          await deleteUserById(userId);
          toast({
            title: 'User Was Successfully Deleted',
            variant: 'default',
          });
          setOpen(false)
          router.refresh()
      
    } catch (error) {
      console.log(error)
      setOpen(false)
        toast({
          title: 'Error : User Was not Deleted',
          variant: 'destructive',
        });
    }
  }  

  const handleBan = async (userId: string) => {
    try {
      setOpen(true);
      // Update the user's banned status to true
      await banUser(userId)
      toast({
        title: "User has been banned successfully",
        variant: "default",
      });
      setOpen(false);
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      setOpen(false);
      toast({
        title: "Failed to ban the user",
        variant: "destructive",
      });
    }
  };
  


  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setOpen(true)
      // Convert the string value to the UserType enum
      const userTypeEnum = newRole.toUpperCase() as UserType;
  
      await updateUserRole(userId, userTypeEnum);
      toast({
        title: 'User role updated successfully',
        variant: 'default',
      });
      setOpen(false)
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      setOpen(false)
      toast({
        title: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };
  

  

  return (
<>



<Card className="xl:col-span-4 md:col-span-2 hidden sm:block" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Users</CardTitle>
          <CardDescription>Total: {filteredUsers? filteredUsers.length : 0}</CardDescription>

        </div>
      </CardHeader>
      <CardDescription className="flex items-center justify-center gap-2">
        <Input
          type="search"
          className="w-[40%] "
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
                <TableHead>User Type</TableHead>
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
                    <TableCell>
                    <div className="flex space-x-2">
                      <CircleX onClick={() => handleDelete(user.id)} className="hover:text-red-500 cursor-pointer" />
                    {!user.isUserBanned && (
                      <Ban onClick={() => handleBan(user.id)} className="hover:text-purple-500 cursor-pointer" />
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

    <LoadingState isOpen={open} />


    </>
  );
};

export default UsersTable;