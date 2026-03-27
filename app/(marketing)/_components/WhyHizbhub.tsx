"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Globe, ShieldCheck, ArrowRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const problems = [
    {
        title: "Scattered content",
        description: "Insights shouldn't die in a WhatsApp thread or a telegram group chat.",
        icon: <HugeiconsIcon icon={Zap} className="w-5 h-5" />,
        rotate: -6,
        y: 0,
    },
    {
        title: "Disjointed tools",
        description: "Stop making members jump between five different apps to learn from you.",
        icon: <HugeiconsIcon icon={Globe} className="w-5 h-5" />,
        rotate: 3,
        y: 45,
    },
    {
        title: "Zero ownership",
        description: "Algorithm changes shouldn't be a death sentence for your hard work.",
        icon: <HugeiconsIcon icon={ShieldCheck} className="w-5 h-5" />,
        rotate: -2,
        y: 90,
    },
];

export const WhyHizbhub = () => {
    const containerRef = useRef(null);

    return (
        <section
            ref={containerRef}
            className="relative py-32 overflow-hidden bg-background"
        >
            {/* Top Border Divider - Linear Style */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container relative z-10 grid items-center gap-10 px-6 mx-auto lg:grid-cols-2">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center px-3 py-1 mb-8 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full border border-white/10 bg-white/5 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mr-2" /> The Problem
                    </div>

                    <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-muted-foreground">
                        Your expertise deserves <br />
                        <span className="text-white">a permanent home.</span>
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-lg font-light">
                        Knowledge shared in group chats gets buried and forgotten. Hizbhub gives your expertise the structure it deserves so your work becomes discoverable, repeatable, and respected.
                    </p>

                    <motion.div
                        className="mt-10 flex items-center gap-2 group cursor-default w-fit"
                        whileHover={{ x: 5 }}
                    >
                        <span className="text-xs font-semibold tracking-widest uppercase text-white">
                            Why creators are moving to Hizbhub
                        </span>
                        <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                </motion.div>

                {/* Right Visual - The Linear Stack */}
                <div className="relative h-[500px] flex items-center justify-center lg:justify-end pr-0 lg:pr-12">
                    {/* Background Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full -z-10" />

                    {problems.map((problem, i) => (
                        <motion.div
                            key={problem.title}
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                                y: problem.y,
                                rotate: problem.rotate,
                            }}
                            whileHover={{
                                rotate: 0,
                                scale: 1.02,
                                zIndex: 50,
                                transition: { duration: 0.2 },
                            }}
                            viewport={{ once: true }}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] p-8 rounded-xl border border-border bg-card opacity-80 backdrop-blur-xl shadow-2xl"
                            style={{
                                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
                            }}
                        >
                            <div className="mb-6 p-2.5 w-fit rounded-lg bg-white text-black">
                                {problem.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                                {problem.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-light">
                                {problem.description}
                            </p>

                            {/* Edge highlight */}
                            <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-tr from-white/5 to-transparent opacity-40" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Grid Pattern consistent with previous sections */}
            <div
                className="absolute inset-0 -z-20 opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </section>
    );
};
