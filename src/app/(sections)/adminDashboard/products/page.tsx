'use server'
import React from "react"
import ProductView from "./ProductView"
import { getAllProductsWithDesigns } from "./actions"
import { unstable_noStore as noStore } from "next/cache"

const Page = async () => {
  noStore();
  
  try {
    const products = await getAllProductsWithDesigns();

    return (
        <ProductView products={products} />
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return
  }
}

export default Page;