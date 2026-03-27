"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, DollarSign, LayoutGrid, Users } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const features = [
    {
        icon: <HugeiconsIcon icon={LayoutGrid} className="w-5 h-5" />,
        title: "Structured by Design",
        description: "Courses, discussions, and members are organized from day one so your community grows without chaos. Clear hierarchies and intuitive navigation make it simple for new members to find what they need and for creators to scale content.",
        tag: "System",
        visual: (
            <div className="relative w-full h-72 rounded-xl border border-white/10 bg-zinc-900/20 overflow-hidden group-hover:border-white/20 transition-colors duration-500">
                {/* Browser Chrome - Linear Style */}
                <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
                <div className="p-6 pt-12 space-y-4">
                    <div className="h-3 w-3/4 bg-white/10 rounded-sm animate-pulse" />
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-white/[0.03] rounded-md border border-white/5" />
                        ))}
                    </div>
                    <div className="h-3 w-1/2 bg-white/5 rounded-sm" />
                </div>
                {/* Neutral Radial Glow */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/[0.03] blur-[50px]" />
            </div>
        )
    },
    {
        icon: <HugeiconsIcon icon={Users} className="w-5 h-5" />,
        title: "Community in Context",
        description: "Discussions happen right alongside your content. Foster a focused, professional environment where members can learn from you and each other without the distractions of a social media feed.",
        tag: "Focus",
        visual: (
            <div className="relative w-full h-72 rounded-xl border border-white/10 bg-zinc-900/20 overflow-hidden group-hover:border-white/20 transition-colors duration-500">
                <div className="p-8 space-y-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
                        <div className="space-y-2 flex-1">
                            <div className="h-2 w-16 bg-white/10 rounded" />
                            <div className="h-10 w-full bg-white/5 rounded-md border border-white/5" />
                        </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                        <div className="space-y-2 flex-1 flex flex-col items-end">
                            <div className="h-2 w-16 bg-white/10 rounded" />
                            <div className="h-10 w-4/5 bg-white/10 border border-white/10 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.02)]" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">YOU</div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/[0.02] blur-[50px]" />
            </div>
        )
    },
    {
        icon: <HugeiconsIcon icon={DollarSign} className="w-5 h-5" />,
        title: "Monetization for Ethiopia",
        description: "Go from creator to business owner with built-in tools designed for the local market. Accept payments directly via Telebirr and manage subscriptions without the complexity of international gateways.",
        tag: "Growth",
        visual: (
            <div className="relative w-full h-72 rounded-xl border border-white/10 bg-zinc-900/20 overflow-hidden group-hover:border-white/20 transition-colors flex items-center justify-center">
                <div className="w-64 p-5 rounded-xl bg-black border border-white/10 backdrop-blur-xl relative z-10 shadow-2xl">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1 font-bold">Revenue</div>
                    <div className="text-2xl font-bold text-white mb-6 tracking-tight">ETB 45,200.00</div>
                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "70%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        />
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                        <div className="text-[10px] text-zinc-500 font-medium">Auto-settlement active</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                </div>
                {/* Background Grid for visual */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
            </div>
        )
    }
];

export const Differentiators = () => {
    return (
        <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-32"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                        Capabilities
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl mb-6 text-white">
                        A Platform, <span className="text-muted-foreground">Not a Patchwork</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                        Stop juggling tools that were never designed to work together.
                        Hizbhub replaces complexity with structural clarity.
                    </p>
                </motion.div>

                <div className="flex flex-col max-w-6xl gap-40 mx-auto">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="grid items-center gap-16 md:grid-cols-2 group"
                        >
                            <div className={`${i % 2 === 1 ? "md:order-2" : ""} space-y-8`}>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            {feature.icon}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">{feature.title}</h3>
                                    </div>
                                    <p className="text-md text-muted-foreground leading-relaxed font-light">
                                        {feature.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 pt-4">
                                    {["Professional UX", "Localized for Ethiopia", "High-performance"].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                            <HugeiconsIcon icon={CheckCircle} className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <motion.div
                                className={`${i % 2 === 1 ? "md:order-1" : ""} relative`}
                            >
                                <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                                    {feature.visual}
                                </div>
                                {/* Studio Lighting Effect (Neutral) */}
                                <div className="absolute inset-0 -z-10 bg-white/[0.02] blur-[100px] rounded-full transform scale-90" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
