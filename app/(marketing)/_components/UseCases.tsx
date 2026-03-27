"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Lightbulb, Users, ArrowUpRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const useCases = [
    {
        title: "Educators & Tutors",
        description:
            "Transition from scattered lessons to a structured, professional online academy. Control your content, brand, and student experience.",
        icon: <HugeiconsIcon icon={GraduationCap} className="w-5 h-5" />,
    },
    {
        title: "Subject Matter Experts",
        description:
            "Monetize your deep knowledge by building a premium community hub for your audience to learn and connect.",
        icon: <HugeiconsIcon icon={Lightbulb} className="w-5 h-5" />,
    },
    {
        title: "Community Leaders",
        description:
            "Create a focused, private space for your members to thrive, away from the noise of traditional social media.",
        icon: <HugeiconsIcon icon={Users} className="w-5 h-5" />,
    },
];

export const UseCases = () => {
    return (
        <section id="use-cases" className="relative py-24 sm:py-32 bg-background overflow-hidden">
            {/* --- Monochromatic Top Border --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container relative z-10 px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl mb-6">
                        Who Is Hizbhub For?
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                        Tailored for Ethiopian professionals who are serious about
                        reclaiming their audience and building a sovereign digital business.
                    </p>
                </motion.div>

                <div className="grid max-w-6xl gap-4 mx-auto md:grid-cols-3">
                    {useCases.map((useCase, i) => (
                        <motion.div
                            key={useCase.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -4 }}
                            className="relative group p-8 rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-md hover:border-white/20 hover:bg-zinc-900/40 transition-all duration-500 overflow-hidden"
                        >
                            {/* --- Subtle "Studio Light" Hover Effect --- */}
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/[0.02] blur-[80px] rounded-full group-hover:bg-white/[0.05] transition-colors duration-500" />

                            <div className="relative z-10">
                                {/* Icon Container - Sharp & Pro */}
                                <div className="inline-flex items-center justify-center w-10 h-10 mb-8 rounded-lg bg-zinc-900 border border-white/10 text-muted-foreground group-hover:bg-white group-hover:text-black transition-all duration-500">
                                    {useCase.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                                    {useCase.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-light">
                                    {useCase.description}
                                </p>

                                {/* Action Link - Monochromatic Tag Style */}
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white transition-colors duration-300">
                                    <span>Explore Persona</span>
                                    <HugeiconsIcon icon={ArrowUpRight} className="w-3.5 h-3.5" />
                                </div>
                            </div>

                            {/* Faded Background Icon - Darker & Subtle */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-500">
                                {React.cloneElement(useCase.icon as React.ReactElement<{ className?: string }>, {
                                    className: 'w-full h-full'
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subtle bottom border line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>
    );
};
