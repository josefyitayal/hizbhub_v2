"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, PhoneCall, ShieldCheck, Zap } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const localfeatures = [
    {
        icon: <HugeiconsIcon icon={CreditCard} className="w-4 h-4" />,
        label: "Telebirr & Local Pay",
    },
    {
        icon: <HugeiconsIcon icon={PhoneCall} className="w-4 h-4" />,
        label: "Local Support Team",
    },
    {
        icon: <HugeiconsIcon icon={ShieldCheck} className="w-4 h-4" />,
        label: "Compliant & Secure",
    },
    {
        icon: <HugeiconsIcon icon={Zap} className="w-4 h-4" />,
        label: "Low Latency (Local)",
    }
];

export const BuiltForEthiopia = () => {
    return (
        <section className="relative py-24 sm:py-32 bg-background overflow-hidden">

            <div className="container relative z-10 px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    // Radius tightened from 2.5rem to 1.5rem (xl/2xl)
                    className="max-w-4xl mx-auto p-12 rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-md text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    {/* Top Badge - Monochromatic & Precise */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 mb-10 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]"
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-muted-foreground"></span>
                        </span>
                        Local Sovereignty
                    </motion.div>

                    <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-muted-foreground">
                        Built for Ethiopia, <br className="hidden sm:block" />
                        <span className="text-white">by Ethiopians.</span>
                    </h2>

                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed font-light mb-12">
                        Hizbhub is designed around the realities of Ethiopian creators—local payment preferences, language sensibilities, and market dynamics. We understand what it takes to build a sustainable knowledge business here.
                    </p>

                    {/* Local Feature Chips Grid - Sharper Radius & Border */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
                        {localfeatures.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                className="flex flex-col items-center gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group"
                            >
                                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-muted-foreground group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                    {item.icon}
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-zinc-300 transition-colors">
                                    {item.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Subtle bottom border line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>
    );
};
