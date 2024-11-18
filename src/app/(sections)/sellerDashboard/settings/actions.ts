'use server'

import { db } from "@/db";

export async function updateStoreName(storeId: string, newStoreName: string) {
    try {
      const updatedStore = await db.store.update({
        where: { id: storeId },
        data: { storeName: newStoreName },
      });
      return true;
    } catch (error) {
      console.error('Error updating store name:', error);
      return false;

    }
  }

export async function doesStoreNameExist(storeName: string): Promise<boolean> {
    try {
      const store = await db.store.findFirst({
        where: { storeName: storeName },
      });
      return store !== null;
    } catch (error) {
      console.error('Error checking store name:', error);
      return false
    }
  }

export async function deleteStore(storeId : string, userId: string) {
  try {
     // Delete the store and all related records, and update the user type to "user"
     const store = await db.store.findUnique({
      where: { id: storeId },
      });

      if (!store) {
          return false
      }

      if (store.userId !== userId) {
          return false
      }

      await db.$transaction([
          // Delete the store
          db.store.delete({
              where: { id: storeId },
          }),
          // Update the user type
          db.user.update({
              where: { id: userId },
              data: { userType: "USER" },
          }),
      ]);
    return true
  } catch (error) {
    console.error('Error updating user type:', error);
    return false
  }
}


interface SocialLinks {
  facebook?: string;
  instagram?: string;
}

export async function updateSocialLinks(storeId: string, socialLinks: SocialLinks) {
  try {
      const updatedStore = await db.store.update({
          where: { id: storeId },
          data: {
              facebookLink : socialLinks.facebook,
              instagramLink : socialLinks.instagram
          },
      });

      return updatedStore;
  } catch (error) {
      console.error("Failed to update social links:", error);
      return null;
  }
}

export async function updateStoreBio(storeId: string, bio: string) {
  try {
      const updatedStore = await db.store.update({
          where: { id: storeId },
          data: {
              storeBio: bio,
          },
      });

      return updatedStore;
  } catch (error) {
      console.error("Failed to update store bio:", error);
      return null;
  }
}


export async function updateStoreLogo(storeId: string, logoPath: string) {
  try {
      const updatedStore = await db.store.update({
          where: { id: storeId },
          data: {
              logoUrl: logoPath,
          },
      });

      return updatedStore;
  } catch (error) {
      console.error("Failed to update store logo:", error);
      return null;
  }
}