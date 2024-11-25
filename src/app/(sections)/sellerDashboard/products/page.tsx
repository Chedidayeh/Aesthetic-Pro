 'use server'
import { db } from '@/db';
import ProductView from './ProductView';
import { getUser } from '@/actions/actions';
import { getAllCollections } from '../../adminDashboard/settings/actions';

const Page = async () => {

  try {
    const user = await getUser();

    const collections = await getAllCollections()


    const store = await db.store.findUnique({
      where: { userId: user!.id },
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
        collections={collections}
    />
    
    );
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return 
  }

};

export  default Page ;

