'use server'

import { auth, signOut } from "@/auth"
import { db } from "@/db"


export const fetchName = async (name: string) => {
    try {
      const seller = await db.store.findFirst({
        where: {
          storeName: name
        }
      })
    if (seller) return false      
  
      return true
    } catch (error) {
      console.error('Error fetching store by name:', error)
      throw error
    }
  }

  type StoreArgs = {
    storeName: string;
    logoPath: string;
    phoneNumber : string
  };
  

export const addStore = async ({ storeName, logoPath , phoneNumber } : StoreArgs) => {

  try {
    const session = await auth()
    if(!session) return
    const store = await db.store.create({
      data:{
        userId:session.user.id,
        storeName:storeName,
        logoUrl: logoPath,
        userPhoneNumber : phoneNumber,
      }
    })

    await db.user.update({
      where:{id:store.userId},
      data:{
        userType:"SELLER",
      }
    })    
  } catch (error) {
    console.log(error)
    
  }
     

      
 
}

