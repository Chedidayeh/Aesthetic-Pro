 'use server'
import { db } from '@/db';
import ProductView from './ProductView';
import { auth } from '@/auth';
import { fetchAllProducts, getAllPodProductsCategories, getAllPodProductsCollections, getPlatformForTheWebsite, getUser } from '@/actions/actions';
import { getAffiliateIdByUserId } from './actions';

const Page = async () => {

  try {


    const products = await fetchAllProducts();
    const user = await getUser()
    const affiliateId = await getAffiliateIdByUserId(user?.id!)
    const categories = await getAllPodProductsCategories()
    const collections = await getAllPodProductsCollections()
    const platform = await getPlatformForTheWebsite()
  
    return (
     <ProductView
     user={user!}
     affiliateId={affiliateId}
     products={products!}
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

