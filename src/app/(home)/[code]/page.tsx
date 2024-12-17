
import NotFound from "../[...not-found]/page";
import {  getAffiliateLinkByCode } from "./actions";
import RedirectPage from './RedirectPage';

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
        return (
            <RedirectPage affiliateLink={affiliateLink}  />
        );
    }
}
