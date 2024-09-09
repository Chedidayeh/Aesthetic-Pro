'use server'

import { db } from "@/db";

export async function getAllDesignsWithProducts() {
    try {
      const designs = await db.sellerDesign.findMany({
        where : {isDesignForSale : true},
        include: {
          frontProducts: true,
          backProducts: true,
          store : true,
          frontOrders : true ,
          backOrders : true
        },
      });
      return designs;
    } catch (error) {
      console.error('Error retrieving designs:', error);
      throw error;
    } 
  }