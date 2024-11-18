import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'


const Layout = ({ children }: { children: ReactNode  }) => {
  return (

    <SessionProvider>

    <MaxWidthWrapper className='flex-1 flex flex-col'>
      {children}
    </MaxWidthWrapper>
    </SessionProvider>


  )
}

export default Layout