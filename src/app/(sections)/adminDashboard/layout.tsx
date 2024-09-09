
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";
import SideBar from "@/components/adminDashboard/SideBar";
import NavBar from "@/components/adminDashboard/NavBar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AestheticPro | AdminDashboard",
  description: "Tunisian Platfrom",
};

const Layout = ({ children }: { children: ReactNode }) => {
    return (

    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]"> {/* Updated grid columns */}
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