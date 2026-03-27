"use client";

import Image from "next/image";
import { Filter, SearchIcon, Users, X, Plus, ArrowRight } from "@hugeicons/core-free-icons";          // for member icon
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySelector from "@/components/CategorySelector";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { HugeiconsIcon } from "@hugeicons/react";

export default function DiscoverPage() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [activeSearch, setActiveSearch] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery(
        orpc.group.list.discover.infiniteOptions({
            input: (pageParam: string | undefined) => ({
                search: activeSearch,
                category: selectedCategory,
                cursor: pageParam,
                limit: 10,
                top: !activeSearch && !selectedCategory,
            }),
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        })
    );

    const groups = data?.pages.flatMap(page => page.items) ?? [];

    function handleSearchClick() {
        // Set activeSearch to the typed value to actually run the search
        setActiveSearch(searchValue.trim() === "" ? undefined : searchValue.trim());
        // Optionally clear category if you want pure search: setSelectedCategory(undefined);
    }

    function handleClearSearch() {
        setSearchValue("");
        setActiveSearch(undefined);
    }

    return (
        <div className="flex flex-col gap-10 pt-32 pb-64">
            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-between gap-6 w-full h-[50vh] px-10">
                <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
                    <div className="flex flex-col items-center gap-3">
                        <Button onClick={() => router.push("/create-group")} size="sm">Build you community</Button>
                        <h1 className="text-4xl font-bold tracking-tighter p-0 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 pb-6 text-center">More Than a Group. A Hizb.</h1>

                        <p className="text-muted-foreground text-lg text-center max-w-xl">Discover spaces where members build together sharing knowledge, supporting growth, and creating real value.</p>

                    </div>

                    {/* SEARCH BAR */}
                    <div className="rounded-full w-[60%] border border-border bg-sidebar-studio flex items-center gap-3 p-3 pl-6">
                        <input
                            placeholder="Type to search..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full outline-none"
                        />
                        <Button
                            className="h-10 px-3 rounded-full cursor-pointer"
                            onClick={handleSearchClick}
                        >
                            <HugeiconsIcon icon={SearchIcon} />
                        </Button>
                    </div>
                </div>
                {/* CATEGORY SELECTOR AT BOTTOM */}
                <CategorySelector value={selectedCategory} onChange={setSelectedCategory} />
            </div>

            <div className="cinematic-divider" />

            <div className="px-10 selection:bg-white/10">
                {/* GROUP GRID / Empty State */}
                <AnimatePresence mode="wait">
                    {(activeSearch || selectedCategory) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 mb-10 flex-wrap"
                        >
                            <span className="text-lg font-mono uppercase tracking-widest text-muted-foreground mr-2">Filters Applied:</span>

                            {activeSearch && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                                    <span>"{activeSearch}"</span>
                                    <button onClick={handleClearSearch} className="hover:text-white transition-colors">
                                        <HugeiconsIcon icon={X} className="size-5" />
                                    </button>
                                </div>
                            )}

                            {selectedCategory && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                                    <HugeiconsIcon icon={Filter} className="size-4 text-muted-foreground" />
                                    <span>{selectedCategory}</span>
                                    <button onClick={() => setSelectedCategory(undefined)} className="hover:text-white transition-colors">
                                        <HugeiconsIcon icon={X} className="size-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- CONTENT ENGINE --- */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="space-y-4">
                                <Skeleton className="aspect-video w-full rounded-xl bg-zinc-900" />
                                <Skeleton className="h-4 w-3/4 bg-zinc-900" />
                                <Skeleton className="h-4 w-1/2 bg-zinc-900" />
                            </div>
                        ))}
                    </div>
                ) : groups.length === 0 ? (

                    /* --- EMPTY STATE: The Studio Spotlight --- */
                    <div className="relative w-full py-52 flex flex-col items-center justify-center border border-white/[0.03] rounded-3xl bg-zinc-950/20 overflow-hidden">
                        {/* Studio Light Leak */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="mb-6 w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl">
                            <HugeiconsIcon icon={Users} className="size-8 text-muted-foreground" />
                        </div>

                        <h3 className="text-3xl font-semibold text-white tracking-tight">No groups active</h3>
                        <p className="text-muted-foreground font-light mt-2 mb-8 max-w-[300px] text-center leading-relaxed">
                            We couldn't find any public groups matching your current filters.
                        </p>

                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full "
                        >
                            <Link href="/create-group">
                                <HugeiconsIcon icon={Plus} className="w-4 h-4 mr-2" /> Create first group
                            </Link>
                        </Button>
                    </div>

                ) : (
                    /* --- THE GRID: Linear-style precision cards --- */
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groups.map((group, idx) => (
                                <motion.div
                                    key={group.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => router.push(`/g/${group.slug}`)}
                                    className="group relative flex flex-col  border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-white/20 hover:shadow-black hover:shadow-xl"
                                >
                                    {/* Image Section with subtle zoom */}
                                    <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.05]">
                                        <Image
                                            src={group.bannerImage || "/group banner placeholder.png"}
                                            alt={group.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Glass Tag Overlay */}
                                        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
                                            {group.category}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-5 flex flex-col gap-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-medium text-zinc-100 group-hover:text-white transition-colors">
                                                {group.title}
                                            </h3>
                                        </div>

                                        <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed mt-1">
                                            {group.description}
                                        </p>

                                        {/* Footer metadata */}
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <HugeiconsIcon icon={Users} className="size-5" />
                                                <span className="font-mono tracking-tight">
                                                    {group.memberCount?.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="font-semibold text-zinc-200">
                                                {group.price ? `${group.price} ETB` : (
                                                    <span className="text-emerald-500/80 uppercase tracking-widest text-sm">Free</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtle Hover Edge Glow */}
                                    <div className="absolute inset-0 border-t border-white/0 group-hover:border-white/10 pointer-events-none transition-all duration-500" />
                                </motion.div>
                            ))}
                        </div>

                        {/* --- PAGINATION: Ghost Style --- */}
                        <div className="flex justify-center mt-16">
                            {hasNextPage ? (
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="group flex items-center gap-2 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-zinc-400 text-xs hover:border-white/20 hover:text-white transition-all duration-300 disabled:opacity-50"
                                >
                                    {isFetchingNextPage ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                            Syncing...
                                        </span>
                                    ) : (
                                        <>
                                            Load more groups
                                            <HugeiconsIcon icon={ArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-zinc-800" />
                                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">End of Archive</span>
                                    <div className="h-px w-8 bg-zinc-800" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
