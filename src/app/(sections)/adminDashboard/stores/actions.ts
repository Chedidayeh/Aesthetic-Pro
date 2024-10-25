'use server'

import { db } from "@/db";
import { sendDesignRejetedEmail, sendProductRejetedEmail } from "@/lib/mailer";
import { createNotification } from "../notifications/action";



export async function deleteStoreById(storeId: string) {
    try {
      // Delete the store by its ID
      const deletedStore = await db.store.delete({
        where: { id: storeId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting store:', error);
      return false;
    }
  }


export async function getAllStoresWithUsers() {
  try {
    const stores = await db.store.findMany({
      include: {
        user: true,
        products :{
          orderBy : {
            createdAt : 'desc'
          } , 
          include : {
            frontDesign : true,
            backDesign : true ,
          }
        } ,
        designs : {
          where : {
            isDesignForSale : true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        } ,
      },
      orderBy : {
        createdAt : 'desc'
      } ,
    });
    return stores;
  } catch (error) {
    console.error('Error retrieving stores:', error);
    throw error;
  } 
}

export async function acceptProduct(productId: string): Promise<void> {
  try {
    const product = await db.product.update({
      where: { id: productId },
      data: {
        isProductAccepted: true
      }
    });

    if (!product) {
      throw new Error(`product with ID ${productId} not found.`);
    }

    // Fetch the product details to get the product name
    const productDetails = await db.product.findUnique({
      where: { id: productId },
      include: { 
        store : {
          include : {
            user : true
          }
        }
      }
    });

    if (!productDetails) {
      throw new Error(`product details for ID ${productId} not found.`);
    }

    // Create notification with the product title
    await createNotification(productDetails.storeId, `Your product: ${productDetails.title} was Accepted`, "Admin");

    // send an email : 

  } catch (error) {
    console.error(`Failed to accept product: ${error}`);
  }
}


export async function refuseProduct(productId: string , reasonForRejection : string): Promise<void> {
  try {
    const product = await db.product.update({
      where: { id: productId },
      data: {
        isProductRefused: true
      },
      include : {
        store : true
      }
    });

    if (!product) {
      throw new Error(`product with ID ${productId} not found.`);
    }

    // Fetch the product details to get the product name
    const productDetails = await db.product.findUnique({
      where: { id: productId },
      select: { title: true, storeId: true , store : {
        include : {
          user : true
        }
      } }
    });

    if (!productDetails) {
      throw new Error(`product details for ID ${productId} not found.`);
    }

    await db.store.update({
      where : { id : product.store.id },
      data : {
        totalRejectedElements : {
          increment : 1
        }
      }
    })

    // send notification : 
    await createNotification(productDetails.storeId, reasonForRejection, "Admin");

    // send an email : 
    await sendProductRejetedEmail(productDetails.store.user.email,productDetails.store.user.name!, productDetails.title , reasonForRejection )

  } catch (error) {
    console.error(`Failed to refuse product: ${error}`);
  }
}



export async function acceptDesign(designId: string): Promise<void> {
  try {
    const design = await db.sellerDesign.update({
      where: { id: designId },
      data: {
        isDesignAccepted: true
      }
    });

    if (!design) {
      throw new Error(`Design with ID ${designId} not found.`);
    }

    // Fetch the design details to get the design name
    const designDetails = await db.sellerDesign.findUnique({
      where: { id: designId },
      select: { name: true, storeId: true }
    });

    if (!designDetails) {
      throw new Error(`Design details for ID ${designId} not found.`);
    }

    // Create notification with the design name
    await createNotification(designDetails.storeId, `Your design: ${designDetails.name} was Accepted`, "Admin");

  } catch (error) {
    console.error(`Failed to accept design: ${error}`);
  }
}


export async function refuseDesign(designId: string , reasonForRejection : string): Promise<void> {
  try {
    const design = await db.sellerDesign.update({
      where: { id: designId },
      data: {
        isDesignRefused: true
      }
    });

    if (!design) {
      throw new Error(`Design with ID ${designId} not found.`);
    }

    // Fetch the design details to get the design name
    const designDetails = await db.sellerDesign.findUnique({
      where: { id: designId },
      select: { name: true, storeId: true , store : {
        include : {
          user : true
        }
      }} 
    });

    if (!designDetails) {
      throw new Error(`Design details for ID ${designId} not found.`);
    }
    // send notification:
    await createNotification(designDetails.storeId, reasonForRejection, "Admin");

    // send an email : 
    await sendDesignRejetedEmail(designDetails.store.user.email,designDetails.store.user.name!, designDetails.name , reasonForRejection )

  } catch (error) {
    console.error(`Failed to refuse design: ${error}`);
  }
}



  