import "@/app/globals.css"
import Navbar from "@/components/MarketPlace/NavBar";
import SearchBar from "@/components/MarketPlace/SearchBar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MarketPlace",
  description: "Tunisian Platfrom",
};

export const dynamic = 'force-dynamic';


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