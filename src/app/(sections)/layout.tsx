import { Recursive } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { StoreProvider } from "@/store/StoreProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
const recursive = Recursive({ subsets: ["latin-ext"] });



const Layout = ({ children }: { children: ReactNode }) => {



  return (

 
    <html lang="en">
      <body className={recursive.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <StoreProvider>
      <main className='flex flex-col min-h-[calc(100vh-3.5rem-1px)]'>
        <div className='flex-1 flex flex-col h-full'>
           <Providers>
           {children}
            <Toaster/>
            </Providers>
          </div>
        </main> 
      </StoreProvider>
      </ThemeProvider>
      </body>
    </html>

  );
}
export default Layout