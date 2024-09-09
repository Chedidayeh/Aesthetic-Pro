'use server'

import { db } from "@/db";


export async function getAllProductsWithDesigns() {
    try {
      const products = await db.product.findMany({
        include: {
          store : true,
          frontDesign: true,
          backDesign: true,
          order : true
        },
      });
      return products;
    } catch (error) {
      console.error('Error retrieving products:', error);
      throw error;
    } 
  }