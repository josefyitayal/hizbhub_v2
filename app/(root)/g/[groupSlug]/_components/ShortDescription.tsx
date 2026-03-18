"use client"

import { Button } from "@/components/ui/button"
import { useCurrentGroupQuery } from "./hooks/useCurrentGroupQuery"
import Image from "next/image"
import { getGroupColor } from "@/lib/generateGroupColor"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import { redirect, useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { LeavingMessageDialog } from "./LeavingMessageDialog"
import { GroupPricing } from "./GroupPricing"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Skeleton } from "@/components/ui/skeleton"
import { TABS } from "./settings/Settings"
import { isRedirectError } from "next/dist/client/components/redirect-error"

const Settings = dynamic(
    () => import('./settings/Settings').then((mod) => mod.Settings),
    {
        loading: () => <Skeleton className="w-full h-full" />, // 2. Critical for UX
        ssr: false,
    } // 3. Optional: use if Settings uses browser APIs like window
);

export const ShortDescription = () => {
    const queryclient = useQueryClient();
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false);

    const { data: { group, isUserOwned } } = useCurrentGroupQuery()

    const joinGroupMutation = useMutation(orpc.group.joinGroup.mutationOptions({
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: orpc.group.list.userGroupInfo.queryKey() });
            queryclient.invalidateQueries({
                queryKey: orpc.group.list.slug.queryKey({ input: { groupSlug: group.slug } })
            });

            router.push(`/g/${group.slug}/community`);
        },
        onError: (error) => {
            toast.error(`${error.message}`)
        }
    }));


    function handleJoinGroup() {
        joinGroupMutation.mutate({ groupId: group.id, groupSlug: group.slug });
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(group.createdAt));

    useEffect(() => {
        if (window.location.hash.startsWith("#settings")) {
            setIsOpen(true);

            const parts = window.location.hash.split("/"); // e.g., #settings/general
            const hashTab = parts[1];

            // Search the array for an object where the label matches the URL hash
            const activeTab = TABS.find(tab => tab.label.toLowerCase() === hashTab?.toLowerCase());

            if (activeTab) {
                setTab(activeTab.label.toLowerCase());
                // Or setTab(activeTab) depending on how your state is managed
            }
        }
    }, []);

    const [tab, setTab] = useState("general")

    const handleOpenChange = (state: boolean) => {
        setIsOpen(state)
        if (!state) {
            window.history.pushState({}, "", window.location.pathname)
        } else {
            window.location.hash = "settings/" + tab
        }
    }

    return (
        <div className="bg-card rounded-xl lg:flex-[0.6] flex flex-col gap-3 h-fit px-5 py-7 border border-border sticky top-4">
            <div className="flex items-center gap-3">
                {group.icon ? (
                    <Image
                        src={group.icon}
                        alt="group icon"
                        width={100}
                        height={100}
                        className="object-cover size-11 rounded-md"
                    />
                ) : (
                    <div className={cn(
                        "relative flex items-center rounded-md justify-center size-11 shrink-0",
                        getGroupColor(group.id),
                    )}>
                        <span className="text-sm font-semibold text-white">
                            {group.title.charAt(0)}
                        </span>
                    </div>
                )}
                <div className="flex flex-col justify-between overflow-hidden">
                    <p className="font-bold text-lg truncate">{group.title}</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                </div>
            </div>

            <div className="w-full py-4">
                <p className="text-start text-sm text-muted-foreground line-clamp-4">
                    {group.description}
                </p>
            </div>

            <div className="flex items-center justify-between py-5 border-y border-border w-full">
                <div className="flex flex-col items-center w-full gap-2 border-r border-border">
                    <p className="text-muted-foreground text-sm">Members</p>
                    <p className="text-xl font-bold">{group.memberCount}</p>
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                    <p className="text-muted-foreground text-sm">Price</p>
                    <p className="text-xl font-bold">{group.price ? group.price : "Free"}</p>
                </div>
            </div>

            <div className="mt-2">
                {isUserOwned ? (
                    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                        <DialogOverlay className="backdrop-blur-sm" />
                        <DialogTrigger asChild>
                            <Button className="w-full" onClick={() => (window.location.hash = "settings")}>
                                Settings
                            </Button>
                        </DialogTrigger>
                        <VisuallyHidden>
                            <DialogHeader>
                                <DialogTitle>Settings</DialogTitle>
                            </DialogHeader>
                        </VisuallyHidden>
                        <DialogContent
                            className="!max-w-none w-[80vw] h-[80vh] p-0 rounded-xl"
                        >
                            {isOpen && <Settings
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                tab={tab}
                                setTab={setTab}
                            />}
                        </DialogContent>
                    </Dialog>
                ) : (
                    <>
                        {group.isMember ? (
                            <LeavingMessageDialog
                                groupId={group.id}
                            />
                        ) : (
                            <>
                                {(group?.price ?? 0) > 0 ? (
                                    <GroupPricing
                                        group={group}
                                        joinGroupMutation={joinGroupMutation}
                                    />
                                ) : (
                                    <Button
                                        onClick={handleJoinGroup}
                                        disabled={joinGroupMutation.isPending}
                                        className="w-full"
                                    >
                                        {joinGroupMutation.isPending ? "Joining..." : "Join Group"}
                                    </Button>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
