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

export async function updateStoreCreation(platformId: string, closeStoreCreation: boolean) {
  try {
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: { closeStoreCreation : closeStoreCreation },
    });
    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update store creation setting:", error);
    return null;
  }
}

export async function updateCreation(platformId: string, closeCreation: boolean) {
  try {
    const updatedPlatform = await db.platform.update({
      where: { id: platformId },
      data: { closeCreation : closeCreation },
    });
    if(closeCreation === true){
      await createNotificationForAllStores("Hi Sellers, product and design creation is temporarily paused. " , "Admin")
    }else{
      await createNotificationForAllStores("Hi Sellers, Great news! The product and design creation features are now back online. Happy designing! " , "Admin")
    }
    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update store creation setting:", error);
    return null;
  }
}




import { Platform } from "@prisma/client";
import { createNotificationForAllStores } from "../notifications/action";

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
        ExtraDesignForProductPrice : updatedData.ExtraDesignForProductPrice,
        affiliateUserProfit : updatedData.affiliateUserProfit,
        freeShippingFeeLimit : updatedData.freeShippingFeeLimit
      },
    });

    return updatedPlatform;
  } catch (error) {
    console.error("Failed to update platform data:", error);
    return null;
  }
};

