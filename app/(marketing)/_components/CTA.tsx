"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";

export const CTA = () => {
    return (
        <section className="relative py-28 sm:py-36 bg-background overflow-hidden">
            {/* Top divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container relative z-10 px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative max-w-6xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur-md overflow-hidden"
                >
                    {/* ================= BACKGROUND SYSTEM ================= */}


                    {/* Subtle grid pattern (masked & faded) */}
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                                linear-gradient(to bottom, white 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                            maskImage:
                                "radial-gradient(circle at center, black 40%, transparent 75%)",
                            WebkitMaskImage:
                                "radial-gradient(circle at center, black 40%, transparent 75%)",
                        }}
                    />

                    {/* ================= CONTENT ================= */}

                    <div className="relative z-10 px-10 py-20 sm:px-16 text-center">
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
                        >
                            Digital ownership
                        </motion.div>

                        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
                            Build once.
                            <br />
                            <span className="text-muted-foreground">
                                Own it forever.
                            </span>
                        </h2>

                        <p className="max-w-xl mx-auto text-muted-foreground text-lg leading-relaxed font-light mb-12">
                            Hizbhub is designed for creators who want permanence —
                            not algorithms, feeds, or borrowed attention.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.div whileHover={{ y: -3 }}>
                                <Button
                                    size="lg"
                                    asChild
                                    className="h-14 px-10"
                                >
                                    <Link href="/create-group">
                                        Start your hub
                                        <HugeiconsIcon icon={ArrowRight} className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </motion.div>

                            <Link
                                href="/features"
                                className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-white transition-colors"
                            >
                                How it works →
                            </Link>
                        </div>

                        <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            No credit card required
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom divider */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>
    );
};
