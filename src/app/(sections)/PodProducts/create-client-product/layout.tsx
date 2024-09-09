import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Steps from '@/components/Steps'
import { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toaster"


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
    <div className='p-20'>
      <Steps />
      {children}
    </div>
    </>
  )
}

export default Layout