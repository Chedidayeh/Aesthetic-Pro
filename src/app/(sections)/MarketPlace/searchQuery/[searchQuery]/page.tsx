'use server';

import { getAllProductCollectionNames, getAllProductsCategories, getUser } from "@/actions/actions";
import SearchedProducts from "./SearchedProducts";
import { fetchPriceRanges, searchProducts } from "./actions";


interface PageProps {
  params: {
    searchQuery: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { searchQuery } = params;

  try {

    const limit = 4; // Number of products per page
    const page = 1; // Initial page
    const priceRanges = await fetchPriceRanges(searchQuery)
    
    const user = await getUser()
    const { products, totalCount } = await searchProducts(searchQuery , page , limit)
    const categories = await getAllProductsCategories()
    const collections = await getAllProductCollectionNames()

        // Decode the URL-encoded string
    let decodedQuery = decodeURIComponent(searchQuery);

    // Use regex to remove 'dff gf' and any other unwanted characters
    decodedQuery = decodedQuery.replace(/dff\s*gf/g, '');

    return (
      <>

          {/* best selling section */}
              <section className='border-t border-gray-200  w-full mx-auto' >
                <div className='w-[95%] lg:w-[85%] mx-auto'>
                <SearchedProducts
                    initialProducts={products}
                    totalCount={totalCount}
                    initialPage={page}
                    limit={limit}
                    priceRanges={priceRanges}
                     user={user!}
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
