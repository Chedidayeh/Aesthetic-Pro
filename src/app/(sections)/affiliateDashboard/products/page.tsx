 'use server'
import { db } from '@/db';
import ProductView from './ProductView';
import { auth } from '@/auth';
import { getAllProductsCategories, getAllProductCollectionNames, getPlatformForTheWebsite, getUser } from '@/actions/actions';
import { fetchAllProducts, getAffiliateIdByUserId } from './actions';

const Page = async () => {

  try {

    const limit = 4; // Number of products per page
    const page = 1; // Initial page
  
  
    const { products, totalCount } = await fetchAllProducts(page, limit);
  
  


    const user = await getUser()
    const affiliateId = await getAffiliateIdByUserId(user?.id!)
    const categories = await getAllProductsCategories()
    const collections = await getAllProductCollectionNames()
    const platform = await getPlatformForTheWebsite()
  
    return (
     <ProductView
     initialProducts={products}
     totalCount={totalCount}
     initialPage={page}
     limit={limit}
     user={user!}
     affiliateId={affiliateId}
     categories={categories!}
     collections={collections}
     platform={platform!}
    />
    
    );
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return 
  }

};

export  default Page ;

