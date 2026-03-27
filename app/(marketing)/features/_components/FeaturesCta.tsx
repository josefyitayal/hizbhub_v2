"use client"
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export function FeaturesCta() {
    const router = useRouter()
    return (
        <section className="relative overflow-hidden py-32 bg-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]" />
            <div className="relative mx-auto max-w-4xl px-6 text-center">
                <Badge className="mb-8">Digital Ownership</Badge>
                <h2 className="mb-6 text-4xl font-medium tracking-tight text-white sm:text-6xl">
                    Build once. <br />
                    Own it forever.
                </h2>
                <p className="mb-10 text-lg text-zinc-400">
                    HizbHub is designed for creators who want permanence — not algorithms, feeds, or borrowed attention. Claim your sovereign digital space today.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button onClick={(e) => { e.preventDefault(); router.push("/create-group") }} className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black hover:bg-zinc-200 transition-colors">
                        Start your hub <HugeiconsIcon icon={ChevronRight} className="ml-2 h-4 w-4" />
                    </button>
                    <span className="text-xs tracking-widest text-muted-foreground uppercase">No credit card required</span>
                </div>
            </div>
        </section>
    );
}
