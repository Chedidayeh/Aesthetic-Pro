
'use server'

import { auth } from '@/auth';
import { db } from '@/db';
import { Store } from '@prisma/client';




export const addDesignToDb = async (store : Store ,path : string , width:number
   , height: number , designName: string , designPrice : number,
   sellerProfit:number, tags : string[] ) => {
    try {
      const sellerDesign = await db.sellerDesign.create({
        data: {
          isDesignForSale : true,
          storeId:store.id,
          name: designName,
          width:width,
          height:height,
          imageUrl:path,
          price:designPrice,
          sellerProfit:sellerProfit,
          tags:tags,
        },
      });
  
      return sellerDesign.id;
  
  
    } catch (error) {
      console.error('Error Adding design in database:', error);
      throw new Error('Failed to add design in database');
    }
  };

  // to get the auth seller store
  export const getUser = async() => {
    const session = await auth();
    if(!session) return null
    const store = await db.store.findUnique({ where: { userId: session.user.id } });
    return store;
  }




  