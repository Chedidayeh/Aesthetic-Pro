
'use server'

import { db } from '@/db';
import { Collection, Product } from '@prisma/client';

interface ExtraCollection extends Collection {
  products : Product[]
}

    export const addProductToDb = async (
      storeId : string,
      productCat: string,
      checkedColors: string[],
      frontPaths: string[],
      backPaths: string[],
      productTitle: string,
      productDescription: string,
      tags: string[],
      productPrice: number,
      BasePrice: number,
      sellerProfit: number,
      frontDesignName: string,
      Frontwidth: number,
      Frontheight: number,
      frontdesignPath: string,
      backDesignName: string,
      Backwidth: number,
      Backheight: number,
      backdesignPath: string,
      selectedCollection : ExtraCollection,
      privateProduct : boolean
    ): Promise<{ success: boolean; productId: string | null; error: boolean }> => {
      try {

    
        // Fetch store associated with the user
        const store = await db.store.findUnique({ where: { id: storeId } });
        if (!store) {
          return { success: false, productId: null, error: true };
        }
    
        // Begin the transaction
        const productId = await db.$transaction(async (transaction) => {
          // Create a new Front design and get the id
          const frontDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: frontDesignName,
              width: Frontwidth,
              height: Frontheight,
              imageUrl: frontdesignPath,
            },
          });
    
          // Create a new Back design and get the id
          const backDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: backDesignName,
              width: Backwidth,
              height: Backheight,
              imageUrl: backdesignPath,
            },
          });
    
          // Create the product and add store id
          const product = await transaction.product.create({
            data: {
              storeId: store.id,
              category: productCat,
              colors: checkedColors,
              croppedFrontProduct: frontPaths,
              croppedBackProduct: backPaths,
              title: productTitle,
              description: productDescription,
              tags: tags,
              price: productPrice,
              basePrice: BasePrice,
              sellerProfit: sellerProfit,
              frontDesignId: frontDesign.id,
              backDesignId: backDesign.id,
              collectionName : selectedCollection.name,
              collectionId : selectedCollection.id,
              privateProduct : privateProduct

            },
          });
    
          return product.id;
        });
    
        // If everything went well, resolve the promise with the ID of the created product
        return { success: true, productId: productId, error: false };
      } catch (error) {
        // If there was an error, log it and return an error object
        console.error('Error Adding Product in database:', error);
        return { success: false, productId: null, error: true };
      }
    };
    
    


    export const addProductToDbF = async (
      storeId : string,
      productCat: string,
      checkedColors: string[],
      Paths: string[],
      productTitle: string,
      productDescription: string,
      tags: string[],
      productPrice: number,
      BasePrice: number,
      sellerProfit: number,
      DesignName: string,
      Frontwidth: number,
      Frontheight: number,
      frontdesignPath: string,
      selectedCollection : ExtraCollection,
      privateProduct : boolean,

    ): Promise<{ success: boolean; productId: string | null; error: boolean }> => {
      try {
    
        // Fetch store associated with the user
        const store = await db.store.findUnique({ where: { id: storeId } });
        if (!store) {
          return { success: false, productId: null, error: true };
        }
    
        // Begin the transaction
        const productId = await db.$transaction(async (transaction) => {
          // Create a new Front design and get the id
          const frontDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: DesignName,
              width: Frontwidth,
              height: Frontheight,
              imageUrl: frontdesignPath,
            },
          });
    
          // Create the product and add store id
          const product = await transaction.product.create({
            data: {
              storeId: store.id,
              category: productCat,
              colors: checkedColors,
              croppedFrontProduct: Paths,
              title: productTitle,
              description: productDescription,
              tags: tags,
              price: productPrice,
              basePrice: BasePrice,
              sellerProfit: sellerProfit,
              frontDesignId: frontDesign.id,
              collectionName : selectedCollection.name,
              collectionId : selectedCollection.id,
              privateProduct : privateProduct


            },
          });
    
          return product.id;
        });
    
        // If everything went well, resolve the promise with the ID of the created product
        return { success: true, productId: productId, error: false };
      } catch (error) {
        // If there was an error, log it and return an error object
        console.error('Error Adding Product in database:', error);
        return { success: false, productId: null, error: true };
      }
    };
    
    

    export const addProductToDbB = async (
      storeId : string,
      productCat: string,
      checkedColors: string[],
      Paths: string[],
      productTitle: string,
      productDescription: string,
      tags: string[],
      productPrice: number,
      BasePrice: number,
      sellerProfit: number,
      DesignName: string,
      Backwidth: number,
      Backheight: number,
      backdesignPath: string,
      selectedCollection : ExtraCollection,
      privateProduct : boolean,


    ): Promise<{ success: boolean; productId: string | null; error: boolean }> => {
      try {
    
        // Fetch store associated with the user
        const store = await db.store.findUnique({ where: { id: storeId } });
        if (!store) {
          return { success: false, productId: null, error: true };
        }
    
        // Begin the transaction
        const productId = await db.$transaction(async (transaction) => {
          // Create a new Back design and get the id
          const backDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: DesignName,
              width: Backwidth,
              height: Backheight,
              imageUrl: backdesignPath,
            },
          });
    
          // Create the product and add store id
          const product = await transaction.product.create({
            data: {
              storeId: store.id,
              category: productCat,
              colors: checkedColors,
              croppedBackProduct: Paths,
              title: productTitle,
              description: productDescription,
              tags: tags,
              price: productPrice,
              basePrice: BasePrice,
              sellerProfit: sellerProfit,
              backDesignId: backDesign.id,
              collectionName : selectedCollection.name,
              collectionId : selectedCollection.id,              
              privateProduct : privateProduct

            },
          });
    
          return product.id;
        });
    
        // If everything went well, resolve the promise with the ID of the created product
        return { success: true, productId: productId, error: false };
      } catch (error) {
        // If there was an error, log it and return an error object
        console.error('Error Adding Product in database:', error);
        return { success: false, productId: null, error: true };
      }
    };





  