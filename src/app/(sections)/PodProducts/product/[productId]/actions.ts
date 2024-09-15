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
      return null
    }
  }

// Server Action: Track product views
export async function trackProductView(productId: string) {
  const session = await auth(); // NextAuth session for logged-in users
  const clientIp = headers().get('x-forwarded-for') || headers().get('remote-addr'); // Get user's IP address
  
  let userId = session?.user?.id || null;
  let sessionId = !userId ? getClientSessionId() : null; // Generate session ID for non-logged-in users

  let existingView
  if(userId) {
 // Check if the product has already been viewed by this user
      existingView = await db.productViews.findFirst({
      where: {
       productId,
       userId: userId ,
    }
    });
  }
  else if (sessionId) {
 // Check if the product has already been viewed by this session
      existingView = await db.productViews.findFirst({
        where: {
          productId,
          sessionId: sessionId ,
      }
      });

  }else {
     // Check if the product has already been viewed by this session
     existingView = await db.productViews.findFirst({
      where: {
        productId,
        ipAddress: clientIp,
    }
    });
  }


  // If no existing view found, record the view
  if (!existingView) {
    await db.productViews.create({
      data: {
        productId: productId,
        userId: userId,
        sessionId: sessionId,
        ipAddress: clientIp,
      }
    });

    // Optionally, increment the product view count in the product table
    await db.product.update({
      where: { id: productId },
      data: { totalViews: { increment: 1 } },
    });
  }
}

// Helper function: Generate a unique session ID for anonymous users
function getClientSessionId() {
  // Create a unique session ID for anonymous users (using UUID or any other method)
  return crypto.randomUUID();
}
  