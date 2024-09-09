'use server'

import { db } from "@/db";



export const getAllOrders = async () => {
    try {
      const orders = await db.order.findMany({
        include: {
          orderItems : true
        }
      });
  
      return orders;
    } catch (error) {
      console.error('Error retrieving orders with items and products:', error);
      throw new Error('Failed to retrieve orders with items and products from database');
    }
  };



  export const deleteOrderById = async (orderId: string) => {
    try {
      // Start a transaction to ensure atomicity
      await db.$transaction(async (transaction) => {
        // Delete the order items associated with the order
        await transaction.orderItem.deleteMany({
          where: { orderId: orderId },
        });
  
        // Delete the order
        await transaction.order.delete({
          where: { id: orderId },
        });
      });
  
      return { message: 'Order and associated items deleted successfully' };
    } catch (error) {
      console.error('Error deleting order and associated items:', error);
      throw new Error('Failed to delete order and associated items from database');
    }
  };