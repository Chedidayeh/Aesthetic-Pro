'use server';

import { getAllPodProductsCategories, getAllPodProductsCollections, getUser } from "@/actions/actions";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import SearchedProducts from "./SearchedProducts";
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

        // Decode the URL-encoded string
    let decodedQuery = decodeURIComponent(searchQuery);

    // Use regex to remove 'dff gf' and any other unwanted characters
    decodedQuery = decodedQuery.replace(/dff\s*gf/g, '');

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
                     searchQuery={decodedQuery}
                />
                </div>
              </section>
          


    </>
    )


  } catch (error) {
    console.error(error)
  }
};

export default Page;
