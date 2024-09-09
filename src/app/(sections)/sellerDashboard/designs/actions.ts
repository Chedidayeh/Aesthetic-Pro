'use server'

import { db } from "@/db";

interface UpdateDesignArgs {
    designId: string;
    newName: string;
    newPrice:number
  }

export const updateDesign = async ({ designId, newName,newPrice }: UpdateDesignArgs) => {
    try {
      const updatedDesign = await db.sellerDesign.update({
        where: { id: designId },
        data: {
            name: newName,
            price: newPrice,
            sellerProfit: newPrice-2,
        },
      });
      return updatedDesign;
    } catch (error) {
      console.error('Error updating design:', error);
      throw new Error('Failed to update design in database');
    }
  };

  export const deleteDesign = async (designId: string) => {
    try {
      // Start a transaction to ensure atomicity
      const result = await db.$transaction(async (transaction) => {
        // Check if the design has any order items as front or back design
        const frontOrderItemCount = await transaction.orderItem.count({
          where: { frontsellerDesignId: designId },
        });
  
        const backOrderItemCount = await transaction.orderItem.count({
          where: { backsellerDesignId: designId },
        });
  
        // If the design has order items, do not delete
        if (frontOrderItemCount > 0 || backOrderItemCount > 0) {
          return false;
        }
  
        // Delete the seller design
        await transaction.sellerDesign.delete({
          where: { id: designId },
        });
  
        return true;
      });
  
      if (!result) {
        return false;
      }
  
      return true
    } catch (error) {
      console.error('Error deleting design:', error);
      throw new Error('Failed to delete design from the database');
    }
  };
  


