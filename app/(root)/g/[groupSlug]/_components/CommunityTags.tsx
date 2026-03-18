"use client"

import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp } from '@hugeicons/core-free-icons'; // Or Hugeicons
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from '@hugeicons/react';

export const CommunityTags = ({ tags = [] }: { tags: string[] | null }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!tags) {
        return <span className="text-sm text-muted-foreground/50 italic">No tags</span>
    }
    // Logic: Show 4 tags initially, or all if expanded
    const MAX_VISIBLE = 4;
    const hasMore = tags.length > MAX_VISIBLE;
    const visibleTags = isExpanded ? tags : tags.slice(0, MAX_VISIBLE);

    return (
        <div className="flex items-start gap-4 border-t pt-5 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-8 border-border">
            {/* Icon Container - Centered to the first line of text */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground ring-1 ring-border/50">
                <HugeiconsIcon icon={Tag} size={18} strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-tight">
                        Tags
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 transition-all duration-300 ease-in-out">
                    {tags.length > 0 ? (
                        <>
                            {visibleTags.map((tag, idx) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="px-2.5 py-0.5 text-xs font-medium bg-secondary/40 hover:bg-secondary border-transparent transition-colors"
                                >
                                    #{tag}
                                </Badge>
                            ))}

                            {hasMore && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline ml-1 focus:outline-none"
                                >
                                    {isExpanded ? (
                                        <>Show less <HugeiconsIcon icon={ChevronUp} size={12} /></>
                                    ) : (
                                        <>+{tags.length - MAX_VISIBLE} more</>
                                    )}
                                </button>
                            )}
                        </>
                    ) : (
                        <span className="text-sm text-muted-foreground/40 italic px-1">
                            No tags discovered yet
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
