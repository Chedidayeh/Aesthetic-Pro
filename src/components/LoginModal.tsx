'use client'

/* eslint-disable react/no-unescaped-entities */
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { buttonVariants } from './ui/button';
import Link from 'next/link';
import { saveRedirectUrl } from '@/store/actions/action';

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      // Save the current path to Redux store
      dispatch(saveRedirectUrl(pathname));
    }
  }, [isOpen, dispatch, pathname]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className=' z-[9999999]'>
        <DialogHeader>
          <DialogTitle className='text-3xl text-center font-bold tracking-tight '>
            Log in to continue
          </DialogTitle>
          <DialogDescription className='text-base text-center py-2'>
            Please login or create an account and{' '}
            <span className='font-medium text-blue-500'>
              you'll be redirected to this page!
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-6 divide-x divide-gray-200'>
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href='/auth/sign-in'
          >
            Login
          </Link>
          <Link
            className={buttonVariants({ variant: 'default' })}
            href='/auth/sign-up'
          >
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
