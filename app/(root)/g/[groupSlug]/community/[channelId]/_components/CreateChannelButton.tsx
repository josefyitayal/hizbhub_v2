"use client"

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createChannelFormSchema, createChannelFormTypes } from "@/zod-schema/createChannelZodSchema";
import { useGroup } from "../../../_components/context/GroupContext";

export function CreateChannelButton({ groupSlug }: { groupSlug: string }) {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const { setCurrentChannel } = useGroup()


    const form = useForm<createChannelFormTypes>({
        resolver: zodResolver(createChannelFormSchema),
        defaultValues: {
            name: "",
            postPermission: "all",
            replayPermission: "all",
        }
    });

    const createChannelMutation = useMutation(orpc.channel.create.mutationOptions({
        onSuccess: ({ channel, groupSlug }) => {
            toast.success(`Channel ${channel.name} is successfully created`)
            queryClient.invalidateQueries({
                queryKey: orpc.group.list.slug.queryKey({
                    input: {
                        groupSlug: groupSlug // Use the slug value (assuming 'groupSlug' is available)
                    }
                })
            })
            setCurrentChannel(channel)
            setOpen(false)
            form.reset()
            router.push(`/g/${groupSlug}/community/${channel.id}`)
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                toast.error(error.message)
                return
            }

            toast.error("Faild to create workspace, try again")
        }
    }))

    function onSubmit(data: createChannelFormTypes) {
        const values = { ...data, groupSlug }
        createChannelMutation.mutate(values)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full" variant="secondary">Create channel</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Create channel</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Channel name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="postPermission"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-post">Post Permission</FieldLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="select permission" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All members</SelectItem>
                                                <SelectItem value="admin">Admin (you)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="replayPermission"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-replay">Replay Permission</FieldLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="select permission" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All members</SelectItem>
                                                <SelectItem value="admin">Admin (you)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <DialogFooter>
                            <Button type="submit" disabled={createChannelMutation.isPending}>{createChannelMutation.isPending ? "creating..." : "create"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
