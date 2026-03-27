"use client";

import React, { useState } from "react";
import { Check, Copy, User } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

interface CopyLinkProps {
    value: string;
    isCreator?: boolean;
}

export default function CopyLink({ value, isCreator = true }: CopyLinkProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Faild to copy");
        }
    };

    return (
        <div className="flex items-center gap-2 w-full rounded-lg max-w-md group p-1 bg-secondary border border-border">
            {/* Creator Tag: Only shows if isCreator is true */}
            {isCreator && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-md text-xs text-primary-foreground font-bold tracking-wide animate-in fade-in slide-in-from-left-2 duration-300">
                    <HugeiconsIcon icon={User} size={12} strokeWidth={3} />
                    <span>CREATOR</span>
                </div>
            )}

            {/* Input Container */}
            <div className="relative flex-1 flex items-center">
                <Input
                    type="text"
                    readOnly
                    value={value}
                />

                {/* Modern Copy Button */}
                <Button
                    onClick={handleCopy}
                    className={`ml-2 flex items-center justify-center bg-card p-2.5 transition-all duration-300 active:scale-95 ${copied
                        ? "bg-emerald-500 text-white shadow-emerald-500/40"
                        : "bg-secondary border border-border text-white"
                        }`}
                    aria-label="Copy link"
                >
                    {copied ? (
                        <HugeiconsIcon icon={Check} size={18} strokeWidth={2.5} className="animate-in zoom-in duration-300" />
                    ) : (
                        <HugeiconsIcon icon={Copy} size={18} strokeWidth={2} />
                    )}
                </Button>
            </div>
        </div>
    );
}
