"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "../ui/button";
import { getStoreStats } from "@/actions/actions";
import LoadingState from "../LoadingState";

interface ChartData {
  store: string;
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  totalDesigns: number;
  totalFollowers: number;
  totalLikes: number;
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
  totalLikes: {
    label: "Total Likes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function StoreChart() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getStoreStats();
        setChartData(data);
      } catch (err) {
        console.error("Error fetching store stats:", err);
      } finally {
      }
    };

    fetchChartData();
  }, []);

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(
    "totalRevenue"
  );

  const totalActiveMetric = React.useMemo(
    () =>
      chartData.reduce(
        (acc, curr) => acc + (curr[activeChart] as number),
        0
      ),
    [activeChart, chartData]
  );

  const sortedChartData = React.useMemo(
    () =>
      [...chartData]
        .sort((a, b) => b[activeChart] - a[activeChart]) // Sort descending
        .slice(0, 10) // Take only the top 10
        .map((item, index) => ({ ...item, rank: index + 1 })), // Add rank
    [activeChart, chartData]
  );

  return (
    <>
<Card className="w-full">
  <CardHeader className="mb-2">
    <CardTitle className="text-base">Stores Stats</CardTitle>
    <CardDescription className="text-sm"></CardDescription>
    <div className="flex flex-wrap sm:flex-nowrap">
      <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">
          {chartConfig[activeChart].label}
        </span>
        <span className="text-lg font-bold leading-none sm:text-3xl">
          {totalActiveMetric.toLocaleString()}
        </span>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig} className="h-72 sm:h-[400px]">
      <BarChart
        width={400}
        height={250}
        data={sortedChartData}
        layout="vertical"
        margin={{ left: 90 }}
      >
        <YAxis
          dataKey={(item) => `${item.rank}. ${item.store}`}
          type="category"
          tickLine={false}
          tickMargin={30}
          axisLine={false}
        />
        <XAxis type="number" hide={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey={activeChart}
          layout="vertical"
          radius={10}
          fill={chartConfig[activeChart].color}
        />
      </BarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter className="flex-col items-start gap-1 text-xs">
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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

  </CardFooter>
</Card>

    </>
  );
}
