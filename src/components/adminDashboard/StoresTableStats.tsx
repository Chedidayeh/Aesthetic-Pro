"use client";
import NextImage from 'next/image';
import React from "react";
import { Button } from "../ui/button";
import { getStoreStats } from "@/actions/actions";
import LoadingState from "../LoadingState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChartData {
  storeId : string
  store: string;
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  totalDesigns: number;
  totalFollowers: number;
  totalViews: number;
  logo: string;
}

const chartConfig = {
  totalRevenue: {
    label: "Total Revenue",
    color: "hsl(var(--chart-1))",
  },
  totalSales: {
    label: "Total Sales",
    color: "hsl(var(--chart-2))",
  },
  totalProducts: {
    label: "Total Products",
    color: "hsl(var(--chart-3))",
  },
  totalDesigns: {
    label: "Total Designs",
    color: "hsl(var(--chart-5))",
  },
  totalFollowers: {
    label: "Total Followers",
    color: "hsl(var(--chart-1))",
  },
  totalViews: {
    label: "Total Views",
    color: "hsl(var(--chart-2))",
  },
} satisfies Record<string, { label: string; color: string }>;

// Accept storeId as a prop
export function StoresTableStats() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getStoreStats();
        setChartData(data);
      } catch (err) {
        console.error("Error fetching store stats:", err);
      }
    };

    fetchChartData();
  }, []);

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    "totalRevenue"
  );

  const sortedChartData = React.useMemo(
    () =>
      [...chartData]
        .sort((a, b) => b[activeChart] - a[activeChart]) // Sort descending
        .slice(0, 10) // Take only the top 10
        .map((item, index) => ({ ...item, rank: index + 1 })), // Add rank
    [activeChart, chartData]
  );

  // Calculate total values for each metric
  const totalValues = React.useMemo(() => {
    const totals = {
      totalRevenue: 0,
      totalSales: 0,
      totalProducts: 0,
      totalDesigns: 0,
      totalFollowers: 0,
      totalViews: 0,
    };

    chartData.forEach((item) => {
      totals.totalRevenue += item.totalRevenue;
      totals.totalSales += item.totalSales;
      totals.totalProducts += item.totalProducts;
      totals.totalDesigns += item.totalDesigns;
      totals.totalFollowers += item.totalFollowers;
      totals.totalViews += item.totalViews;
    });

    return totals;
  }, [chartData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Store Stats</CardTitle>
        <CardDescription>
            <p>Total stores is : {chartData.length} </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {Object.keys(chartConfig).map((key) => (
            <Button
              variant={activeChart === key ? "default" : "secondary"}
              size="sm"
              key={key}
              onClick={() => setActiveChart(key as keyof typeof chartConfig)}
            >
              {chartConfig[key as keyof typeof chartConfig].label}
            </Button>
          ))}
        </div>

        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
             <TableHead className="px-4 py-2 text-left">Logo</TableHead>
              <TableHead className="px-4 py-2 text-left">Rank</TableHead>
              <TableHead className="px-4 py-2 text-left">Store</TableHead>
              <TableHead className="px-4 py-2 text-left">
                {chartConfig[activeChart].label}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedChartData.map((item) => (
              <TableRow key={item.store}>
                <TableCell className="px-4 py-2">
                  <NextImage
                    src={item.logo}
                    alt={`${item.store} logo`}
                    className="w-20 h-20 rounded-full bg-slate-50"
                    width={300}
                    height={300}
                  />
                </TableCell>
                <TableCell className="px-4 py-2">{item.rank}</TableCell>
                <TableCell className="px-4 py-2">{item.store}</TableCell>
                <TableCell className="px-4 py-2">{item[activeChart]} {activeChart==="totalRevenue" ? "TND" : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Display total value for the active chart */}
          <tfoot>
            <TableRow>
              <TableCell colSpan={3} className="px-4 py-2 text-right font-bold">
               {chartConfig[activeChart].label}:
              </TableCell>
              <TableCell className="px-4 py-2">
                {totalValues[activeChart]} {activeChart === "totalRevenue" ? "TND" : ""}
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </CardContent>
    </Card>
  );
}
