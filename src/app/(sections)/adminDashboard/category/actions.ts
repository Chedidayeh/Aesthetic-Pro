'use server'

import { db } from "@/db";

export async function getAllCategoriesWithDetails() {
    try {
      const categories = await db.category.findMany({
        include: {
          colors: true,
          sizes: true,
        },
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories with details:", error);
      throw error;
    }
  }



  export async function changePrice(catId: string,newPrice:number) {

    try {

      return await db.$transaction(async (prisma) => {
        // Step 1: Find the category by its id
        const category = await prisma.category.findUnique({
          where: { id: catId },
        });
    
        if (!category) {
          throw new Error(`Category with id ${catId} not found`);
        }
    
        // Step 2: Update the category's price
        await prisma.category.update({
          where: { id: catId },
          data: { price: newPrice },
        });
    
        // Step 3: Fetch all products that have the same category label as the found category
        const products = await prisma.product.findMany({
          where: { category: category.label },
        });
    
        // Step 4: Update the price of each product using the given formula
        const updatePromises = products.map((product) =>
          prisma.product.update({
            where: { id: product.id },
            data: {
              price: product.price - product.basePrice + newPrice,
              basePrice : newPrice
            },
          })
        );
    
        // Step 5: Execute all product updates within the transaction
        await Promise.all(updatePromises);
      });
    }
      
    catch (error) {
      console.error(error)
      
    }
    
  }


  export async function deleteCategoryAndAssociated(categoryId: string) {
    try {
      await db.$transaction(async (prisma) => {
        // Fetch the category
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
  
        // Delete products associated with the category
        await prisma.product.deleteMany({
          where: {
            category: category!.label,
          },
        });
  
        // Delete cart products associated with the products
        await prisma.cartProduct.deleteMany({
          where: {
            productId: {
              in: await prisma.product.findMany({
                where: {
                  category: category!.id,
                },
                select: {
                  id: true,
                },
              }).then(products => products.map(product => product.id)),
            },
          },
        });
  
        // Delete order items associated with the products
        await prisma.orderItem.deleteMany({
          where: {
            productId: {
              in: await prisma.product.findMany({
                where: {
                  category: category!.label,
                },
                select: {
                  id: true,
                },
              }).then(products => products.map(product => product.id)),
            },
          },
        });
  
        // Delete pre-order previews associated with the products
        await prisma.preOrderPreview.deleteMany({
          where: {
            productCategory: category!.label,
          },
        });
  
        // Delete the category itself
        const deletedCategory = await prisma.category.delete({
          where: {
            id: categoryId,
          },
        });
  
      });
      return true
    } catch (error) {
      console.error('Error deleting category and associated items:', error);
      return false
    }
  }


  
  export async function apply(catId: string, discountPercentage: number) {
    try {
      // Start a transaction
      await db.$transaction(async (prisma) => {

       await resetPricesByCategory(catId)

        // Update the category with the discount
        await prisma.category.update({
          where: { id: catId },
          data: { discount: discountPercentage }
        });
  
        // Fetch the category to get the label
        const category = await prisma.category.findUnique({
          where: { id: catId },
          select: { label: true },
        });
  
        if (!category) {
          throw new Error('Category not found');
        }
  
        // Fetch products that belong to the category
        const products = await prisma.product.findMany({
          where: { category: category.label },
        });
  
        // Apply the discount to each product
        const updatePromises = products.map(product => {
          const newPrice = product.price * (1 - discountPercentage / 100);
          return prisma.product.update({
            where: { id: product.id },
            data: {
              discount : discountPercentage,
              oldPrice: product.price,
              price: Math.round(newPrice),
              isDiscountEnabled: true
            },
          });
        });
  
        // Wait for all updates to complete
        await Promise.all(updatePromises);
      });
  
    } catch (error) {
      console.error('Error applying discount:', error);
      return null;
    }
  }
  
  


  export async function resetPricesByCategory(catId: string) {
    try {
      // Fetch the category to get the label
      const category = await db.category.findUnique({
        where: { id: catId },
        select: { label: true },
      });
  
  
      // Fetch products that belong to the category
      const products = await db.product.findMany({
        where: { category: category!.label },
        select: { id: true, basePrice: true, sellerProfit: true, price: true , oldPrice : true },
      });
  
      if (products.length === 0) {
        throw new Error('No products found for the category');
      }
  
      // Update the price for each product to the initial price
      const updatePromises = products.map(product => {
        const initialPrice = product.oldPrice ?? product.price
        return db.product.update({
          where: { id: product.id },
          data: { price: initialPrice , isDiscountEnabled : false , discount : 0},
        });
      });
  
      // Wait for all updates to complete
      await Promise.all(updatePromises);
  
  
    } catch (error) {
      console.error('Error resetting product prices by category:', error);
      return null
    }
  }
  