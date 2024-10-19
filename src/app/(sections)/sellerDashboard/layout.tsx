
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import SideBar from "@/components/sellerDashboard/SideBar";
import NavBar from "@/components/sellerDashboard/NavBar";
import "@/app/globals.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
   title: "Seller Dashboard",
   description: "Tunisian Platfrom",
 };

const Layout = ({ children }: { children: ReactNode }) => {
    return (
         <div className="grid min-h-screen w-full md:grid-cols-[230px_1fr]"> {/* Updated grid columns */}
        <SideBar />
           <div className="flex flex-col">
        <NavBar />
        <div className="p-8">
        {children}
        </div>
        </div>
        </div>
  
  );
}

export default Layout