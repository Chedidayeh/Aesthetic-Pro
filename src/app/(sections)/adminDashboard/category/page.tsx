import CategoryView from "./CategoryView"
import { getAllCategoriesWithDetails } from "./actions"
import { unstable_noStore as noStore } from "next/cache"


const Page = async () =>{

    noStore()


    const categories = await getAllCategoriesWithDetails()

    return (
        <CategoryView categories={categories} />
    )

}

export default Page