"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Settings2, MessageSquare, Send, Plus, Hash } from "@hugeicons/core-free-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Channel } from "@/db/schemas";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/ui/spinner";

type ChannelsSettingsProps = {
    group: { id: string; slug: string };
}

// This creates a type that only includes these 3 fields from your Channel type
type ChannelUpdateValues = Pick<Channel, "name" | "postPermission" | "replayPermission">;

export function ChannelsSettings({ group }: ChannelsSettingsProps) {
    const queryClient = useQueryClient();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [newChannelName, setNewChannelName] = useState("");

    // 1. Fetch all channels for this group
    const { data: channels, isLoading } = useQuery(
        orpc.settings.channelSettings.list.queryOptions({ input: { groupId: group.id } })
    );

    // 2. Mutation for creating a new channel
    const createChannelMutation = useMutation(orpc.channel.create.mutationOptions({
        onSuccess: () => {
            toast.success("Channel created");
            setNewChannelName("");
            queryClient.invalidateQueries(orpc.settings.channelSettings.list.queryOptions({ input: { groupId: group.id } }));
        },
        onError: (err) => toast.error(err.message)
    }));

    // 3. Mutation for updating channel settings
    const updateMutation = useMutation(orpc.settings.channelSettings.update.mutationOptions({
        onSuccess: () => {
            toast.success("Settings updated");
            queryClient.invalidateQueries(orpc.settings.channelSettings.list.queryOptions({ input: { groupId: group.id } }));
            setEditingId(null);
        },
        onError: (err) => toast.error(err.message)
    }));

    // 4. Mutation for deleting a channel
    const deleteMutation = useMutation(orpc.channel.delete.mutationOptions({
        onSuccess: () => {
            toast.success("Channel deleted");
            queryClient.invalidateQueries(orpc.settings.channelSettings.list.queryOptions({ input: { groupId: group.id } }));
        },
        onError: (err) => toast.error(err.message)
    }));

    const handleCreate = () => {
        if (!newChannelName.trim()) return toast.error("Channel name is required");
        createChannelMutation.mutate({
            name: newChannelName,
            postPermission: "all",
            replayPermission: "all",
            groupSlug: group.slug,
        });
    };

    const handleUpdate = (channelId: string, values: ChannelUpdateValues) => {
        updateMutation.mutate({
            groupId: group.id,
            channelId,
            channelName: values.name,
            postPermission: values.postPermission,
            replayPermission: values.replayPermission
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full">
                <p className="text-lg text-start pl-3">Channel</p>
            </div>
            <Separator />
            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <HugeiconsIcon icon={Hash} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="new-channel-name"
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                className="pl-9"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                        </div>
                        <Button
                            onClick={handleCreate}
                            disabled={createChannelMutation.isPending}
                            className="gap-2"
                        >
                            <HugeiconsIcon icon={Plus} className="w-4 h-4" />
                            {createChannelMutation.isPending ? "Creating..." : "Add Channel"}
                        </Button>
                    </div>

                    <div className="grid gap-8">
                        {channels?.map((channel) => (
                            <div key={channel.id} className="overflow-hidden flex flex-col gap-3 border border-border rounded-lg p-3 shadow-sm">
                                <div className="flex flex-row items-center justify-between space-y-0">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <HugeiconsIcon icon={MessageSquare} className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            {editingId === channel.id ? (
                                                <Input
                                                    defaultValue={channel.name}
                                                    id={`name-${channel.id}`}
                                                    className="h-8 w-[200px]"
                                                    autoFocus
                                                />
                                            ) : (
                                                <CardTitle className="text-base font-medium">#{channel.name}</CardTitle>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingId(editingId === channel.id ? null : channel.id)}
                                        >
                                            <HugeiconsIcon icon={Settings2} className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                if (confirm("Are you sure? This will delete all posts in this channel."))
                                                    deleteMutation.mutate({ channelId: channel.id })
                                            }}
                                        >
                                            <HugeiconsIcon icon={Trash2} className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Post Permission */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                                <HugeiconsIcon icon={Send} className="w-3 h-3" /> Post Permission
                                            </label>
                                            <Select
                                                defaultValue={channel.postPermission}
                                                onValueChange={(val: "all" | "admin") =>
                                                    handleUpdate(channel.id, {
                                                        ...channel,
                                                        postPermission: val
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Everyone</SelectItem>
                                                    <SelectItem value="admin">Admins Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Replay Permission */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                                <HugeiconsIcon icon={MessageSquare} className="w-3 h-3" /> Reply Permission
                                            </label>
                                            <Select
                                                defaultValue={channel.replayPermission}
                                                onValueChange={(val: "all" | "admin") =>
                                                    handleUpdate(channel.id, {
                                                        ...channel,
                                                        replayPermission: val
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Everyone</SelectItem>
                                                    <SelectItem value="admin">Admins Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {editingId === channel.id && (
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    const nameInput = document.getElementById(`name-${channel.id}`) as HTMLInputElement;
                                                    handleUpdate(channel.id, { ...channel, name: nameInput.value });
                                                }}
                                                disabled={updateMutation.isPending}
                                            >
                                                Update Name
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {channels?.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
                    <p className="text-muted-foreground italic">No channels yet. Create your first one above!</p>
                </div>
            )}
        </div>
    );
}
