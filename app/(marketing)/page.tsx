import AffiliateTracker from "./_components/AffiliateTracker";
import { ProductShowcase } from "./_components/ProductShowcase";
import { WhyHizbhub } from "./_components/WhyHizbhub";
import { Pillars } from "./_components/Pillars";
import { Differentiators } from "./_components/Differentiators";
import { BuiltForEthiopia } from "./_components/BuiltForEthiopia";
import { UseCases } from "./_components/UseCases";
import { CTA } from "./_components/CTA";
import { Hero } from "./_components/Hero";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeaturesCta } from "./features/_components/FeaturesCta";

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
            <ProductShowcase />
            <WhyHizbhub />
            <Pillars />
            <Differentiators />
            <BuiltForEthiopia />
            <UseCases />
            <FeaturesCta />
        </div>
    )
}
