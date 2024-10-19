'use server'

import { db } from "@/db";
import { Platform } from "@prisma/client";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from 'uuid';


export async function getAffiliateIdByUserId(userId: string) {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true, // Only select the affiliate ID
      },
    });
    if (!affiliate) {
      throw new Error('Affiliate not found for the given user');
    }
    return affiliate.id;
  } catch (error) {
    console.error('Error fetching affiliate:', error);
    throw new Error('Failed to retrieve affiliate ID');
  }
}

export const generateShortAffiliateLink = async (platform : Platform , originalAffiliateLink : string , productId: string, affiliateId: string) => {
  try {
    // Start a transaction to handle operations atomically
    const result = await db.$transaction(async (prisma) => {
      // Check if an affiliate link already exists for this product and affiliate
      const existingLink = await prisma.affiliateLink.findFirst({
        where: {
          affiliateId,
          productId
        }
      });

      // If an existing link is found, return null (or a custom message)
      if (existingLink) {
        return null;  // Link already exists
      }

      // Generate a cryptographically secure random 6-byte string (12 characters in hex)
      const code = randomBytes(6).toString('hex');

        const shortLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`;

              // fetch the product price :
      const product = await prisma.product.findUnique({
        where: {
          id: productId
          },
    })
      // calculate amount based on product price
      // Calculate commission amount based on platform.affiliateUserProfit
      const commissionAmount = product?.price! * (platform.affiliateUserProfit / 100);

      // Extract the integer part
      const integerPart = Math.floor(commissionAmount);

      // Create a new affiliate link
      const affiliateLink = await prisma.affiliateLink.create({
        data: {
          affiliateId,
          productId,
          link: shortLink,
          originalLink : originalAffiliateLink,
          code,
          probableProfit : integerPart
        }
      });




      return shortLink;
    });

    return result;

  } catch (error) {
    console.error('Error generating affiliate link:', error);
    // Handle the error appropriately, e.g., return an error message or throw an exception
    throw new Error('Failed to generate affiliate link');
  } 
}


