'use server'

import { db } from "@/db";

export async function fetchProducts(page: number, limit: number, sortBy?: string) {
    const offset = Math.max((page - 1) * limit, 0); // Ensure non-negative offset
  
    // Map supported sort options to Prisma `orderBy` format
    const sortOptions: Record<string, object> = {
      high: { price: 'desc' }, // Sort by highest price
      low: { price: 'asc' },  // Sort by lowest price
      sales: { totalSales: 'desc' }, // Sort by most sold
    };
  
    // Fallback to default sorting if `sortBy` is invalid or not provided
    const orderBy = sortOptions[sortBy!] || { totalViews: 'desc' };
  
    const products = await db.product.findMany({
      where: {
        isProductAccepted: true,
        privateProduct: false
      },
      orderBy, // Dynamically apply sorting
      include: {
        store: true
      },
      skip: offset,
      take: limit,
    });
  
    const totalCount = await db.product.count({
      where: {
        isProductAccepted: true,
        privateProduct: false
      },
    }); // Total count for pagination
  
    return { products, totalCount };
  }
  
  