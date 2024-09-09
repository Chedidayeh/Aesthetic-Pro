'use server'

import { db } from "@/db";


export async function getCategory(categoryLabel: string) {
  try {
    const category = await db.category.findFirst({
      where: {label : categoryLabel}
    });


    // Extract the labels from the sizes
    return category;
  } catch (error) {
    console.error(error);
    return null
  }
}


export async function getSizes(categoryLabel: string) {
    try {
      const category = await db.category.findFirst({
        where: {
          label: categoryLabel,
        },
        include: {
          sizes: true,
        },
      });
  
  
      // Extract the labels from the sizes
      const sizeLabels = category!.sizes.map(size => size.label);
      return sizeLabels;
    } catch (error) {
      console.error(error);
      return null
    }
  }

  export async function getAllProductIds() {
    const products = await db.product.findMany();
    return products.map(product => product.id); 
  }
  