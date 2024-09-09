import "@/app/globals.css"
import Navbar from "@/components/PodProducts/NavBar";
import SearchBar from "@/components/PodProducts/SearchBar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AestheticPro | Products",
  description: "Tunisian Platfrom",
};

const Layout = ({ children }: { children: ReactNode }) => {



  return (

          <div>
            <TopBar/>
            <Navbar/>
            <SearchBar/>
            {children}
            <Footer/>
           </div>

  );
}

export default Layout