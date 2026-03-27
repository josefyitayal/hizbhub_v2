"use client"

import { orpc } from "@/lib/orpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { isDefinedError } from "@orpc/client"
import { Hash, Trash } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect } from "react"
import { useCurrentGroupQuery } from "../../../_components/hooks/useCurrentGroupQuery"
import { useGroup } from "../../../_components/context/GroupContext"
import { CreateChannelButton } from "./CreateChannelButton"

export default function ChannelList() {
    const queryclient = useQueryClient()
    const router = useRouter()

    const { data: { group, isUserOwned } } = useCurrentGroupQuery()

    const { setCurrentChannel } = useGroup()

    const params = useParams<{ channelId: string }>()
    const urlChannelId = params.channelId

    const activeChannelId = urlChannelId || group.channels[0]?.id;

    useEffect(() => {
        const currentchannel = group.channels.find((c) => c.id === activeChannelId)
        if (currentchannel) {
            setCurrentChannel(currentchannel!)
        }
    }, [activeChannelId])

    const deleteChannelMutation = useMutation(orpc.channel.delete.mutationOptions({
        onSuccess: async (deletedChannel) => {
            toast.success(`Channel ${deletedChannel.name} is Deleted`);

            // 1. Invalidate to update the cache in the background
            await queryclient.invalidateQueries({
                queryKey: orpc.group.list.slug.queryKey({
                    input: { groupSlug: group.slug }
                })
            });

            // 2. Filter out the deleted channel to find the "real" last one
            const remainingChannels = group.channels.filter(c => c.id !== deletedChannel.id);
            const lastChannelId = remainingChannels.at(-1)?.id || "";

            // 3. Redirect to the updated last channel
            router.push(`/g/${group.slug}/community/${lastChannelId}`);
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                toast.error(error.message)
                return
            }

            toast.error("Faild to delete channel, try again")
        }
    }))

    return (
        <div className="flex flex-col h-full overflow-y-auto w-[310px] bg-sidebar border-r border-border text-muted-foreground">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-800/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 truncate">
                    {group.title}
                </h3>
            </div>

            {/* Channel List */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5">
                <div className="mb-2 px-2 text-[11px] font-semibold uppercase text-zinc-500 flex items-center justify-between">
                    <span>Channels</span>
                </div>

                {group.channels.map((channel) => {
                    const isActive = activeChannelId === channel.id;
                    const channelHref = `/g/${group.slug}/community/${channel.id}`;

                    return (
                        <Link
                            key={channel.id}
                            href={channelHref}
                            className={clsx(
                                "group relative flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200",
                                isActive
                                    ? "bg-zinc-800/50 text-white"
                                    : "hover:bg-zinc-900 hover:text-zinc-200"
                            )}
                        >
                            {/* Active Indicator Pill */}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full" />
                            )}

                            <div className="flex items-center gap-2 truncate">
                                <HugeiconsIcon icon={Hash} className={clsx(
                                    "w-4 h-4 flex-shrink-0",
                                    isActive ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
                                )} />
                                <span className="truncate font-medium">{channel.name}</span>
                            </div>

                            {isUserOwned && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (group.channels.length === 1) {
                                            toast.error("You cannot delete the last channel");
                                        } else {
                                            deleteChannelMutation.mutate({ channelId: channel.id });
                                        }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-700 hover:text-red-400 transition-all"
                                    title="Delete Channel"
                                >
                                    <HugeiconsIcon icon={Trash} className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Create Action */}
            {isUserOwned && (
                <div className="p-4 mt-auto border-t border-border">
                    <CreateChannelButton groupSlug={group.slug} />
                </div>
            )}
        </div>
    );
}
