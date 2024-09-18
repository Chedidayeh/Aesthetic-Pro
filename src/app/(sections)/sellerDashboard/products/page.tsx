 'use server'
import { db } from '@/db';
import ProductView from './ProductView';
import { auth } from '@/auth';

const Page = async () => {

  try {
    const session = await auth();


    const store = await db.store.findUnique({
      where: { userId: session!.user.id },
      include: {
        products: {
          select: {
            totalViews: true, // Only include totalViews to minimize data load
          },
        },
      },
    });
    
    // Calculate the total product views
    const totalProductViews = store?.products.reduce((sum, product) => sum + product.totalViews, 0) || 0;


    const sellerProducts = await db.product.findMany({ where: { storeId: store?.id } , orderBy : {createdAt : 'desc'} });
  
  
    return (
     <ProductView
        sellerProductsData={sellerProducts}
        totalProductViews={totalProductViews}
    />
    
    );
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return 
  }

};

export  default Page ;

