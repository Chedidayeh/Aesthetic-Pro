import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toaster"


const Layout = ({ children }: { children: ReactNode }) => {
  return (

    <MaxWidthWrapper className='flex-1 flex flex-col'>
      {children}
      <Toaster />
    </MaxWidthWrapper>

  )
}

export default Layout