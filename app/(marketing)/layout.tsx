import AffiliateTracker from "./_components/AffiliateTracker";
import { Navbar } from "./_components/Navbar";

type LandingPageLayoutProps = {
    children: React.ReactNode;
}

export default async function LandingPageLayout(props: LandingPageLayoutProps) {
    return (
        <div>
            <Navbar />
            {props.children}
        </div>
    )
}
