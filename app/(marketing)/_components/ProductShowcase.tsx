"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export const ProductShowcase = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // Refined transforms for a smoother "unfolding" feel
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
    const translateY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

    return (
        <section
            ref={ref}
            className="relative pt-20 pb-40 bg-background"
            style={{ perspective: "2000px" }}
        >

            <div className="container px-6 mx-auto relative z-10">
                {/* Section Intro Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-xs font-medium text-muted-foreground tracking-[0.3em] uppercase mb-4">
                        The Command Center
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
                        Everything you need. <br />
                        <span className="text-zinc-500">None of the clutter.</span>
                    </h3>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
                        Manage your courses, community, and payments from one high-performance interface designed for focus.
                    </p>
                </motion.div>

                {/* --- The 3D Dashboard Container --- */}
                <motion.div
                    style={{
                        rotateX,
                        scale,
                        opacity,
                        y: translateY,
                        transformStyle: "preserve-3d",
                    }}
                    className="relative mx-auto max-w-[1200px]"
                >
                    {/* Main Frame with Linear-style Border/Shadow */}
                    <div className="group relative rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden shadow-[0_0_100px_-20px_rgba(255,255,255,0.1)]">

                        {/* Browser-style Top Bar */}
                        <div className="flex items-center justify-between h-10 px-4 border-b border-white/5 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                            </div>
                            <div className="px-3 py-0.5 rounded-md border border-white/5 bg-black/20 text-[10px] text-zinc-500 font-mono">
                                hizbhub.com/dashboard
                            </div>
                            <div className="w-10" /> {/* Spacer */}
                        </div>

                        {/* Content Area */}
                        <div className="relative">
                            <Image
                                src="/hizbhub community screenshot.png" // Replace with your high-res dashboard screenshot
                                alt="HizbHub Dashboard"
                                width={800}
                                height={800}
                                className="w-full h-auto grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                            />

                        </div>
                    </div>

                </motion.div>
            </div>

            {/* Background Grid - consistent with Hero */}
            <div
                className="absolute inset-0 -z-20 opacity-[0.02] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </section>
    );
};
