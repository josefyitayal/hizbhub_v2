"use client"

import Image from "next/image"
import { useCurrentGroupQuery } from "./hooks/useCurrentGroupQuery"
import { Folder, Tag } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { TiptapViewer } from "@/components/TiptapViewer"
import { CommunityTags } from "./CommunityTags"


export const LongDescription = () => {
    const { data: { group } } = useCurrentGroupQuery()

    return (
        <div className="bg-card flex-1 flex flex-col gap-4 p-5 rounded-md border border-border">
            <h2 className="text-2xl font-semibold text-start my-4">{group.title}</h2>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                    src={group.bannerImage || "/group banner placeholder.png"}
                    alt="group banner"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                    priority // Eager load the LCP element
                />
            </div>

            <div className="w-full rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">

                    {/* Category Section - Locked to 50% width */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <HugeiconsIcon icon={Folder} size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-tight">Category</p>
                            <div className="mt-1 flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                                {group.category?.length ? (
                                    group.category.map((c, idx, allTags) => (
                                        <span key={idx} className="inline-block px-2 py-0.5 rounded bg-secondary text-sm font-medium text-secondary-foreground max-w-full">
                                            {c}{idx !== allTags.length - 1 && ","}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground/50 italic">None specified</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags Section - Locked to 50% width */}
                    <CommunityTags tags={group.tags} />
                </div>
            </div>

            <div className="w-full">
                <TiptapViewer content={group.longDescription} />
            </div>
        </div>
    )
}
