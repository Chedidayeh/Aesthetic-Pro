'use server'

import { db } from "@/db";
import { Product, Store } from "@prisma/client";


interface Productswithstore extends Product {
    store : Store
  }

export async function fetchDiscountProductsDeals(): Promise<Productswithstore[] | null> {
    try {
      const products = await db.product.findMany({
        where : {isProductAccepted : true , NewProduct : true , isDiscountEnabled : true},
        orderBy: {
          createdAt: 'desc'
        },
        include : {
          store : true
        }
      });


  
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return null;
    }
  }
