"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { orpc } from "@/lib/orpc"
import { EllipsisVertical } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { isDefinedError } from "@orpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeletePostProps = {
    postId: string;
    groupId: string;
    channelId: string;
    isPinned: boolean;
    isUserOwned: boolean;
    isOwner: boolean;
}

export function PostMenuDropdown({ postId, isUserOwned, isOwner, groupId, channelId, isPinned }: DeletePostProps) {
    const queryClient = useQueryClient()

    const deletePostMutation = useMutation(orpc.post.delete.mutationOptions({
        onSuccess: () => {
            toast.success(`Post successfull deleted`)
            queryClient.invalidateQueries({
                queryKey: orpc.post.list.byChannelId.key({ input: { channelId, groupId } }),
            })
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                toast.error(error.message)
                return
            }

            toast.error("Faild to delete post, try again")
        }
    }))

    const pinPostMutation = useMutation(orpc.post.pinPost.mutationOptions({
        onSuccess: (newPost) => {
            toast.success(`Post ${newPost.isPinned ? 'Pinned' : 'Unpinned'}`)
            queryClient.invalidateQueries({
                queryKey: orpc.post.list.byChannelId.key({ input: { channelId, groupId } }),
            })
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                toast.error(error.message)
                return
            }

            toast.error("Faild to delete post, try again")
        }
    }))

    if (!isOwner && !isUserOwned) {
        return null
    }

    function handleDeleteButton() {
        deletePostMutation.mutate({ postId, groupId })
    }
    function handlePinButton() {
        pinPostMutation.mutate({ postId, groupId, currentPin: isPinned })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <HugeiconsIcon icon={EllipsisVertical} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" sideOffset={8} className="w-[200px]">
                {/* 2. Show Pin ONLY if isUserOwned is true */}
                {isUserOwned && (
                    <DropdownMenuItem asChild>
                        <Button variant="ghost" className="w-full" onClick={handlePinButton}>
                            {isPinned ? "Unpinned" : "Pin"}
                        </Button>
                    </DropdownMenuItem>
                )}

                {/* 3. Show Delete if EITHER isUserOwned OR isOwner is true */}
                {(isUserOwned || isOwner) && (
                    <DropdownMenuItem asChild>
                        <Button variant="ghost" className="w-full" onClick={handleDeleteButton}>
                            Delete
                        </Button>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
