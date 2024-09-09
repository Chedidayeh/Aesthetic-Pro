'use server'

import { db } from '@/db';
import { error } from 'console';
import CreateOrder from './CreateOrder';
import { auth } from '@/auth';
import { getPlatformForTheWebsite } from '@/actions/actions';


const Page = async () => {

  const session = await auth();
  if(!session) return null
  const store = await db.store.findUnique({
    where:{userId:session.user.id}
  })
    const sellerProducts = await db.product.findMany({ where: { storeId: store?.id , isProductAccepted : true } });

    if(!sellerProducts){
    throw error ("there's no sellersDesigns");
    }

    const platform  = await getPlatformForTheWebsite()



  return (
   <CreateOrder
      sellerProductsData={sellerProducts}
      platform = { platform! }
  />
  
  );
};

export  default Page ;

