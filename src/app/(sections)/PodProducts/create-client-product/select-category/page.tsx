'use server'

import { getAllCategories } from "./actions";
import CategoryView from "./CategoryView";



const Page = async () => {


    const categories = await getAllCategories()

     


  

  return (

    <CategoryView categories={categories} />

  );
}

export default Page;
