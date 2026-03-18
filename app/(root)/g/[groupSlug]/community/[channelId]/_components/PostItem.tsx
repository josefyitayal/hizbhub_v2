"use client"

import { Button } from "@/components/ui/button";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Loader, MessageCircle, Pin, ThumbsUp } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePostLike } from "./hooks/usePostLike";
import { PostMenuDropdown } from "./DeletePost";
import { useRouter, useSearchParams } from "next/navigation";

type PostsQueryData = Awaited<ReturnType<typeof orpc.post.list.byChannelId.call>>
type Post = PostsQueryData['posts'][number]

export interface PostItemProps {
    channelId: string;
    groupId: string;
    post: Post;
    isUserOwned: boolean;
}

export function PostItem({ channelId, groupId, post, isUserOwned }: PostItemProps) {
    const { user: clerkUser } = useUser()
    const router = useRouter();
    const params = useSearchParams();

    // Use the custom hook for like/unlike functionality
    const { handleLike, isPending, pendingPostId } = usePostLike({ channelId, groupId })

    function handlePostOpen(post: Post) {
        const newParams = new URLSearchParams(params.toString());
        newParams.set("p", post.id);

        router.replace(`?${newParams.toString()}`, { scroll: false });
    }

    return (
        <>
            <div
                key={post.id}
                className={cn(
                    "relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-white/20",
                    post.isPinned && "bg-white/[0.04] border-white/20"
                )}
            >
                {/* Pinned Indicator */}
                {post.isPinned && (
                    <div className="relative z-10 flex items-center gap-2 text-white/60 text-[11px] uppercase tracking-[0.2em]">
                        <HugeiconsIcon icon={Pin} className="size-3 rotate-45 opacity-70" />
                        Pinned
                    </div>
                )}

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src={getAvatar(post.user?.profilePicture ?? "", post.user?.email ?? "")}
                            alt="user profile picture"
                            width={40}
                            height={40}
                            className="size-10 rounded-full object-cover border border-white/10"
                            unoptimized // Recommended if Clerk upstream 404s continue
                        />
                        <div className="flex flex-col">
                            <p className="font-semibold text-white text-sm">
                                {post.user?.userName}
                            </p>
                            <p className="text-xs text-zinc-500 tracking-wide">
                                {dayjs(post.createdAt).format('MMMM D, YYYY')}
                            </p>
                        </div>
                    </div>
                    <PostMenuDropdown
                        postId={post.id}
                        groupId={groupId}
                        channelId={channelId}
                        isPinned={post.isPinned}
                        isOwner={post.isOwner}
                        isUserOwned={isUserOwned}
                    />
                </div>

                <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div onClick={() => handlePostOpen(post)} className="relative z-10 cursor-pointer">
                    <div
                        className="prose prose-invert max-w-none text-zinc-300 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_blockquote]:border-l [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-400 [&_a]:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />
                    {post.attachment && (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black">
                            <Image
                                src={post.attachment}
                                alt="attachment"
                                width={800}
                                height={800}
                                className="object-cover w-full max-h-[500px] opacity-90"
                            />
                        </div>
                    )}
                </div>

                <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative z-10 flex items-center gap-6">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post);
                        }}
                        variant="ghost"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        disabled={isPending && pendingPostId === post.id}
                    >
                        <HugeiconsIcon icon={ThumbsUp} className={cn("size-4 transition", post.hasUserLiked && "fill-white text-white")} />
                        <span className="text-xs tracking-wide">{post.likes}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <HugeiconsIcon icon={MessageCircle} className="size-4" />
                        <span className="text-xs tracking-wide">{post.comments}</span>
                    </Button>
                </div>
            </div>
        </>
    )
}
