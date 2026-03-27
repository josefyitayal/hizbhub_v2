"use client"

import { Badge } from "@/components/ui/badge";
import { BarChart, BookOpen, CreditCard, GlobeFreeIcons, Shield, Users } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from 'framer-motion';
import { PricingCard } from "./_components/PricingCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { FAQItem } from "./_components/FAQItem";

export default function PricingPage() {
    const includedFeatures = [
        { icon: Users, title: "Unlimited Members", desc: "Grow your community without worrying about arbitrary member limits or paywalls." },
        { icon: BookOpen, title: "Unlimited Courses", desc: "Host as many courses, modules, and lessons as you want. Video hosting included." },
        { icon: CreditCard, title: "Telebirr Native", desc: "Seamlessly accept payments from millions of Ethiopians via Telebirr." },
        { icon: GlobeFreeIcons, title: "Custom Domain", desc: "Connect your own domain (e.g., academy.yourname.com) for a fully white-labeled experience." },
        { icon: BarChart, title: "Deep Analytics", desc: "Track revenue, member engagement, and course completion rates in real-time." },
        { icon: Shield, title: "Content Protection", desc: "Enterprise-grade security prevents unauthorized downloading and sharing of your content." },
    ];

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pt-32 pb-24 bg-background"
        >
            <div className="mx-auto max-w-4xl px-6 text-center mb-24">
                <Badge className="mb-8">Simple Pricing</Badge>
                <h1 className="mb-6 text-5xl font-medium tracking-tight text-white sm:text-7xl">
                    One platform. <br />
                    <span className="text-zinc-500">No surprise fees.</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                    Because Ethiopian payment gateways don't support auto-renewing subscriptions, we offer simple prepaid passes. Pay once, build your empire, and renew when you're ready.
                </p>
            </div>

            <div className="mx-auto max-w-7xl px-6 mb-32">
                <div className="grid gap-8 md:grid-cols-3 items-stretch">
                    <PricingCard months={1} price="1,500" title="Starter" desc="Perfect for testing the waters and launching your first course." />
                    <PricingCard months={6} price="8,000" title="Growth" desc="Build momentum and scale your community." highlighted save="11%" />
                    <PricingCard months={12} price="15,000" title="Sovereign" desc="For serious creators building a permanent digital business." save="16%" />
                </div>
            </div>

            {/* 0% Fee Banner */}
            <section className="mx-auto max-w-7xl px-6 mb-32">
                <div className="relative overflow-hidden rounded-[3rem] border border-emerald-500/20 bg-zinc-950 px-8 py-20 text-center md:px-16">

                    {/* Advanced Background Effects */}
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />

                    {/* Subtle grid pattern for texture */}
                    <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0_0_40_40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm1 1h38v38H1V1z\' fill=\'%23ffffff\' fill-opacity=\'1\'/%3E%3C/svg%3E")' }}
                    />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        {/* Early Adopter Badge */}
                        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                                Founder's Early Access
                            </span>
                        </div>

                        <h2 className="mb-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                            Keep <span className="text-emerald-500">100%</span> of your revenue.
                        </h2>

                        <p className="mb-8 text-xl text-zinc-400 leading-relaxed font-light">
                            We’re rewarding the first wave of creators. Join now to lock in <strong className="text-white font-medium">0% transaction fees</strong> on every course sale and subscription—forever.
                        </p>

                        <div className="flex flex-col items-center gap-2">
                            <p className="text-sm text-zinc-500 italic">
                                *Our pricing structure will evolve as we scale. Secure your early-mover advantage today.
                            </p>
                            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Included Features Grid */}
            <section className="mx-auto max-w-7xl px-6 py-24 mb-32">
                {/* Header Section */}
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                        Everything you need, <span className="text-zinc-500">fully included.</span>
                    </h2>
                    <p className="text-lg text-zinc-400 leading-relaxed">
                        No hidden tiers. No "pro" add-ons. Every subscription grants you total access to the entire HizbHub ecosystem from day one.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {includedFeatures.map((feat, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-[2rem] border border-zinc-800/50 bg-zinc-950 p-8 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50"
                        >
                            {/* Subtle Radial Gradient on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <HugeiconsIcon
                                        icon={feat.icon}
                                        className="h-6 w-6 text-zinc-400 group-hover:text-emerald-400 transition-colors"
                                    />
                                </div>

                                <h3 className="mb-3 text-xl font-semibold text-zinc-100 tracking-tight">
                                    {feat.title}
                                </h3>

                                <p className="text-[15px] leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                    {feat.desc}
                                </p>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-500/40 transition-all duration-500 group-hover:w-full" />
                        </div>
                    ))}
                </div>
            </section>

            <div className="mx-auto max-w-3xl px-6 mb-32">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-medium tracking-tight text-white">Frequently asked questions</h2>
                </div>
                <div className="divide-y divide-white/5 border-y border-white/5">
                    <FAQItem
                        question="How do payments work without auto-renewal?"
                        answer="Since local gateways like Telebirr don't currently support automatic recurring charges, you purchase a 'pass' for 1, 6, or 12 months. We'll notify you 7 days before your pass expires so you can easily renew without any interruption to your service."
                    />
                    <FAQItem
                        question="Does HizbHub take a cut of my sales?"
                        answer="No. We charge 0% transaction fees on your course sales and paid community memberships. You keep 100% of what you earn (standard Telebirr processing fees still apply)."
                    />
                    <FAQItem
                        question="Can I upgrade my plan later?"
                        answer="Yes! If you start with a 1-month pass and decide to upgrade to a 6-month or 1-year pass, you can do so at any time. The new duration will simply be added to your remaining time."
                    />
                    <FAQItem
                        question="What happens to my data if my pass expires?"
                        answer="Your community, courses, and member data are never deleted. If your pass expires, your hub will be temporarily paused until you renew, but no data will be lost."
                    />
                </div>
            </div>

            {/* Final CTA */}
            <div className="mx-auto max-w-4xl px-6 text-center">
                <h2 className="mb-6 text-4xl font-medium tracking-tight text-white">Ready to build your empire?</h2>
                <p className="mb-8 text-lg text-zinc-400">Join top Ethiopian creators who are already monetizing their knowledge and communities on HizbHub.</p>
                <button className="rounded-full bg-white px-8 py-4 text-base font-medium text-black transition-colors hover:bg-zinc-200">
                    Start Your Hub Today
                </button>
            </div>
        </motion.main>
    );
}
