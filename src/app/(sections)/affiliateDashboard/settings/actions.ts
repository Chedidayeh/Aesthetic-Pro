'use server'

import { db } from "@/db";

export async function getAffiliateAccountByUserId(userId:string) {
  const affiliate = await db.affiliate.findUnique({
    where : {userId}
  })

  return affiliate
}

export async function deleteAccount(accountId : string, userId: string) {
  try {
     // Delete the store and all related records, and update the user type to "user"
     const account = await db.affiliate.findUnique({
      where: { id: accountId },
      });

      if (!account) {
          return false
      }

      if (account.userId !== userId) {
          return false
      }

      await db.$transaction([
          // Delete the store
          db.affiliate.delete({
              where: { id: accountId },
          }),
          // Update the user
          db.user.update({
              where: { id: userId },
              data: { isAffiliate: false },
          }),
      ]);
    return true
  } catch (error) {
    console.error('Error updating user type:', error);
    return false
  }
}


