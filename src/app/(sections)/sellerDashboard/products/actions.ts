'use server'

import { db } from "@/db";
import { sendLevelUpEmail } from "@/lib/mailer";
import { Collection } from "@prisma/client";

interface UpdateProductArgs {
  productId: string;
  newTitle: string;
  selectedCollection : string


  }


export const updateProduct = async ({ productId, newTitle , selectedCollection }: UpdateProductArgs) => {
    try {
      let collection = await db.collection.findUnique({
        where: { name: selectedCollection },
      });

      if(collection) {
        const updatedProduct = await db.product.update({
          where: { id: productId },
          data: {
              title: newTitle,
              collectionName : selectedCollection,
              collectionId: collection.id,
            },
        });
        return updatedProduct;
      }


    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update design in product');
    }
  };

  export const deleteProduct = async (productId: string) => {
    try {
      // Start a transaction to ensure atomicity
      const result = await db.$transaction(async (transaction) => {
        // Check if the product has any order items
        const orderItemCount = await transaction.orderItem.count({
          where: { productId: productId },
        });
  
        if (orderItemCount > 0) {
          // Product has order items, do not delete
          return false;
        }
  
        // Delete the product
        await transaction.product.delete({
          where: { id: productId },
        });
  
        return true;
      });
  
      if (!result) {
        return false
      }
  
      return true
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product from the database');
    }
  };
  
