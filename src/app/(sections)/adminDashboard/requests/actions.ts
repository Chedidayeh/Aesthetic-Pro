'use server'

import { db } from "@/db";
import { Store, User , PaymentRequest} from "@prisma/client";

interface ExtraStore extends Store {
  user : User
}

interface ExtraPaymentRequest extends PaymentRequest {
  store : ExtraStore
}

export async function getPaymentRequests() {
    try {
      const paymentRequests = await db.paymentRequest.findMany({
        include: {
          store : {
            include : {
              user : true
            }
          }
        }
      });
  
      return paymentRequests;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }


export async function deletePaymentRequestById(paymentRequestId : string) {
    try {
      await db.paymentRequest.delete({
        where: {
          id: paymentRequestId,
        },
      });
  
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false
    } 
  }

  export async function approveStoreRequest(selectedRequest: ExtraPaymentRequest) {
    try {
      // Start a transaction to ensure atomicity
      const updatedRequest = await db.$transaction(async (tx) => {
        // Update the status of the payment request to 'APPROVED'
        const request = await tx.paymentRequest.update({
          where: { id: selectedRequest.id },
          data: { status: 'APPROVED' },
        });
  
        // Increment the store's receivedPayments by the requestedAmount
        const updatedStore = await tx.store.update({
          where: { id: selectedRequest.store.id },
          data: {
            receivedPayments: {
              increment: request.requestedAmount,
            },
          },
        });
  
        // Return the updated request with the updated store
        return {
          ...request,
          store: updatedStore,
        };
      });
  
      return updatedRequest;
    } catch (error) {
      console.error('Error approving store request:', error);
      throw new Error('Could not approve the store request');
    }
  }
