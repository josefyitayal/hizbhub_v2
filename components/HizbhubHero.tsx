"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ChevronRight, Sparkles } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";

const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
        },
    },
};

export const Hero = () => {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen pt-32 pb-20 overflow-hidden bg-background text-white">

            {/* --- Linear Background Effects --- */}
            <div className="absolute inset-0 z-0">
                {/* Subtle Top Spotlight */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

                {/* The Linear Grid - Very faint */}
                <div
                    className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* --- Main Content --- */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    show: {
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
                className="container relative z-10 px-6 text-center"
            >
                {/* Premium Shiny Badge */}
                <motion.div
                    variants={FADE_UP_ANIMATION_VARIANTS}
                    className="inline-flex items-center gap-2 px-3 py-1 mb-10 text-xs font-medium rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-zinc-400 hover:border-white/20 transition-colors cursor-default"
                >
                    <HugeiconsIcon icon={Sparkles} className="w-3.5 h-3.5 text-white" />
                    <span className="tracking-wide">The future of Ethiopian Education</span>
                </motion.div>

                {/* Hero Title: Bold, Tight, and Gradient */}
                <motion.h1
                    variants={FADE_UP_ANIMATION_VARIANTS}
                    className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-[100px] leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 pb-6"
                >
                    Don’t just sell a course. <br className="hidden md:block" />
                    <span className="text-white">Build a movement.</span>
                </motion.h1>

                {/* Refined Subtitle: Narrower for readability */}
                <motion.p
                    variants={FADE_UP_ANIMATION_VARIANTS}
                    className="max-w-[640px] mx-auto mt-6 text-lg text-zinc-400 md:text-xl leading-relaxed font-light"
                >
                    Hizbhub helps Ethiopian creators turn expertise into a professional classroom, a living community, and sustainable income.
                </motion.p>

                {/* Action Buttons: Shadcn Primary (White) and Outline */}
                <motion.div
                    variants={FADE_UP_ANIMATION_VARIANTS}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
                >
                    <Button
                        size="lg"
                        asChild
                        className="h-14 px-10 text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Link href="/sign-up">
                            Start Your Hub
                            <HugeiconsIcon icon={ChevronRight} className="ml-1 w-4 h-4" />
                        </Link>
                    </Button>

                    <Button
                        size="lg"
                        variant="secondary"
                        asChild
                        className="h-14 px-10 text-sm font-medium bg-secondary"
                    >
                        <Link href="#features">See How It Works</Link>
                    </Button>
                </motion.div>

            </motion.div>
        </section>
    );
};
