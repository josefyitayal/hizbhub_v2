"use client"

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useState } from "react";
import Image from "next/image";
import { getGroupColor } from "@/lib/generateGroupColor";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Group } from "@/db/schemas";
import { ArrowRight, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface GroupSearchProps {
    ownedGroups: Group[] | []; // Use the actual TS array type
    joinedGroups: Group[] | []; // Use the actual TS array type
}

export function SearchGroup({ ownedGroups, joinedGroups }: GroupSearchProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <Button variant="ghost" onClick={() => setOpen(true)} className="bg-sidebar-accent relative flex items-center justify-center size-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <HugeiconsIcon
                    icon={Search}
                />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                </VisuallyHidden>
                <DialogContent className="z-80 max-w-[640px] p-0 overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
                    <Command className="w-full">
                        <CommandInput placeholder="Type to search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Your groups">
                                {ownedGroups?.map((ownedGroup) => (
                                    <CommandItem key={ownedGroup.id} onSelect={() => router.push(`/g/@${ownedGroup.slug}`)}>
                                        <div
                                            className={cn(
                                                "relative flex items-center justify-center size-10 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                ownedGroup.icon ? "" : getGroupColor(ownedGroup.id), // Apply the background color
                                            )}
                                        >
                                            {ownedGroup.icon ? (
                                                <Image
                                                    src={ownedGroup.icon}
                                                    alt="group-icon"
                                                    // Updated width/height to match size-10 (40px)
                                                    width={40}
                                                    height={40}
                                                    className="object-cover size-full rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-white">
                                                    {ownedGroup.title.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <span>{ownedGroup.title}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Joined group">
                                {joinedGroups?.length > 0 ? (
                                    <div>
                                        {joinedGroups.map((joinedGroup) => (
                                            <CommandItem key={joinedGroup.id} onSelect={() => router.push(`/g/@${joinedGroup.slug}`)}>
                                                <div
                                                    className={cn(
                                                        "relative flex items-center justify-center size-10 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                        getGroupColor(joinedGroup.id), // Apply the background color
                                                    )}
                                                >
                                                    {joinedGroup.icon ? (
                                                        <Image
                                                            src={joinedGroup.icon}
                                                            alt="group-icon"
                                                            width={40}
                                                            height={40}
                                                            className="object-cover size-full rounded-lg"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-white">
                                                            {joinedGroup.title.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <span>{joinedGroup.title}</span>
                                            </CommandItem>
                                        ))}
                                        < Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Link href="/discover" className="flex items-center justify-center">
                                                Discover Groups
                                                <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    // --- Display this when no joined groups exist ---
                                    <div className="p-6 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                                        <p className="mb-2">You haven&apos;t joined any groups yet.</p>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Link href="/discover" className="flex items-center justify-center">
                                                Discover Groups
                                                <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog >
        </>
    )
}
