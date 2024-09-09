'use server'

import { db } from "@/db";




export async function addTopBarContent(platformId : string, newContent : string) {
  try {
    const platform = await db.platform.update({
      where: { id: platformId },
      data: {
        topBarContent: {
          push: newContent
        }
      }
    });
    return true
  } catch (error) {
    console.error('Error adding content:', error);
    return false
  }
}




export async function deleteTopBarContent(platformId: string, contentToDelete: string) {
  try {
    // Fetch the current platform
    const platform = await db.platform.findUnique({
      where: { id: platformId },
    });

    if (!platform) {
      throw new Error('Platform not found');
    }

    // Update the topBarContent
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: {
        topBarContent: {
          set: platform.topBarContent.filter(phrase => phrase !== contentToDelete)
        }
      }
    });

    return updatedPlatform;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function updateStoreCreation(platformId: string, enableStoreCreation: boolean) {
  try {
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: { closeStoreCreation : enableStoreCreation },
    });
    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update store creation setting:", error);
    return null;
  }
}




import { Platform } from "@prisma/client";

export const updatePlatformData = async (
  platformId: string,
  updatedData: Partial<Platform>
): Promise<Platform | null> => {
  try {
    // Update platform data using Prisma
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: {
        maxProductSellerProfit: updatedData.maxProductSellerProfit,
        maxDesignSellerProfit: updatedData.maxDesignSellerProfit,
        platformDesignProfit: updatedData.platformDesignProfit,
        shippingFee: updatedData.shippingFee,
        maxProductQuantity: updatedData.maxProductQuantity,
        clientDesignPrice:updatedData.clientDesignPrice,
        ExtraDesignForProductPrice : updatedData.ExtraDesignForProductPrice
      },
    });

    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update platform data:", error);
    return null;
  }
};

