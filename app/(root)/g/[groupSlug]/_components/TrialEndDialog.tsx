"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { TrialPaymentForm } from "./TrialPaymentForm";
import { SubscripitonPayment } from "./SubscripitonPayment";
import { UnavailableGroup } from "./UnavailableGroup";

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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 max-w-[90vw] w-[900px] h-[80vh] bg-card text-card-foreground rounded-2xl shadow-2xl p-6 overflow-auto pointer-events-auto"
                // stop propagation so clicks inside dialog don't bubble to overlay (not used for close anyway)
                onClick={(e) => e.stopPropagation()}
            >
                {purpose === "owner" ? (
                    subscriptionType === "trial" ? (
                        isUpgrading === true ? (
                            <TrialPaymentForm />
                        ) : (
                            <div className="flex flex-col gap-5 items-center justify-center">
                                <h2 className="text-4xl font-bold">Your Trail has expired.</h2>
                                <p className="font-light">We hope you enjoyed your trial</p>
                                <p className="text-lg">Upgrade to a paid plan to continue use Hizbhub and expand you community</p>
                                <Button onClick={() => setIsupgrading(true)}>
                                    Upgrade
                                </Button>
                            </div>
                        )
                    ) : (
                        <SubscripitonPayment />
                    )
                ) : (
                    <UnavailableGroup />
                )}
            </div>
        </>,
        container
    );
}


