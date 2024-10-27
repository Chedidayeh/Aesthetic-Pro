
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import NotFound from "../[...not-found]/page";
import { createAffiliateClick, getAffiliateLinkByCode, updateTotalVisits } from "./actions";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import RedirectPage from './RedirectPage';
import { auth } from '@/auth';
import { getUser } from '@/actions/actions';
import { serialize } from 'cookie';

interface RedirectPageProps {
    params: { code: string };
}

export default async function Page({ params }: RedirectPageProps) {
    const { code } = params;
    const affiliateLink = await getAffiliateLinkByCode(code);

    if (!affiliateLink) {
        return <NotFound />;
    }
    else {
        await updateTotalVisits(code);
        return (
            <RedirectPage affiliateLink={affiliateLink}  />
        );
    }
}
