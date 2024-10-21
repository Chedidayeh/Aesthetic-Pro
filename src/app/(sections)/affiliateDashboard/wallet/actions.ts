'use server'

import { db } from "@/db";
import { Store , PaymentRequest } from "@prisma/client";

interface ExtraStore extends Store {
  paymentRequest : PaymentRequest[]
}

// get seller Store by userId
// export async function getStoreByUserId(userId : string) {
//   try {
//     const store = await db.store.findUnique({
//       where: {
//         userId: userId
//       },
//       include: {
//         paymentRequest : true
//       },
//     });

//     if (!store) {
//       throw new Error('Store not found for the given userId');
//     }

//     return store as ExtraStore;
//   } catch (error) {
//     console.error('Error fetching store:', error);
//     throw error;
//   }
// }

export async function proceedD17Request(affiliateId : string ,carteHolder: string, cartePhoneNumber: string, requestedAmount: number) {
    try {
    
      // Create the D17 payment request
       await db.affiliatePaymentRequest.create({
        data: {
          affiliateId: affiliateId,
          method: 'D17',
          cardHolder: carteHolder,
          cardPhoneNumber: cartePhoneNumber,
          accountHolder: carteHolder,
          requestedAmount: requestedAmount,
          status: 'PENDING'
        }
      });
  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }


  export async function proceedFlouciRequest(affiliateId : string ,accountHolder: string, bankAccountRIB: string, requestedAmount: number) {
    try {
    
      // Create the Flouci payment request
       await db.affiliatePaymentRequest.create({
        data: {
          affiliateId: affiliateId,
          method: 'Flouci',
          bankAccount : bankAccountRIB,
          accountHolder: accountHolder,
          requestedAmount: requestedAmount,
          status: 'PENDING'
        }
      });
  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }

  export async function proceedBankDepositRequest(affiliateId : string ,bankName: string, bankAccountRIB: string,accountHolder : string , requestedAmount: number) {
    try {
    
      // Create the D17 payment request
       await db.affiliatePaymentRequest.create({
        data: {
          affiliateId: affiliateId,
          method: 'BankDeposit',
          bankName : bankName,
          bankAccount : bankAccountRIB,
          accountHolder: accountHolder,
          requestedAmount: requestedAmount,
          status: 'PENDING'
        }
      });
  
    } catch (error) {
      console.error('Error creating payment request:', error);
    }
  }