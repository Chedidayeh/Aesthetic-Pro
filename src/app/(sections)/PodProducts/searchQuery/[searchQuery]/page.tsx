'use server';

import { getAllPodProductsCategories, getAllPodProductsCollections, getUser } from "@/actions/actions";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import SearchedProducts from "./SearchedProducts";
import PerkSection from "@/components/PodProducts/PerkSection";
import { searchProducts } from "./actions";


interface PageProps {
  params: {
    searchQuery: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { searchQuery } = params;

  try {
    const user = await getUser()
    const products = await searchProducts(searchQuery)
    const categories = await getAllPodProductsCategories()
    const collections = await getAllPodProductsCollections()


    return (
      <>

          {/* best selling section */}
              <section className='border-t border-gray-200  w-full mx-auto' >
                <div className='w-[85%] mx-auto'>
                <SearchedProducts
                     user={user!}
                     products={products!}
                     categories={categories!}
                     collections={collections}
                />
                </div>
              </section>
          


    </>
    )


  } catch (error) {
    

  }
};

export default Page;
