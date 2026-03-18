"use client";

import { useState } from "react";
import { Clock, ChevronUp, ChevronDown, Zap, Info } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";

type TrialBannerProps = {
    daysLeft: number;
    progress: number;
    subscriptionType: "subscription" | "trial"
}

export function TrialBanner({ daysLeft, progress, subscriptionType }: TrialBannerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout // This handles the width/height change smoothly
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            className={cn(
                "fixed bottom-6 right-6 z-50 overflow-hidden border border-border shadow-2xl",
                "bg-card text-card-foreground rounded-2xl",
                isOpen ? "w-80" : "w-[200px]" // Fixed width when closed prevents the "long width" glitch
            )}
        >
            {/* Header / Collapsed View */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
            >
                <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                    <HugeiconsIcon icon={Clock} className="w-4 h-4 text-primary" />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-bold leading-none truncate">
                        {subscriptionType === "trial" ? (
                            "Trial ends soon"
                        ) : (
                            "Subscription ends soon"
                        )}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">{daysLeft} days remaining</span>
                </div>

                {isOpen ? <HugeiconsIcon icon={ChevronDown} className="w-4 h-4 opacity-50" /> : <HugeiconsIcon icon={ChevronUp} className="w-4 h-4 opacity-50" />}
            </div>

            {/* Expanded Content */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4"
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                                <span>Trial Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                        </div>

                        <div className="flex gap-2 p-2 rounded-lg bg-muted/50 border border-border/50">
                            <HugeiconsIcon icon={Info} className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                After trial, you need to selecte a plan and complete payment
                            </p>
                        </div>

                        <Button size="sm" className="w-full gap-2 font-bold shadow-lg shadow-primary/20">
                            <HugeiconsIcon icon={Zap} className="w-3.5 h-3.5 fill-current" />
                            Upgrade Now
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
