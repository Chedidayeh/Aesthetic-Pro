import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Steps from '@/components/Steps'
import { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toaster"


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
    <div className='p-4 sm:p-16'>
      <Steps />
      {children}
    </div>
    </>
  )
}

export default Layout