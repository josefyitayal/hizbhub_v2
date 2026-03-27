import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";

type LandingPageLayoutProps = {
    children: React.ReactNode;
}

export default async function LandingPageLayout(props: LandingPageLayoutProps) {
    return (
        <div className="flex-1 min-h-0 overflow-y-scroll custom-scrollbar">
            <Navbar />
            {props.children}
            <Footer />
        </div>
    )
}
