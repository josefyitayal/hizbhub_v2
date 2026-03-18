"use client"

import { orpc } from "@/lib/orpc";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PostInput } from "./PostInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentGroupQuery } from "../../../_components/hooks/useCurrentGroupQuery";
import { PostItem } from "./PostItem";
import { usePostLike } from "./hooks/usePostLike";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loader } from "@hugeicons/core-free-icons";

export function PostSection({ channelId }: { channelId: string }) {
    const { data: { group, isUserOwned }, isLoading } = useCurrentGroupQuery()

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: postIsLoading,
    } = useInfiniteQuery(
        orpc.post.list.byChannelId.infiniteOptions({
            input: (pageParam: string | undefined) => ({
                channelId,
                groupId: group.id,
                cursor: pageParam,
            }),
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        })
    );

    const posts = data?.pages.flatMap((page) => page.posts) || [];


    if (!channelId) {
        return (
            <div className="w-full h-[40vh] flex items-center justify-center">
                <p className="text-lg text-center text-muted-foreground">No channel Selected</p>
            </div>
        );
    }

    if (isLoading || postIsLoading) {
        return (
            <div className="w-full flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Skeleton className="rounded-lg w-full h-52" />
                    <Skeleton className="rounded-lg w-full h-52" />
                    <Skeleton className="rounded-lg w-full h-52" />
                </div>
            </div>
        )
    }

    const channels = group.channels.find(channel => channel.id === channelId)

    return (
        <div className="w-full flex flex-col gap-5 h-full">
            <div className="flex flex-col gap-6 h-full">
                {posts && posts.length > 0 ? (
                    <>
                        {posts.map((post) => {
                            if (!post.user) return null;

                            return (
                                <PostItem
                                    key={post.id}
                                    channelId={channelId}
                                    groupId={group.id}
                                    post={post}
                                    isUserOwned={isUserOwned}
                                />
                            )
                        })}

                        {/* Pagination Controls - Moved outside the loop but inside the conditional check */}
                        {hasNextPage ? (
                            <Button
                                variant="outline"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="w-full h-11 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl transition-all mt-4"
                            >
                                {isFetchingNextPage ? (
                                    <HugeiconsIcon icon={Loader} className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    "Load more discussion"
                                )}
                            </Button>
                        ) : (
                            <div className="pt-8 pb-4 text-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
                                    End of Thread
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">No posts yet.</div>
                )}
            </div>
        </div>
    )
}
