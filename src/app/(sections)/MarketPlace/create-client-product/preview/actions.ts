'use server';

import { db } from '@/db';
import { sendOrderEmail } from '@/lib/mailer';
import { PreOrderPreview, User } from '@prisma/client';

async function createClientDesign(imageUrl : string, userId : string) {
    try {
      const clientDesign = await db.clientDesign.create({
        data: {
          imageUrl,
          userId,
        },
      });
      return clientDesign;
    } catch (error) {
      console.error("Error creating client design: ", error);
      throw new Error("Could not create client design.");
    }
  }

export async function saveOrder(userId : string, preOrder : PreOrderPreview, 
  clientName : string, address : string, phoneNumber : string , orderTotal : number) {
    try {
      // Start a transaction
      const result = await db.$transaction(async (tx) => {

        // create client design if exist
        let frontclientDesignId
        let backclientDesignId
        if(preOrder.frontclientDesign){
            const frontclientDesign = await createClientDesign(preOrder.frontclientDesign, userId)
            frontclientDesignId = frontclientDesign.id
        }
        if(preOrder.backclientDesign){
            const backclientDesign = await createClientDesign(preOrder.backclientDesign, userId)
            backclientDesignId = backclientDesign.id
        }

        // Create the order
        const order = await tx.order.create({
          data: {
            userId : userId!,
            amount: orderTotal,
            clientName,
            isClientMadeOrder : true,
            shippingAddress: address,
            phoneNumber,
            orderItems: {
              create: [{
                frontsellerDesignId: preOrder.frontsellerDesignId,
                backsellerDesignId: preOrder.backsellerDesignId,
                frontclientDesignId: frontclientDesignId ? frontclientDesignId : null,
                backclientDesignId: backclientDesignId ? backclientDesignId : null,
                productPrice: preOrder.productPrice,
                productTitle : "Client Product",
                quantity: preOrder.quantity,
                productColor: preOrder.productColor,
                productSize: preOrder.productSize,
                productCategory: preOrder.productCategory,
                capturedMockup: preOrder.capturedMockup,
              }],
            },
          },
          include: {
            orderItems: true,
            user : true // Include order items in the returned result
          },
        });

      // Send order email with all order items
      await sendOrderEmail(
        order,
      );
  
        return {success : true , orderId :order.id}
      });
  
      return result;
    } catch (error) {
      console.error("Error saving order: ", error);
      return {success : false , orderId :null}
    }
  }

// delete user preOrder
export async function deletePreOrder(userId: string) {
  try {
    // Find the PreOrderPreview associated with the given userId
    const preOrder = await db.preOrderPreview.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!preOrder) {
      throw new Error(`No PreOrderPreview found for userId: ${userId}`);
    }

    // Delete the found PreOrderPreview
    await db.preOrderPreview.delete({
      where: {
        id: preOrder.id,
      },
    });

    return true
      } catch (error) {
        console.error('Error deleting preOrder:', error);
    return false
  }
}


// get user preOrder
export async function getUserPreOrder(preOrderId: string , userId : string): Promise<PreOrderPreview | null> {
  try {
    let preOrder
    if(preOrderId && preOrderId != "") {
      preOrder = await db.preOrderPreview.findFirst({
        where: {
          id: preOrderId,
        },
      });
    } else {
      preOrder = await db.preOrderPreview.findFirst({
        where: {
          userId: userId,
        },
      });
    }
    return preOrder; // Return the found preorder or null if not found
  } catch (error) {
    console.error('Error fetching user preorder:', error);
    throw new Error('Failed to fetch user preorder');
  }
}
