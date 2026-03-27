import { BookOpen, CreditCard, DollarSign, FolderIcon, FolderOpen, FolderTransferIcon, Globe, LockIcon, MessageSquare, Shield, Users } from "@hugeicons/core-free-icons";
import { DeepDiveSection } from "./_components/DeepDiveSection";
import { FeaturesHero } from "./_components/FeaturesHero";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { CommandDashboard } from "./_components/CommandDashboard";
import { FeaturesCta } from "./_components/FeaturesCta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Features - Create, Manage & Monetize Communities | Hizbhub",
    description: "Explore Hizbhub features: create communities, manage members, accept payments, and grow your audience with ease.",
};

export default function FeaturesPage() {
    return (
        <div>
            <FeaturesHero />

            {/* Course System Deep Dive */}
            <DeepDiveSection
                badge="Education"
                title="The Interactive Classroom"
                description="Transition from scattered PDFs and unlisted YouTube videos to a structured, professional online academy. Control your content, brand, and student experience."
                features={[
                    {
                        icon: FolderOpen,
                        title: "Structured Hierarchy",
                        desc: "Organize your knowledge logically. Create folders for modules and pages for individual lessons."
                    },
                    {
                        icon: BookOpen,
                        title: "Rich Text Lessons",
                        desc: "Deliver high-quality written content, embed resources, and guide your students step-by-step."
                    },
                    {
                        icon: LockIcon,
                        title: "Access Control",
                        desc: "Offer free introductory courses to build your audience, or lock premium courses behind a paywall."
                    }
                ]}
                imageContent={
                    <div className="w-full max-w-sm space-y-4">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-white mb-3">
                                <HugeiconsIcon icon={FolderIcon} className="h-4 w-4 text-muted-foreground" /> Module 1: The Basics
                            </div>
                            <div className="space-y-2 pl-7">
                                <div className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                    <HugeiconsIcon icon={BookOpen} className="h-3.5 w-3.5" /> 1.1 Introduction
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                    <HugeiconsIcon icon={BookOpen} className="h-3.5 w-3.5" /> 1.2 Core Concepts
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 opacity-50">
                            <div className="flex items-center gap-3 text-sm font-medium text-white">
                                <HugeiconsIcon icon={FolderIcon} className="h-4 w-4 text-zinc-400" /> Module 2: Advanced
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Community System Deep Dive */}
            <DeepDiveSection
                reverse
                badge="Engagement"
                title="The Living Community"
                description="Discussions happen right alongside your content. Foster a focused, professional environment where members can learn from you and each other without the distractions of a social media feed."
                features={[
                    {
                        icon: MessageSquare,
                        title: "Custom Channels",
                        desc: "Create dedicated spaces for announcements, general chat, feedback, or specific cohorts."
                    },
                    {
                        icon: Users,
                        title: "Member Profiles",
                        desc: "Build a culture of support. Members can interact, comment on posts, and build relationships."
                    },
                    {
                        icon: Shield,
                        title: "Zero Algorithm",
                        desc: "Your reach isn't throttled. When you post an announcement, your entire community sees it."
                    }
                ]}
                imageContent={
                    <div className="w-full max-w-sm space-y-4">
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shrink-0" />
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-medium text-white">Creator</span>
                                    <span className="text-xs text-zinc-500">Just now</span>
                                </div>
                                <p className="mt-1 text-sm text-zinc-300">Welcome to the new cohort! Please introduce yourselves in the general channel.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-4 ml-8">
                            <div className="h-8 w-8 rounded-full bg-zinc-800 shrink-0" />
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-medium text-zinc-300">Student</span>
                                    <span className="text-xs text-zinc-500">2m ago</span>
                                </div>
                                <p className="mt-1 text-sm text-zinc-400">Excited to be here! Looking forward to module 1.</p>
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Monetization Deep Dive */}
            <DeepDiveSection
                badge="Monetization"
                title="The Growth Engine"
                description="Go from creator to business owner with built-in tools designed for the local market. Accept payments directly via Telebirr and manage subscriptions without the complexity of international gateways."
                features={[
                    {
                        icon: CreditCard,
                        title: "Dual Monetization",
                        desc: "Charge monthly/yearly for community access, or sell standalone courses for a one-time fee."
                    },
                    {
                        icon: Globe,
                        title: "Telebirr Integration",
                        desc: "Native integration with Ethiopia's leading mobile money platform. Automated verification and access control."
                    },
                    {
                        icon: DollarSign,
                        title: "Keep Your Revenue",
                        desc: "Stop paying massive cuts to fragmented platforms. Build a sustainable, predictable income stream."
                    }
                ]}
                imageContent={
                    <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-black p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-400">Total Revenue</span>
                            <Badge>This Month</Badge>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-medium tracking-tight text-white">ETB 45,200</span>
                            <span className="text-sm text-zinc-500">.00</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm text-zinc-300">Community Subs</span>
                                </div>
                                <span className="text-sm font-medium text-white">ETB 25,000</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-sm text-zinc-300">Course Sales</span>
                                </div>
                                <span className="text-sm font-medium text-white">ETB 20,200</span>
                            </div>
                        </div>
                    </div>
                }
            />

            <CommandDashboard />
            <FeaturesCta />
        </div>
    )
}
