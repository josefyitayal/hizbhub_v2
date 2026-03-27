"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { TrialPaymentForm } from "./TrialPaymentForm";
import { SubscripitonPayment } from "./SubscripitonPayment";
import { UnavailableGroup } from "./UnavailableGroup";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Check, Trophy } from "@hugeicons/core-free-icons";
import { ScrollArea } from "@/components/ui/scroll-area";

type TrialEndDialogProps = {
    open: boolean;
    subscriptionType: "subscription" | "trial";
    purpose: "owner" | "member"
};

export function TrialEndDialog({ open, purpose, subscriptionType }: TrialEndDialogProps) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);
    const [isUpgrading, setIsupgrading] = React.useState(false)

    React.useEffect(() => {
        setContainer(document.getElementById("page-dialog-root"));
    }, []);

    // Prevent Escape from closing anything (we don't close on escape)
    React.useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        if (open) {
            document.addEventListener("keydown", onKey, true);
        }
        return () => document.removeEventListener("keydown", onKey, true);
    }, [open]);

    if (!container) return null;
    if (!open) return null;

    return createPortal(
        <>
            {/* Overlay: covers main area only */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-auto"
                aria-hidden="true"
            // Do NOT add onClick here — we intentionally do not close on outside clicks
            />

            {/* Dialog content */}
            <div
                role="dialog"
                aria-modal="true"
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 max-w-[90vw] w-[900px] h-[85vh] bg-card text-card-foreground rounded-2xl shadow-2xl p-6 pointer-events-auto"
                // stop propagation so clicks inside dialog don't bubble to overlay (not used for close anyway)
                onClick={(e) => e.stopPropagation()}
            >
                <ScrollArea className="w-full h-full">
                    {purpose === "owner" ? (
                        subscriptionType === "trial" ? (
                            isUpgrading === true ? (
                                <TrialPaymentForm />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    {/* Success/Expiry Icon Shield */}
                                    <div className="relative mb-10">
                                        <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse" />
                                        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-emerald-500/20 bg-zinc-950 shadow-2xl overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                                            <HugeiconsIcon
                                                icon={Trophy}
                                                className="h-10 w-10 text-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Typography Section */}
                                    <div className="max-w-md space-y-4 mb-10">
                                        <Badge variant="outline" className="mb-2 border-zinc-800 text-zinc-500 font-bold tracking-widest uppercase text-[10px]">
                                            Milestone Reached
                                        </Badge>
                                        <h2 className="text-4xl font-semibold tracking-tight text-white">
                                            Your journey is <span className="text-emerald-500">just beginning.</span>
                                        </h2>
                                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                                            Your 14-day trial has concluded. We hope you enjoyed exploring the power of <span className="text-white font-medium">Hizbhub</span>.
                                        </p>
                                    </div>

                                    {/* Upgrade Value Prop Box */}
                                    <div className="w-full max-w-sm rounded-[2rem] border border-zinc-800/50 bg-zinc-900/30 p-6 mb-10 text-left">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 text-center">
                                            Ready for the next level?
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                "Restore community access instantly",
                                                "Unlock unlimited course uploads",
                                                "Automate payments via Telebirr & Chapa"
                                            ].map((text, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                                    <HugeiconsIcon icon={Check} className="h-4 w-4 text-emerald-500" />
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <button
                                            onClick={() => setIsupgrading(true)}
                                            className="w-full max-w-sm rounded-2xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-zinc-100 hover:scale-[1.01] active:scale-[0.98] shadow-xl"
                                        >
                                            Upgrade to Pro Now
                                        </button>

                                        <p className="text-xs text-zinc-600 font-medium">
                                            Join 500+ creators scaling their vision on Hizbhub.
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <SubscripitonPayment />
                        )
                    ) : (
                        <UnavailableGroup />
                    )}
                </ScrollArea>
            </div>
        </>,
        container
    );
}


