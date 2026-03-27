"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle, DollarSign, Users } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const pillars = [
    {
        icon: <HugeiconsIcon icon={BookOpen} className="w-6 h-6" />,
        title: "The Interactive Classroom",
        description:
            "Create structured courses with clear lessons and modules so learners follow a logical path from basics to mastery. Host video lessons, written guides, downloadable resources, and quizzes in one branded space that reflects your professional identity. Use checkpoints, completion badges, and assessments to show progress and turn learning into measurable outcomes.",
        tag: "Education",
    },
    {
        icon: <HugeiconsIcon icon={Users} className="w-6 h-6" />,
        title: "The Living Community",
        description:
            "Bring learners together in focused discussions led by you, where questions, wins, and peer feedback happen in context. Run live Q&As, mentorship threads, and cohort-based conversations that keep momentum between lessons. Member profiles, pinned posts, and activity feeds make it easy to recognize contributors and build a culture of support.",
        tag: "Engagement",
    },
    {
        icon: <HugeiconsIcon icon={DollarSign} className="w-6 h-6" />,
        title: "The Growth Engine",
        description:
            "Monetize your work with tools built for Ethiopian creators — from Telebirr payments to flexible subscriptions and trial periods. Manage one-time purchases, recurring plans, and cohort access without juggling third-party tools. Built-in analytics show enrollments, retention, and revenue so you can refine offers and grow predictably.",
        tag: "Monetization",
    },
];

export const Pillars = () => {
    return (
        <section id="features" className="relative py-24 sm:py-32 bg-background overflow-hidden">
            {/* --- Linear Style Background Decorative Element --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-50 pointer-events-none">
                {/* Changed indigo to a cold white "studio light" glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[120px] rounded-full" />
            </div>

            <div className="container relative z-10 px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-muted-foreground">
                        The Hizbhub Experience
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                        A systematic approach to building a digital business, from content to community to cashflow. Everything you need to teach, engage, and grow designed as one connected system, everything unified.
                    </p>
                </motion.div>

                <div className="relative max-w-5xl mx-auto mt-20">
                    {/* --- The Glowing Timeline Line (Monochrome) --- */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block"
                    />

                    {pillars.map((pillar, i) => {
                        const isOdd = i % 2 !== 0;
                        return (
                            <div key={pillar.title} className="relative mb-20 md:mb-32">
                                {/* Mobile Dot - White/Zinc */}
                                <div className="md:hidden absolute -left-2 top-0 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

                                <motion.div
                                    initial={{ opacity: 0, x: isOdd ? 40 : -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex flex-col md:flex-row items-center ${isOdd ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* --- Content Card (Tight Radius & Border) --- */}
                                    <div className={`w-full md:w-1/2 ${isOdd ? "md:pl-16" : "md:pr-16"}`}>
                                        <div className="relative p-8 rounded-xl border border-white/10 bg-card backdrop-blur-md hover:border-white/20 transition-all duration-500 group">
                                            {/* Tag - Monochrome */}
                                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-white/5 border border-white/5 text-muted-foreground group-hover:text-zinc-200 transition-colors">
                                                {pillar.tag}
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                                                    {pillar.icon}
                                                </div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">
                                                    {pillar.title}
                                                </h3>
                                            </div>

                                            <p className="text-muted-foreground text-sm leading-relaxed font-light">
                                                {pillar.description}
                                            </p>

                                            {/* Subtle white-to-transparent hover effect */}
                                            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <HugeiconsIcon icon={CheckCircle} className="w-3.5 h-3.5" />
                                                <span>System Ready</span>
                                            </div>

                                            {/* Top Corner Reflection */}
                                            <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                    </div>

                                    {/* --- Center Node (Sharp White Shadow) --- */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                                        <motion.div
                                            whileInView={{ scale: [0, 1.2, 1] }}
                                            className="w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center z-20"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                                        </motion.div>
                                    </div>

                                    <div className="hidden md:block md:w-1/2" />
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Subtle Grid - Standard Linear.app style */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </section>
    );
};
