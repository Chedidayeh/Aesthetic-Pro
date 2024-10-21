'use server'

import { db } from "@/db";
import { Collection } from "@prisma/client";

export async function getAllPodProductsCategories(decodedCollection : string) {
    try {
      const categories = await db.product.findMany({
        where : {isProductAccepted : true , collection : decodedCollection as Collection},
        select: {
          category: true,
        },
        distinct: ['category']
      });
      return categories.map(product => product.category);
    } catch (error) {
      console.error("Error retrieving categories:", error);
      throw error;
    }
  }

export async function getAllPodProductsCollection () {
  const products = await db.product.findMany({
    where: { isProductAccepted: true },
    select: {
      collection: true,
      },
  })
  return products.map(product => product.collection)
}