'use client';

import React, { useEffect, useRef } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { AffiliateLink } from '@prisma/client';
import { createAffiliateClick } from './actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/reducers/reducers';
import { saveSessionId } from '@/store/actions/action';

const SESSION_ID_KEY = 'affiliateSessionId'; // Key for local storage

interface PageProps {
  affiliateLink: AffiliateLink;
}

const RedirectPage = ({  affiliateLink }: PageProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Use useRef to persist sessionId across renders
  const sessionIdRef = useRef<string | null>(null);

  // Fetch the sessionId from Redux store if available
  const reduxSessionId = useSelector((state: RootState) => state.id);

  useEffect(() => {
    // First, check if sessionId exists in Redux or ref
    if (reduxSessionId) {
      sessionIdRef.current = reduxSessionId;
    } else {
      // Check if sessionId is stored in localStorage
      const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
      if (storedSessionId) {
        sessionIdRef.current = storedSessionId;
        dispatch(saveSessionId(storedSessionId)); // Save the sessionId to Redux
      } else {
        // If no sessionId found, generate a new one
        const newSessionId = crypto.randomUUID();
        sessionIdRef.current = newSessionId;
        localStorage.setItem(SESSION_ID_KEY, newSessionId); // Save to localStorage
        dispatch(saveSessionId(newSessionId)); // Save to Redux
      }
    }

    const handleAffiliateClick = async () => {
      try {
        if (sessionIdRef.current) {
          // Use sessionId from ref for affiliate click handling
          await createAffiliateClick(affiliateLink, sessionIdRef.current);
          router.push(affiliateLink.originalLink); // Redirect immediately
        }
      } catch (error) {
        console.error('Error during affiliate click handling:', error);
        // Optionally handle errors, e.g., show an error message to the user
      }
    };

    handleAffiliateClick();
  }, [affiliateLink, reduxSessionId, router, dispatch]);

  return (
    <>
    <div className='mb-96'>

    </div>
      {/* Your AlertDialog and countdown UI */}
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-blue-500 mb-2">
              <Loader className="animate-spin" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Redirecting...
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please wait while we redirect you to your destination...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RedirectPage;