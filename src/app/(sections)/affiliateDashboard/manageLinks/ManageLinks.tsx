'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image";
import { Copy, MoreHorizontal } from "lucide-react";

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

import {  Affiliate, AffiliateLink, Commission, PaymentRequest, Platform, Product } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface ExtraAffiliateLink extends AffiliateLink {
  product : Product
  affiliate : Affiliate
  commission : Commission []
}


interface ViewProps {
  Links: ExtraAffiliateLink[];
  platform : Platform
}

const ManageLinks = ({ Links , platform }: ViewProps) => {

  const { toast } = useToast()

  const [filteredLinks, setFilteredLinks] = useState<ExtraAffiliateLink[]>(Links);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search input state
  const [sortOption, setSortOption] = useState<string>(''); // Sort option state

  // Handle the search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle the sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    // Trigger toast when sorting is done
    toast({
      title: `Sorted by ${value === 'views' ? 'Clicks and Views' : 'Profit'}`,
    });
  };

  // Filter and sort the links based on search term and sort option
  useEffect(() => {
    let filteredLinks = [...Links];

    // Filter based on search term (Product title, Affiliate Link ID, etc.)
    if (searchTerm) {
      filteredLinks = filteredLinks.filter((link) =>
        link.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on the selected sort option
    if (sortOption === 'views') {
      filteredLinks.sort((a, b) => b.totalViews - a.totalViews); // Sort by total views/clicks
    } else if (sortOption === 'profit') {
      filteredLinks.sort(
        (a, b) =>
          (b.product.price * (platform.affiliateUserProfit / 100)) -
          (a.product.price * (platform.affiliateUserProfit / 100))
      ); // Sort by profit
    }

    setFilteredLinks(filteredLinks);
  }, [searchTerm, sortOption, Links, platform.affiliateUserProfit]);

  const copyToClipboard = (link : string) => {
    navigator.clipboard.writeText(link!)
      .then(() => {
        toast({
          title: "Link is copied",
          variant: "default",
        });
      })
      .catch((err) => {
        console.error('Failed to copy the text: ', err);
      });
  };

  return (
    <>

      <p className="text-sm text-gray-700 mb-2">AffiliateDashboard/manageLinks</p>
      <h1 className="text-2xl font-semibold mb-8">All Links</h1>
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>Total : {Links.length}</CardDescription>
          {Links.length === 0 && (
          <CardDescription>
            <span className="text-blue-500">No special links are made for now !</span>
          </CardDescription>
             )}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">
        <Input
              type="search"
              className='w-full'
              placeholder="Search by Product title..."
              onChange={handleSearchChange}
              value={searchTerm}
            /> 

          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort Options</SelectLabel>
                <SelectItem value="views">Clicks and views</SelectItem>
                <SelectItem value="profit">Profit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>

          <p className="text-gray-600 text-sm">
        <span className="text-blue-600 font-medium">Guide :</span> Your profit depends on the order quantity !
          </p>

        </CardHeader>
        <CardContent>

        <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden md:table-cell">Link Id</TableHead>
                        <TableHead className="">Product Title</TableHead>
                        <TableHead className="">Product Price</TableHead>
                        <TableHead className="">Your Profit ( {platform.affiliateUserProfit}% on every sale made)</TableHead>
                        <TableHead>Total views and clicks</TableHead>
                        <TableHead>Total Link sales</TableHead>
                        <TableHead className="">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                            <TableCell className="hidden md:table-cell">{link.id}</TableCell>
                            <TableCell className="">{link.product.title}</TableCell>
                            <TableCell className="">{(link.product.price).toFixed(2)} TND</TableCell>
                            <TableCell className="">{(link.probableProfit.toFixed(2))} TND</TableCell>
                            <TableCell>{link.totalViews} views</TableCell>
                            <TableCell>{link.totalSales} sales</TableCell>
                            <TableCell className="">
                            <TooltipProvider>
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                       <Copy onClick={()=>copyToClipboard(link.link)} className="hover:text-green-500 cursor-pointer"/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-green-500">
                        <p>Copy Link</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
              </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </CardContent>
      </Card>

    </>
  );
};

export default ManageLinks;