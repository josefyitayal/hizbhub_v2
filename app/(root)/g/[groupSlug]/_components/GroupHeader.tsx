'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { useGroup } from './context/GroupContext';
import { useCurrentGroupQuery } from './hooks/useCurrentGroupQuery';


// Define the structure of a single tab item
type TabItem = {
    name: string;
    href: string;
}

export function GroupHeader() {
    const pathname = usePathname();
    const { data: { group } } = useCurrentGroupQuery()
    if (!group?.isMember) return null;

    // Define your navigation links
    const tabs: TabItem[] = [
        { name: 'Community', href: `/g/${group.slug}/community` },
        { name: 'Course', href: `/g/${group.slug}/course` },
        { name: 'Members', href: `/g/${group.slug}/members` },
        { name: 'About', href: `/g/${group.slug}` },
    ];

    return (
        // The main container provides the full width and overall look of a header
        <header className="w-full bg-sidebar border-b border-border shadow-sm sticky top-0 z-10">
            <nav className="flex items-center justify-center space-x-1 h-14 px-4" aria-label="Group tabs">
                {tabs.map((tab) => {
                    const clean = (url: string) => url.replace(/\/+$/, "");
                    const currentPath = clean(pathname);
                    const tabPath = clean(tab.href);

                    // 1. Define which tab is the "Base/About" tab
                    const isAboutTab = tabPath === `/g/${group.slug}`;

                    const isActive = isAboutTab
                        ? currentPath === tabPath // Exact match for About
                        : currentPath.startsWith(tabPath); // Prefix match for others

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            // Modern "pill-shaped" or underlined tabs
                            className={cn(
                                "flex items-center justify-center h-full px-4 text-sm font-medium transition-colors relative group",
                                isActive
                                    ? "text-primary" // Active color
                                    : "text-muted-foreground hover:text-foreground", // Inactive color
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {tab.name}

                            {/* Modern active indicator bar below the text */}
                            <span className={cn(
                                "absolute bottom-0 left-0 h-0.5 w-full bg-primary transition-transform duration-200",
                                isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50"
                            )} />
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
