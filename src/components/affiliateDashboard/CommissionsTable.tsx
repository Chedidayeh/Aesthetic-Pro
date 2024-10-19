'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '../ui/use-toast';
import { Input } from '../ui/input';

interface AffiliateCommission {
  commissionId: string;
  affiliateLinkId: string;
  productTitle: string;
  profit: number;
  createdAt: Date;
}


interface AffiliateStats {
  totalIncome: number;
  totalClicks: number;
  totalSales: number;
}

interface CommissionsTableProps {
  commissions: AffiliateCommission[]
  affiliateStats: AffiliateStats;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({ commissions, affiliateStats }) => {
  const { toast } = useToast();
  const [sortedCommissions, setSortedCommissions] = useState<AffiliateCommission[]>(commissions);

  const [searchTerm, setSearchTerm] = useState(''); // Search input state

  // Update search term and filter the commissions
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue); // Update the search term
  };

  // Filter the commissions by Commission Id or Affiliate Link Id
  useEffect(() => {
    let filteredCommissions = [...commissions];

    if (searchTerm) {
      filteredCommissions = filteredCommissions.filter(
        (commission) =>
          commission.commissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commission.affiliateLinkId.toLowerCase().includes(searchTerm.toLowerCase())||
          commission.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSortedCommissions(filteredCommissions);
  }, [searchTerm, commissions]);

  const handleSortChange = (value: string) => {
    let sorted = [...commissions];

    if (value === 'high-profit') {
      sorted.sort((a, b) => b.profit - a.profit);
    } else if (value === 'low-profit') {
      sorted.sort((a, b) => a.profit - b.profit);
    }

    setSortedCommissions(sorted);
    toast({ title: `Sorted by ${value === 'high-profit' ? 'High Profit' : 'Low Profit'}` });
  };

  return (
    <>
      <Card className="xl:col-span-4 md:col-span-2 hidden sm:block">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Commissions</CardTitle>
            <CardDescription>Total: {commissions ? commissions.length : 0}</CardDescription>
            <CardDescription>Total Commissions Profit: {commissions ? (affiliateStats.totalIncome.toFixed(2)) : 0.00} TND</CardDescription>

          </div>
        </CardHeader>
        <CardDescription className="px-4 gap-2">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2">
        <Input
              type="search"
              className='w-full'
              placeholder="Search by Commission Id , Link Id or Product title..."
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
                <SelectItem value="high-profit">High Profit</SelectItem>
                <SelectItem value="low-profit">Low Profit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
        </CardDescription>
        <CardContent>
          {sortedCommissions && (
            <ScrollArea className="w-full h-72 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commission Id</TableHead>
                    <TableHead>Affiliate Link Id</TableHead>
                    <TableHead>Product Title</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCommissions.map((commission) => (
                    <TableRow key={commission.commissionId}>
                      <TableCell>{commission.commissionId}</TableCell>
                      <TableCell>{commission.affiliateLinkId}</TableCell>
                      <TableCell>{commission.productTitle}</TableCell>
                      <TableCell>{commission.profit.toFixed(2)} TND</TableCell>
                      <TableCell>
                      {new Date(commission.createdAt).toLocaleString()}
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default CommissionsTable;
