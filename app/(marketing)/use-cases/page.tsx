import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Camera, Check, Code, DollarSign, Dumbbell, GraduationCap, LayoutDashboard, Palette, Users, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Use Cases - How Creators Use Hizbhub to Earn | Hizbhub",
    description: "See how creators, educators, and businesses use Hizbhub to build and monetize communities.",
};

export default function UseCasesPage() {
    const useCases = [
        {
            icon: GraduationCap,
            title: "Educators & Tutors",
            description: "Move beyond chaotic Telegram groups. Host structured courses, provide downloadable resources, and run live Q&A sessions for ESSLCE prep or university tutoring.",
            benefits: ["Structured curriculum", "Progress tracking", "Secure file sharing"]
        },
        {
            icon: Camera,
            title: "Content Creators",
            description: "Turn your audience into a sustainable business. Offer exclusive behind-the-scenes content, ad-free videos, and a private community for your true fans.",
            benefits: ["Direct monetization", "No algorithm dependency", "Deeper fan connection"]
        },
        {
            icon: Code,
            title: "Tech Bootcamps",
            description: "Run cohort-based courses. Combine video lessons with a vibrant community where students can share code, ask questions, and network.",
            benefits: ["Cohort management", "Peer-to-peer learning", "Resource libraries"]
        },
        {
            icon: Briefcase,
            title: "Consultants & Coaches",
            description: "Package your expertise. Sell premium advisory content, host group coaching calls, and build a network of high-value clients.",
            benefits: ["High-ticket sales", "Private networking", "Automated onboarding"]
        },
        {
            icon: Dumbbell,
            title: "Fitness Trainers",
            description: "Build a digital gym. Share workout plans, nutrition guides, and keep your clients accountable in a private, supportive community.",
            benefits: ["Video libraries", "Daily accountability", "Subscription revenue"]
        },
        {
            icon: Palette,
            title: "Creative Professionals",
            description: "Share your craft. Teach photography, design, or writing through structured modules while building a community of aspiring artists.",
            benefits: ["Portfolio showcases", "Constructive feedback", "Skill monetization"]
        }
    ];

    return (
        <div
            className="pt-32 pb-24 bg-background"
        >
            <div className="mx-auto max-w-4xl px-6 text-center mb-24">
                <Badge className="mb-8">Who is HizbHub for?</Badge>
                <h1 className="mb-6 text-5xl font-medium tracking-tight text-white sm:text-7xl">
                    Built for the next generation of <br />
                    <span className="text-muted-foreground">Ethiopian creators.</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    Whether you're teaching code, sharing fitness routines, or building a premium community, HizbHub gives you the tools to monetize your knowledge natively.
                </p>
            </div>

            <div className="mx-auto max-w-7xl px-6 mb-32">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((uc, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-3xl border border-border bg-zinc-900/30 p-8 transition-all hover:bg-zinc-900/80 hover:border-white/10">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-black text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                                <HugeiconsIcon icon={uc.icon} className="h-6 w-6" />
                            </div>
                            <h3 className="mb-4 text-2xl font-medium text-white">{uc.title}</h3>
                            <p className="mb-8 text-zinc-400 leading-relaxed">{uc.description}</p>

                            <div className="space-y-3">
                                {uc.benefits.map((benefit, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                            <HugeiconsIcon icon={Check} className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Creator Journey */}
            <section className="mx-auto max-w-7xl px-6 py-24 mb-32">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <Badge variant="outline" className="mb-6 px-4 py-1 border-zinc-800 text-zinc-400 font-medium tracking-wide uppercase text-[10px]">
                        Workflow
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                        From audience to business <span className="text-zinc-500 text-3xl md:text-4xl block mt-2 font-normal">in three simple steps</span>
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="grid gap-12 md:grid-cols-3 relative">

                    {/* THE FIXED LINE: top-10 centers it perfectly in the middle of the h-20 icons */}
                    <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-0" />

                    {/* Step 1 */}
                    <div className="group relative flex flex-col items-center text-center">
                        <div className="relative mb-8 transition-transform duration-500 group-hover:-translate-y-2 z-10">
                            {/* Background color here is key to "cutting" the line */}
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <HugeiconsIcon icon={LayoutDashboard} className="h-9 w-9 text-zinc-200" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 shadow-xl">
                                01
                            </div>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-white tracking-tight">Build Your Hub</h3>
                        <p className="text-zinc-500 leading-relaxed max-w-[280px]">
                            Launch your branded ecosystem and structure channels in under ten minutes.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="group relative flex flex-col items-center text-center">
                        <div className="relative mb-8 transition-transform duration-500 group-hover:-translate-y-2 z-10">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <HugeiconsIcon icon={Users} className="h-9 w-9 text-zinc-200" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 shadow-xl">
                                02
                            </div>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-white tracking-tight">Invite Your Audience</h3>
                        <p className="text-zinc-500 leading-relaxed max-w-[280px]">
                            Migrate followers from noisy social feeds into a focused, private community.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="group relative flex flex-col items-center text-center">
                        <div className="relative mb-8 transition-transform duration-500 group-hover:-translate-y-2 z-10">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-black text-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <HugeiconsIcon icon={DollarSign} className="h-9 w-9" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 shadow-xl">
                                03
                            </div>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-white tracking-tight">Start Earning</h3>
                        <p className="text-zinc-500 leading-relaxed max-w-[280px]">
                            Automate revenue with integrated local payments: <span className="text-zinc-300">Telebirr & Chapa.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="mx-auto max-w-7xl px-6 mb-32">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                    {/* Decorative background glow for the "Good" side */}
                    <div className="absolute -right-24 -top-24 h-96 w-96 bg-emerald-500/10 blur-[100px] pointer-events-none" />

                    <div className="grid md:grid-cols-2">
                        {/* The Old Way */}
                        <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-zinc-800/60">
                            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
                                The Status Quo
                            </div>
                            <h3 className="text-3xl font-semibold text-zinc-200 mb-3 tracking-tight">The Old Way</h3>
                            <p className="text-zinc-500 mb-10 leading-relaxed">
                                Managing a business through fragmented chat apps and manual spreadsheets.
                            </p>

                            <ul className="space-y-6">
                                {[
                                    "Endless scrolling to find old resources",
                                    "Manually verifying Telebirr screenshots",
                                    "Piracy risks with forwardable files",
                                    "No analytics or member insights",
                                    "Chaotic group chats with no structure"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <div className="flex-shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-red-900/50 transition-colors">
                                            <HugeiconsIcon icon={X} className="h-3 w-3 text-zinc-600 group-hover:text-red-500" />
                                        </div>
                                        <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors text-[15px] leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* The HizbHub Way */}
                        <div className="p-10 md:p-16 bg-emerald-500/[0.02] relative">
                            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-6">
                                The Future
                            </div>
                            <h3 className="text-3xl font-semibold text-white mb-3 tracking-tight">The HizbHub Way</h3>
                            <p className="text-emerald-500/70 mb-10 leading-relaxed">
                                A professional-grade ecosystem built specifically for digital creators.
                            </p>

                            <ul className="space-y-6">
                                {[
                                    "Structured curriculum and resource libraries",
                                    "Automated subscriptions and access control",
                                    "Secure, non-downloadable video hosting",
                                    "Deep analytics on engagement and revenue",
                                    "Organized channels and direct messaging"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <div className="flex-shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                                            <HugeiconsIcon icon={Check} className="h-3 w-3 text-emerald-500" />
                                        </div>
                                        <span className="text-zinc-300 group-hover:text-white transition-colors text-[15px] leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative mx-auto max-w-5xl px-6 py-24 mb-32 overflow-hidden rounded-[3rem] border border-zinc-800/50 bg-zinc-950">
                {/* Decorative background spotlight */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-4xl md:text-5xl font-semibold tracking-tight text-white">
                        Ready to turn your audience <br />
                        <span className="text-zinc-500">into a thriving business?</span>
                    </h2>

                    <p className="mb-10 text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
                        Stop duct-taping tools that weren't built for you. Join the elite creators building their legacy on HizbHub.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <button className="group relative flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-semibold text-black transition-all hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                            Start Your Free Trial
                            <HugeiconsIcon
                                icon={ArrowRight}
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </button>

                        {/* Trust-builder text */}
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                            No credit card required • Cancel anytime
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
