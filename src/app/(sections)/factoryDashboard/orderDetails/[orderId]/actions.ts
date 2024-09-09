'use server'


import { getUser } from "@/actions/actions";
import { db } from "@/db";
import { OrderStatus, OrderType } from "@prisma/client";
import { platform } from "os";


export const getOrderWithItemsAndProducts = async (orderId : string) => {
    try {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: true,
              frontsellerDesign : true,
              backsellerDesign : true,
              frontclientDesign : true,
              backclientDesign :true,
            },
          },
          user : true
        },
      });
  
      return order;
    } catch (error) {
      console.error('Error retrieving order with items and products:', error);
      throw new Error('Failed to retrieve order with items and products from database');
    }
  };


  export async function togglePrinted(orderId: string) {
    try {
      // Fetch the current order details
      const order = await db.order.findUnique({
        where: { id: orderId },
      });
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Determine the new value of 'printed'
      let newPrintedValue = !order.printed;
      if (order.isPaid && order.status === 'DELIVERED') {
        newPrintedValue = true;
      }
  
      // Update the order with the new 'printed' value
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: { printed: newPrintedValue },
      });
  
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error; // Re-throw the error after logging it
    }
  }





