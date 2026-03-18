import { Hero } from "@/components/HizbhubHero";
import AffiliateTracker from "./_components/AffiliateTracker";

export default async function LandingPage({
    searchParams,
}: {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}) {
    const params = await searchParams;
    const refRaw = params?.ref;
    const ref = Array.isArray(refRaw) ? refRaw[0] : (refRaw ?? "");

    return (
        <div>
            <AffiliateTracker referral={ref} />
            <Hero />
        </div>
    )
}
