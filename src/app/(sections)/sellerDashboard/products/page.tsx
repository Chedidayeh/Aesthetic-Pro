'use server'
import { db } from '@/db';
import ProductView from './ProductView';
import { auth } from '@/auth';

const Page = async () => {

  try {
    const session = await auth();


    const store = await db.store.findUnique({
      where:{userId:session!.user.id}
    })


    const sellerProducts = await db.product.findMany({ where: { storeId: store?.id } , orderBy : {createdAt : 'desc'} });
  
  
    return (
     <ProductView
        sellerProductsData={sellerProducts}
    />
    
    );
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return 
  }

};

export  default Page ;

