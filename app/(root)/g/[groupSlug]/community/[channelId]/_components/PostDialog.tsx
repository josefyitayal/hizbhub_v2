"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Post, User } from "@/db/schemas";
import { usePostLike } from "./hooks/usePostLike";
import { Loader, LoaderCircle, MessageCircle, Share, ThumbsUp } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGroup } from "../../../_components/context/GroupContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export type PostWithRelations = Post & {
    hasUserLiked: boolean;
    isOwner: boolean;
    likes: number;
    user: User | null;
    comments: number;
};

export type PostDialogProps = {
    postId: string,
}


export function PostDialog({ postId }: PostDialogProps) {
    const { group, currentChannel } = useGroup()
    const { handleLike, isPending, pendingPostId } = usePostLike({ channelId: currentChannel?.id!, groupId: group.id })

    const [commentInput, setCommentInput] = useState("")

    const router = useRouter();
    const params = useSearchParams();

    const queryClient = useQueryClient()

    const {
        data: infiniteData
    } = useInfiniteQuery(
        orpc.post.list.byChannelId.infiniteOptions({
            input: (pageParam: string | undefined) => ({
                channelId: currentChannel?.id || "",
                groupId: group.id,
                cursor: pageParam
            }),
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        })
    );

    const post = infiniteData?.pages
        ?.flatMap(page => page.posts)
        ?.find(p => p.id === postId);

    const commentMutation = useMutation(
        orpc.comment.create.mutationOptions({
            onSuccess: () => {
                // Invalidate the comment infinite list on success
                queryClient.invalidateQueries({
                    queryKey: orpc.comment.list.infiniteKey({
                        input: (pageParam: string | undefined) => ({
                            postId,
                            cursor: pageParam,
                        }),
                        // Add this line to satisfy the requirement
                        initialPageParam: undefined
                    })
                });

                setCommentInput("");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    );

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery(
        orpc.comment.list.infiniteOptions({
            input: (pageParam: string | undefined) => ({
                postId,
                cursor: pageParam,
            }),
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        })
    );

    const comments = data?.pages.flatMap((page) => page.comments) || [];

    function handleComment() {
        commentMutation.mutate({
            postId,
            content: commentInput.trim(),
        });
    }

    async function handleLikeClicked(post: PostWithRelations) {
        if (post) {
            handleLike(post)
            await queryClient.invalidateQueries({
                queryKey: orpc.post.list.byChannelId.infiniteKey({
                    input: (pageParam: string | undefined) => ({
                        channelId: currentChannel?.id || "",
                        groupId: group.id,
                        cursor: pageParam
                    }),
                    initialPageParam: undefined
                })
            });
        }
    }

    function closePost() {
        const newParams = new URLSearchParams(params.toString());
        newParams.delete("p");

        router.replace(`?${newParams.toString()}`, { scroll: false });
    }

    async function handleShare() {
        try {
            const sharableLink = `http://localhost:3000/g/${group.slug}/community/${currentChannel?.id}?p=${postId}`
            await navigator.clipboard.writeText(sharableLink);
            toast.success("Link copyed")
        } catch {
            toast.error("something wrong")
        }
    }

    if (!post) return null;

    return (
        <Dialog open onOpenChange={closePost}>
            <DialogContent
                className="!max-w-none w-[100vw] md:w-[85vw] lg:w-[75vw] h-[90vh] p-0 flex flex-col overflow-hidden"
            >
                {/* Fixed Header */}
                <div className="p-4 sticky top-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src={getAvatar(post.user?.profilePicture || "", post.user?.email || "")}
                            alt="user profile picture"
                            width={40}
                            height={40}
                            className="size-11 rounded-full object-cover ring-2 ring-zinc-800"
                        />
                        <div className="flex flex-col">
                            <p className="font-bold">
                                {post.user?.userName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {dayjs(post.createdAt).format('MMMM D, YYYY')}
                            </p>
                        </div>
                    </div>
                    <DialogTitle className="sr-only text-xl font-light italic">Post Details</DialogTitle>
                </div>

                <ScrollArea className="flex-1 min-h-0">
                    {/* Main Post Body */}
                    <div className="px-6 md:px-8 space-y-6">
                        <div
                            className={cn(
                                /* 3. Added 'prose-lg' for generally larger text and bumped p size manually */
                                "prose prose-lg dark:prose-invert max-w-none w-full",
                                "[&_h1]:text-4xl [&_h1]:font-light [&_h1]:tracking-tighter [&_h1]:mb-6",
                                "[&_h2]:text-3xl [&_h2]:font-light [&_h2]:mb-4",
                                "[&_p]:text-[1.125rem] [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-zinc-300",
                                "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-3",
                                "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-3",
                                "[&_blockquote]:border-l-2 [&_blockquote]:border-zinc-700 [&_blockquote]:pl-6 [&_blockquote]:text-zinc-400 [&_blockquote]:italic",
                                "[&_a]:text-indigo-400 [&_a]:no-underline hover:[&_a]:underline"
                            )}
                            dangerouslySetInnerHTML={{ __html: post.content || "" }}
                        />

                        {post.attachment && (
                            <div className="rounded-2xl overflow-hidden border border-border bg-zinc-900/50">
                                <Image
                                    src={post.attachment}
                                    alt="attachment"
                                    width={800}
                                    height={800}
                                    className="object-contain w-full max-h-[500px]"
                                />
                            </div>
                        )}

                        {/* Engagement Bar */}
                        <div className="flex items-center gap-2 py-4 border-y border-border">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeClicked(post)
                                }}
                                variant="ghost"
                                className="h-10 px-4 rounded-full gap-2 text-muted-foreground"
                                disabled={isPending && pendingPostId === post.id}
                            >
                                <HugeiconsIcon icon={ThumbsUp} className={cn("size-4 transition", post.hasUserLiked && "fill-white text-white")} />
                                <span className="text-xs tracking-wide">{post.likes}</span>
                            </Button>

                            <Button variant="ghost" className="h-10 px-4 rounded-full gap-2 text-muted-foreground">
                                <HugeiconsIcon icon={MessageCircle} className="w-4 h-4" />
                                <span className="text-sm font-bold">{post.comments}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                className="h-10 px-4 rounded-full gap-2 text-muted-foreground"
                                onClick={handleShare}
                            >
                                <HugeiconsIcon icon={Share} className="w-4 h-4" />
                                <span className="text-sm font-bold">Share</span>
                            </Button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {currentChannel?.replayPermission === "all" && (
                        <div className=" p-6 md:p-8 min-h-[200px]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-muted-foreground">
                                    Discussion ({post.comments})
                                </h3>
                            </div>

                            {/* Comment Input Box */}
                            <div className="flex gap-4 mb-10 items-start group">
                                <div className="hidden sm:block">
                                    <Image
                                        src={getAvatar(post.user?.profilePicture || "", post.user?.email || "")}
                                        alt="user profile picture"
                                        width={40}
                                        height={40}
                                        className="size-10 rounded-full object-cover ring-2 ring-zinc-800"
                                    />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <Input
                                        type="text"
                                        value={commentInput}
                                        onChange={e => setCommentInput(e.target.value)}
                                        className="h-10"
                                        placeholder="Write a thoughtful reply..."
                                    />
                                    {commentInput.trim() && (
                                        <Button
                                            disabled={commentMutation.isPending}
                                            variant="secondary"
                                            onClick={() => handleComment()}
                                            className=""
                                        >
                                            {commentMutation.isPending ? <HugeiconsIcon icon={LoaderCircle} className="w-3 h-3 animate-spin" /> : "Post Reply"}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3 text-zinc-500">
                                    <HugeiconsIcon icon={LoaderCircle} className="w-6 h-6 animate-spin" />
                                    <p className="text-xs font-medium">fetching dialogue</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {post.comments > 0 ? (
                                        <div className="flex flex-col gap-8">
                                            {comments.map((comment) => (
                                                <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <Image
                                                        src={getAvatar(comment.user?.profilePicture, comment.user?.email)}
                                                        alt="profile"
                                                        width={32}
                                                        height={32}
                                                        className="size-10 rounded-full object-cover ring-1 ring-zinc-800"
                                                    />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-sm">{comment.user?.userName}</p>
                                                            <span className="text-[10px] text-muted-foreground">•</span>
                                                            <p className="text-[11px] text-muted-foreground font-medium">
                                                                {dayjs(comment.createdAt).format('MMM D')}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm leading-relaxed text-muted-foreground">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {hasNextPage && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => fetchNextPage()}
                                                    disabled={isFetchingNextPage}
                                                    className="w-full h-11 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl transition-all"
                                                >
                                                    {isFetchingNextPage ? <HugeiconsIcon icon={Loader} className="w-4 h-4 animate-spin mr-2" /> : "Load more discussion"}
                                                </Button>
                                            )}

                                            {!hasNextPage && comments.length > 0 && (
                                                <div className="pt-4 text-center">
                                                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">End of Thread</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center rounded-3xl border border-dashed border-border bg-zinc-950/20">
                                            <p className="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
