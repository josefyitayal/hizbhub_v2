"use client"

import { Badge } from "@/components/ui/badge";
import { LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function CommandDashboard() {
    return (
        <section className="py-24 border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <Badge className="mb-6">The Command Center</Badge>
                    <h2 className="mb-4 text-3xl font-medium tracking-tight text-white sm:text-4xl">Manage everything from one place.</h2>
                    <p className="mx-auto max-w-2xl text-zinc-400">A professional dashboard designed for focus. Manage your courses, community, and payments without the context switching.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card 1: Unified Dashboard (Spans 2 columns) */}
                    <div className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 hover:bg-zinc-900/50 transition-colors">
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="mb-8 flex h-48 w-full items-center justify-center rounded-xl border border-white/10 bg-black/50 p-4 shadow-2xl">
                                {/* Mock Dashboard UI */}
                                <div className="flex h-full w-full gap-4">
                                    {/* Sidebar */}
                                    <div className="w-1/4 rounded-lg bg-white/5 p-3 flex flex-col gap-3">
                                        <div className="h-3 w-full rounded bg-white/10" />
                                        <div className="h-3 w-3/4 rounded bg-white/5" />
                                        <div className="h-3 w-5/6 rounded bg-white/5" />
                                        <div className="mt-auto h-3 w-full rounded bg-white/5" />
                                    </div>
                                    {/* Main Content */}
                                    <div className="flex flex-1 flex-col gap-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="h-4 w-1/3 rounded bg-white/10" />
                                            <div className="h-6 w-16 rounded-full bg-white/5" />
                                        </div>
                                        {/* Content Grid */}
                                        <div className="flex gap-3 h-full">
                                            <div className="flex-1 rounded-lg bg-white/5 border border-white/5 flex flex-col p-3 gap-2">
                                                <div className="h-2 w-1/2 rounded bg-white/10" />
                                                <div className="h-6 w-3/4 rounded bg-white/20" />
                                            </div>
                                            <div className="flex-1 rounded-lg bg-white/5 border border-white/5 flex flex-col p-3 gap-2">
                                                <div className="h-2 w-1/2 rounded bg-white/10" />
                                                <div className="h-6 w-3/4 rounded bg-white/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-white">Unified Dashboard</h3>
                                <p className="text-sm text-zinc-400">Get a bird's-eye view of your entire digital business. Track revenue, active members, and recent engagement in one clean interface.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Member Management */}
                    <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 hover:bg-zinc-900/50 transition-colors">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="mb-8 flex h-48 w-full flex-col justify-center gap-3 rounded-xl border border-white/10 bg-black/50 p-6 shadow-2xl">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-2 transition-transform group-hover:translate-x-1" style={{ transitionDelay: `${i * 50}ms` }}>
                                        <div className="h-6 w-6 shrink-0 rounded-full bg-zinc-800" />
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="h-2 w-1/2 rounded bg-zinc-600" />
                                            <div className="h-1 w-1/3 rounded bg-zinc-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-white">Member Management</h3>
                                <p className="text-sm text-zinc-400">View profiles, track course progress, and handle access control effortlessly.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Basic Analytics */}
                    <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 hover:bg-zinc-900/50 transition-colors">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="mb-8 flex h-48 w-full items-end gap-2 rounded-xl border border-white/10 bg-black/50 p-6 shadow-2xl">
                                {[40, 70, 45, 90, 65, 80].map((h, i) => (
                                    <div key={i} className="w-full rounded-t-sm bg-zinc-800 transition-all duration-500 group-hover:bg-white/20" style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }} />
                                ))}
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-white">Basic Analytics</h3>
                                <p className="text-sm text-zinc-400">Understand what's working. Track course enrollments and revenue trends over time.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Secure Auth */}
                    <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 hover:bg-zinc-900/50 transition-colors">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="mb-8 flex h-48 w-full items-center justify-center rounded-xl border border-white/10 bg-black/50 p-6 shadow-2xl">
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10">
                                    <HugeiconsIcon icon={LockIcon} className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors" />
                                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-black bg-emerald-500" />
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-white">Secure Auth</h3>
                                <p className="text-sm text-zinc-400">Enterprise-grade security powered by Clerk. Seamless sign-up experience.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: High-Performance (Spans 2 on md, 1 on lg) */}
                    <div className="group relative col-span-1 md:col-span-2 lg:col-span-1 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 hover:bg-zinc-900/50 transition-colors">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="mb-8 flex h-48 w-full items-center justify-center rounded-xl border border-white/10 bg-black/50 p-6 shadow-2xl">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-7xl font-medium tracking-tighter text-white transition-all duration-500 group-hover:text-emerald-400">99</span>
                                    <span className="text-2xl text-zinc-600">ms</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium text-white">High-Performance</h3>
                                <p className="text-sm text-zinc-400">Built on Next.js and Vercel. Lightning-fast page loads keep members engaged.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
