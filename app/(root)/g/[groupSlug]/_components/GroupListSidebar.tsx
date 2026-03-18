"use client"

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc"
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"
import Link from "next/link";
import { SearchGroup } from "./SearchGroup";
import { CreateGroupButton } from "./CreateGroupButton";
import { GroupItem } from "./GroupItem";
import { UserDropdownMenu } from "./UserDropdownMenu";
import Image from "next/image";

interface GroupListProps {
    groupSlug: string
}

export function GroupListSidebar({ groupSlug }: GroupListProps) {
    // Change joinedGroups to joinGroups
    const { data, isLoading } = useQuery({
        ...orpc.group.list.userGroupInfo.queryOptions(),
        // Add this to prevent constant refetching on route changes
        staleTime: 1000 * 60 * 5,
    });

    // Use optional chaining or a fallback since data is undefined while loading
    const joinedGroups = data?.joinedGroups ?? [];
    const ownedGroups = data?.ownedGroups ?? [];

    const renderSkeletons = (count: number) => {
        return Array.from({ length: count }).map((_, index) => (
            // Apply size-12 (h-12 w-12) styles matching your Link/Button size
            <Skeleton key={index} className="size-12 rounded-xl" />
        ));
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center gap-5 h-full">
                <div className="flex flex-col items-center gap-3">
                    <Link
                        href={'/'}
                        className={cn(
                            "relative flex items-center justify-center size-9 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        )}
                    >
                        <Image src={"/Logo 2.svg"} alt="hizbhub logo" width={54} height={54} className="object-cover size-full" />
                        {/* <span className="italic text-xs font-semibold leading-3">Hizb<br />Hub</span> */}
                    </Link>
                    <SearchGroup ownedGroups={ownedGroups || []} joinedGroups={joinedGroups || []} />
                    <CreateGroupButton />
                    {isLoading ? (
                        renderSkeletons(3) // 3 skeletons for owned groups
                    ) : (
                        ownedGroups?.map((ownedGroup) => (
                            <GroupItem key={ownedGroup.id} group={ownedGroup} groupSlug={groupSlug} />
                        ))
                    )}
                </div>
                <Separator />
                <div className="flex flex-col h-full w-full items-center gap-3">
                    {isLoading ? (
                        renderSkeletons(5) // 5 skeletons for joined groups
                    ) : (
                        joinedGroups?.map((group) => (
                            <GroupItem key={group.id} group={group} groupSlug={groupSlug} />
                        ))
                    )}
                </div>
                <div className="">
                    <UserDropdownMenu />
                </div>
            </div>
        </TooltipProvider>
    )
}
