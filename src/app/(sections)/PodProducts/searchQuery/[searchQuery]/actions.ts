'use server'

import { db } from "@/db";

// search query : 
export async function searchProducts(query: string) {
    try {
      const decodedQuery = decodeURIComponent(query); // Decode the URI-encoded query string
      const keywords = decodedQuery.split(' ').filter(keyword => keyword.trim() !== ''); // Split decoded query into keywords
  
      const products = await db.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: decodedQuery,
                mode: 'insensitive', // Case insensitive search for title
              },
            },
            {
              title: {
                contains: decodedQuery.replace(/\s+/g, ''), // Match products with exact title (ignoring spaces)
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: decodedQuery,
                mode: 'insensitive', // Case insensitive search for description
              },
            },
            {
              tags: {
                hasSome: keywords, // Match products with any tag from the decoded query keywords
              },
            },
            {
              category: {
                contains: decodedQuery,
                mode: 'insensitive', // Case insensitive search for category
              },
            },
          ],
          isProductAccepted : true
        },
        include: {
          store: true, // Include related store information if needed
        },
      });
  
      // If no products found and query is a phrase, try searching with the exact phrase in the title
      if (products.length === 0 && decodedQuery.includes(' ')) {
        const exactTitleProducts = await db.product.findMany({
          where: {
            title: {
              contains: decodedQuery,
              mode: 'insensitive', // Case insensitive search for exact phrase in title
            },
          },
          include: {
            store: true,
          },
        });
  
        return exactTitleProducts;
      }
  
      return products; // Return the matched products
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }