import { cn } from "@/lib/utils";
import { Check } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const PricingCard = ({ months, price, title, desc, highlighted, save }: { months: number, price: string, title: string, desc: string, highlighted?: boolean, save?: string }) => (
    <div className={cn(
        "relative flex flex-col overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500",
        highlighted
            ? "bg-zinc-900 border-2 border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.05)] scale-[1.02] z-10"
            : "bg-zinc-950 border border-zinc-800/60 hover:border-zinc-700"
    )}>
        {/* Animated Highlight Glow for the "Popular" card */}
        {highlighted && (
            <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[120%] bg-emerald-500/10 blur-[60px] pointer-events-none rotate-12" />
        )}

        {/* Popular Badge */}
        {highlighted && (
            <div className="absolute top-6 right-8">
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                </span>
            </div>
        )}

        <div className="relative z-10">
            <div className="mb-8">
                <h3 className={cn("text-xl font-semibold tracking-tight", highlighted ? "text-white" : "text-zinc-300")}>
                    {title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                    {desc}
                </p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-zinc-500 mr-1">ETB</span>
                    <span className="text-5xl font-bold tracking-tighter text-white">{price}</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <p className="text-sm text-zinc-500 font-medium">
                        for {months} month{months > 1 ? 's' : ''} access
                    </p>
                    {save && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 uppercase tracking-tight">
                            Save {save}
                        </span>
                    )}
                </div>
            </div>

            <div className="h-[1px] w-full bg-zinc-800/50 mb-8" />

            <ul className="mb-10 flex-1 space-y-4">
                {[
                    'Unlimited Communities',
                    'Unlimited Courses',
                    '0% Transaction Fees',
                    'Telebirr Integration',
                    'Custom Domain',
                    'Advanced Insights'
                ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-zinc-400">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <HugeiconsIcon icon={Check} className="h-2.5 w-2.5 text-emerald-500" />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <button className={cn(
                "group relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold transition-all duration-300",
                highlighted
                    ? "bg-white text-black hover:bg-zinc-100 shadow-[0_10px_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                    : "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 active:scale-[0.98]"
            )}>
                <span className="relative z-10">Get Started Now</span>
                {highlighted && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
            </button>
        </div>
    </div>
);
