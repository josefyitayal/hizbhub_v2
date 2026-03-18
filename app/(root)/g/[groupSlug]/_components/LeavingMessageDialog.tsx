"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MemberSchema } from "@/db/schemas";
import { orpc } from "@/lib/orpc";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

type LeavingMessageDialogProps = {
    groupId: string;
}

export function LeavingMessageDialog({ groupId }: LeavingMessageDialogProps) {
    const queryclient = useQueryClient();
    const router = useRouter()

    const leaveGroupMutation = useMutation(orpc.group.leaveGroup.mutationOptions({
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: orpc.group.list.userGroupInfo.queryKey() });
            router.push("/discover");
        },
        onError: (error) => toast.error(error.message)
    }));

    function handleLeave() {
        leaveGroupMutation.mutate({ groupId })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full">Leave</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Leaving will remove your access to all courses and community discussions.
                        Any progress or roles you’ve earned in this group may be permanently lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border border-border">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeave}>Leave</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
