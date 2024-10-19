'use server'

import { getUser } from "@/actions/actions"
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

    const user = await getUser()
    const store = await db.store.create({
      data:{
        userId:user!.id,
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

    if(user!.isAffiliate) {
      await db.affiliate.delete({
        where:{
          userId:user!.id
          }
          })
          // update user isAffiliate
          await db.user.update({
            where:{id:user!.id},
            data:{
              isAffiliate:false
              }
          })
    }
  } catch (error) {
    console.log(error)
  }
     

      
 
}

