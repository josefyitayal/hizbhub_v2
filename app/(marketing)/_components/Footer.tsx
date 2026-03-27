"use client";

import Link from "next/link";
import { Layers, Twitter, Github, Linkedin, ArrowUp } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-background border-t border-white/[0.08] overflow-hidden">

            {/* ================= CONTENT ================= */}
            <div className="relative z-10 pt-20 pb-10">
                <div className="container px-6 mx-auto">
                    {/* Main Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

                        {/* Brand Section */}
                        <div className="flex flex-col items-start space-y-6">
                            <Link href="/" className="group flex items-center gap-3">
                                <div className="relative flex items-center justify-center w-11 h-11 rounded-sm border border-white/20 bg-black transition-all duration-300 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    <HugeiconsIcon icon={Layers} className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-bold tracking-tighter text-white">
                                    Hizb<span className="text-zinc-600 font-light">hub</span>
                                </span>
                            </Link>
                            <p className="text-sm text-zinc-500 leading-relaxed font-light max-w-xs">
                                Engineering the future of Ethiopian digital sovereignty.
                                Build, own, and scale your audience.
                            </p>
                            <div className="flex items-center gap-6 text-zinc-600">
                                {[Twitter, Github, Linkedin].map((Icon, i) => (
                                    <HugeiconsIcon
                                        icon={Icon}
                                        key={i}
                                        className="w-4 h-4 hover:text-white hover:scale-110 transition-all cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Navigation 1 */}
                        <div className="sm:pl-8 lg:pl-0">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90 mb-8 border-l-2 border-white/40 pl-3">
                                Platform
                            </h4>
                            <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
                                {["Features", "Use Cases", "Pricing", "Blog"].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Navigation 2 */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90 mb-8 border-l-2 border-white/40 pl-3">
                                Company
                            </h4>
                            <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
                                {["About Us", "Privacy", "Contact"].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase()}`} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Studio-style Contact/Location Card */}
                        <div className="group relative rounded-sm border border-white/10 bg-gradient-to-br from-zinc-900/50 to-black p-6 overflow-hidden">
                            {/* Inner sudden flash on hover */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />

                            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">
                                ETHIOPIA
                            </h4>
                            <p className="text-[11px] text-zinc-500 mb-6 leading-relaxed font-light">
                                Conceived and engineered in the heart of Ethiopia for the next generation.
                            </p>

                            <button
                                onClick={scrollToTop}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white group/btn"
                            >
                                <span className="relative overflow-hidden">
                                    <span className="inline-block transition-transform duration-300 group-hover/btn:-translate-y-full">Back to Top</span>
                                    <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0 text-zinc-400">Jump Up</span>
                                </span>
                                <HugeiconsIcon icon={ArrowUp} className="w-3 h-3 transition-transform group-hover/btn:-translate-y-1" />
                            </button>
                        </div>
                    </div>

                    {/* --- Bottom Metadata Bar --- */}
                    <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-700">
                                © {new Date().getFullYear()} Hizbhub Tech PLC.
                            </p>
                            <Link href="/terms" className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-700 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>

                        {/* Status Label - Sudden contrast */}
                        <div className="flex items-center gap-3 px-4 py-1.5 rounded-sm bg-white/[0.03] border border-white/10">
                            <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                                Platform Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
