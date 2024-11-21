'use server'

import { cookies, headers } from 'next/headers'; // for working with cookies

import { db } from "@/db";
import { auth } from '@/auth';


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
    }
  }

// Server Action: Track product views
export async function trackProductView(
  productId: string, 
  sessionId: string, 
  userId?: string
) {
  try {
    let existingView;

    if (userId) {
      // Check for an existing view with the given userId
      existingView = await db.productViews.findFirst({
        where: {
          productId,
          userId,
        },
      });
    }

    if (!existingView) {
      // If no existing view is found for userId, check for sessionId
      existingView = await db.productViews.findFirst({
        where: {
          productId,
          sessionId,
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const isSameDay =
      existingView &&
      existingView.viewedAt &&
      new Date(existingView.viewedAt).setHours(0, 0, 0, 0) === today.getTime();

    // If no existing view or existing view is from a different day, create a new one
    if (!existingView || !isSameDay) {
      await db.productViews.create({
        data: {
          productId,
          sessionId,
          userId: userId || null, // Store userId if available, otherwise null
        },
      });

      // Optionally, increment the product view count
      await db.product.update({
        where: { id: productId },
        data: { totalViews: { increment: 1 } },
      });
    }
  } catch (error) {
    console.error("Error tracking product view:", error);
  }
}






  