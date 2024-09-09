'use client'

import { Loader2, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"


const SearchQuery = ()=>{
    const router = useRouter()
    const [isPending, setisPending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = () => {
        setisPending(true)
        router.push(`/PodProducts/searchQuery/${searchQuery}`)      
    };
    
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
      };

    return (

      <>
      <AlertDialog open={isPending}>
    <AlertDialogTrigger asChild>
    </AlertDialogTrigger>
    <AlertDialogContent className="flex flex-col items-center">
      <AlertDialogHeader className="flex flex-col items-center">
        <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
          Searching for products !
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col items-center">
          This will take a moment.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Loader2 className="text-blue-700 h-[15%] w-[15%] animate-spin mt-3" />
      </AlertDialogContent>
  </AlertDialog>
  
  
        <div className='flex gap-4 items-center mt-4'>
            <Input
              type="search"
              className="w-[500px] border-2 border-blue-500 bg-gray-100"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleChange}
            />
            <Button disabled={searchQuery === ""} onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
                Search
                <Search size={20} className='ml-1' />
            </Button>            
      </div>

      </>
    )

}

export default SearchQuery