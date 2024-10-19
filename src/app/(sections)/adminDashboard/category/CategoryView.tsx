'use client'

import Image from "next/image"
import { MoreHorizontal, OctagonAlert } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Category, Color , Size } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { apply, changePrice, deleteCategoryAndAssociated, resetPricesByCategory } from "./actions"
import LoadingState from "@/components/LoadingState"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CatWithInfos extends Category {
    colors : Color[]
    sizes : Size[]
}

interface CatProps {
    categories : CatWithInfos[]
}

const CategoryView: React.FC<CatProps> = ({ categories }) => {
  const router = useRouter();
  const { toast } = useToast()
  const [isEditOpen, setisEditOpen] = useState(false);
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const [isDiscountOpen, setisDiscountOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState(0); // State for managing the discount percentage
  const [newPrice, setnewPrice] = useState(0); // State for managing the discount percentage

  const [ catId , setCatId] = useState("")
  const [open, setOpen] = useState<boolean>(false);



    // fucntion : applyDiscount
    const editCat = async () => {

      try {
        setOpen(true)
        await changePrice(catId , newPrice)
        toast({
          title: "Price was changed",
          variant: "default",
        });
        setOpen(false)



      
    } catch (error) {
      console.log(error)
      toast({
        title: "operation failed",
        variant: "destructive",
      }); 
      setOpen(false)

        }

      }

  const deleteCat = async () => {

    try {
      setisDeleteOpen(false)
      setOpen(true)
      const res = await deleteCategoryAndAssociated(catId)

      if(res){
        toast({
          title: "Category was deleted",
          variant: "default",
        });
        setOpen(false)
  
      }
      else {
        toast({
          title: "Category was not deleted",
          variant: "destructive",
        });
        setOpen(false)

  
      }
      
    } catch (error) {
      console.log(error)
      toast({
          title: "deleting failed",
          variant: "destructive",
        }); 
        setOpen(false)
    }

  }



  // fucntion : applyDiscount
  const applyDiscount = async (discount : number) => {

      try {
        setOpen(true)
        await apply(catId , discount)
        toast({
          title: "Discount was applied",
          variant: "default",
        });
        setOpen(false)



      
    } catch (error) {
      console.log(error)
      toast({
        title: "Discount failed",
        variant: "destructive",
      }); 
      setOpen(false)

        }

      }


        // fucntion : resetPrice
  const resetPrice = async () => {

    try {
      setOpen(true)
      await resetPricesByCategory(catId)
      toast({
        title: "Products Prices was reset",
        variant: "default",
      });
      setOpen(false)


    
  } catch (error) {
    console.log(error)
    toast({
      title: "Operation failed",
      variant: "destructive",
    }); 
    setOpen(false)

      }

    }
  return (
    <>

<AlertDialog open={isEditOpen}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Modify Category Price</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="newPrice">New Price:</Label>
            <div className="col-span-3">
              <Input 
                id="newPrice" 
                type="number" 
                required 
                value={newPrice} // Controlled input value
                onChange={(e) => setnewPrice(parseInt(e.target.value))} // Handle input change
                min={1}
                max={100}
              />

            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setisEditOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
          onClick={()=>{
            setisEditOpen(false)
            editCat(); // Pass the discount value to applyDiscount function
          }}>        
          Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

<AlertDialog open={isDiscountOpen}>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Applying Discount</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="discount">Discount percentage:</Label>
            <div className="col-span-3">
              <Input 
                id="discount" 
                type="number" 
                required 
                value={discountValue} // Controlled input value
                onChange={(e) => setDiscountValue(parseInt(e.target.value))} // Handle input change
                min={0}
                max={100}
              />

            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setisDiscountOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
          onClick={()=>{
            setisDiscountOpen(false)
            applyDiscount(discountValue); // Pass the discount value to applyDiscount function
          }}>        
          Confirm Discount
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

                            {/* The AlertDialog delete design component  */}
                            <AlertDialog open={isDeleteOpen}>
               <AlertDialogTrigger asChild>
                         </AlertDialogTrigger>
                            <AlertDialogContent>
                                   <AlertDialogHeader className="flex flex-col items-center">
                                       <div className="text-red-500 mb-2">
                                           <OctagonAlert className=''/>
                                               </div>
                                              <AlertDialogTitle className="text-xl font-bold text-center">
                                                 Are you absolutely sure you want to delete this category ?
                                               </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   This action cannot be undone. 
                                                   It will permanently remove the category from our MarketPlace.<br/><br/>
                                                    </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                              <AlertDialogCancel onClick={()=>setisDeleteOpen(false)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteCat()} 
                                     className='bg-red-500 hover:bg-red-500' >Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>

<p className="text-sm text-gray-700 mb-2">AdminDashboard/Category</p>
<h1 className="text-2xl font-semibold">Manage Categories</h1>

<Link href="/adminDashboard/category/addCategory" className="mt-4"><Button variant={"link"}>Add Category</Button></Link>
<Link href="/adminDashboard/category/tryCategory" className="mt-4"><Button variant={"link"}>Try Category</Button></Link>


    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          Total : {}
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Table>
  <TableHeader>
    <TableRow>
      {/* Category Id column */}
      <TableHead className="hidden sm:table-cell">Category Id</TableHead>

      {/* Category Label column */}
      <TableHead>Category Label</TableHead>

      {/* Category Price column */}
      <TableHead>Category Price</TableHead>

      {/* Category Colors column */}
      <TableHead className="hidden md:table-cell">Category Colors</TableHead>

      {/* Category Sizes column */}
      <TableHead className="hidden lg:table-cell">Category Sizes</TableHead>

      {/* Action column */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {categories.map((category) => (
      <TableRow key={category.id}>
        {/* Category Id cell */}
        <TableCell className="hidden sm:table-cell">{category.id}</TableCell>

        {/* Category Label cell */}
        <TableCell>{category.label}</TableCell>

        {/* Category Price cell */}
        <TableCell>{category.price.toFixed(2)} TND</TableCell>

        {/* Category Colors cell */}
        <TableCell className="hidden md:table-cell">
          {category.colors.map((color) => (
            <Badge key={color.id} className="mr-1">
              {color.label}
            </Badge>
          ))}
        </TableCell>

        {/* Category Sizes cell */}
        <TableCell className="hidden lg:table-cell">
          {category.sizes.map((size) => (
            <Badge key={size.id} className="mr-1">
              {size.label}
            </Badge>
          ))}
        </TableCell>

        {/* Action cell */}
        <TableCell>
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
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisEditOpen(true);
              }}>Edit Price</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisDeleteOpen(true);
              }}>Delete</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                setisDiscountOpen(true);
              }}>Apply Discount</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                setCatId(category.id);
                resetPrice();
              }}>Reset Prices</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>

    <LoadingState isOpen={open} />


    </>
  )
}

export default CategoryView