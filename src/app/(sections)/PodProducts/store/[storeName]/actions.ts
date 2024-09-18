'use server'

import { db } from "@/db";

// Function to update the totalLikes of a store based on a boolean value
export async function updateStoreLikes(storeId : string , userId : string , increment : boolean) {
    try {
      if (increment) {
        // Add a like record
        await db.like.create({
          data: {
            storeId: storeId,
            userId: userId,
          },
        });
        
        // Increment the totalLikes field
        const updatedStore = await db.store.update({
          where: { id: storeId },
          data: {
            totalLikes: {
              increment: 1,
            },
          },
        });
  
        return updatedStore.totalLikes;
      } else {
        // Remove the like record
        await db.like.deleteMany({
          where: {
            storeId: storeId,
            userId: userId,
          },
        });
        
        // Decrement the totalLikes field
        const updatedStore = await db.store.update({
          where: { id: storeId },
          data: {
            totalLikes: {
              decrement: 1,
            },
          },
        });
  
        return updatedStore.totalLikes;
      }
    } catch (error) {
      console.error("Error updating store's totalLikes:", error);
      throw error; // Propagate the error for handling elsewhere
    }
  }


// check if the user likes the store
export async function checkUserLike(storeId : string, userId : string) {
    try {
      // Query the likes table to check if a record exists for the given user and store
      const like = await db.like.findFirst({
        where: {
          storeId: storeId,
          userId: userId,
        },
      });
  
      // If a like record exists, the user has liked the store
      return !!like; // Returns true if like exists, otherwise false
    } catch (error) {
      console.error('Error checking if user likes the store:', error);
      throw error; // Propagate the error for handling elsewhere
    }
  }



// Function to get store's products and designs by store Name
export async function getStoreProducts(storeName: string) {
  try {
    // Find the store for the given storeId and userId
    const store = await db.store.findFirst({
      where: {
        storeName: storeName,
      },
      include: {
        products: {
          where : { isProductAccepted : true , privateProduct : false},
          include : {
            store : true
          },
          orderBy : {
            totalViews : "desc"
          }
        },
      },
    });

    if (!store) {
      // If the store doesn't exist or doesn't belong to the user, return null or handle accordingly
      return null; // or throw new Error('Store not found or does not belong to the user.');
    }

    // Return the products and designs of the store
    return store
  } catch (error) {
    console.error("Error fetching store's products and designs:", error);
    throw error; // Propagate the error for handling elsewhere
  }
}


export async function getDesignsByStoreId(storeId: string) {
  try {
    const sellersDesigns = await db.sellerDesign.findMany({
      where: {
        storeId: storeId,
        isDesignForSale: true,
        isDesignAccepted: true,
      },
    });

    return sellersDesigns;
  } catch (error) {
    console.log(error)
  }

}


export async function getAllPodProductsStores() {
  const stores = await db.store.findMany();
  return stores.map(store => store.storeName);
}
