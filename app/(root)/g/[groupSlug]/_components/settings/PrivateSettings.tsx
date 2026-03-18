"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { orpc } from "@/lib/orpc";
import { privateSettingFormSchema, privateSettingFormTypes } from "@/zod-schema/settingsZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function PrivateSettings({ groupId }: { groupId: string }) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: privateSettingData, isLoading } = useQuery(
        orpc.settings.privateSettings.list.queryOptions({ input: { groupId } })
    )

    const updatePrivateSettingsMutation = useMutation(orpc.settings.privateSettings.update.mutationOptions({
        onSuccess: (newGroup) => {
            toast.success("Setting saved")
            queryClient.invalidateQueries(orpc.group.list.slug.queryOptions({ input: { groupSlug: newGroup.slug } }))
            router.push(`/g/${newGroup.slug}/#settings/private`)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<privateSettingFormTypes>({
        resolver: zodResolver(privateSettingFormSchema),
        values: {
            private: false
        },
    })

    function onSubmit(data: privateSettingFormTypes) {
        updatePrivateSettingsMutation.mutate({ groupId, private: data.private })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full">
                <p className="text-lg text-start pl-3">Inviate</p>
            </div>
            <Separator />
            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div >
                    <div>
                        <p className="text-muted-foreground">If on your group is now will be invisible to discover page. people only join you group by link</p>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 flex flex-col gap-4 py-10">
                        <FieldGroup>
                            {/* private */}
                            <Controller
                                name="private"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="">
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor="form-private">Private</FieldLabel>
                                            <Switch
                                                id="form-private"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={field.disabled}
                                                aria-invalid={fieldState.invalid}
                                            />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                        <Button type="submit" disabled={updatePrivateSettingsMutation.isPending}>
                            {updatePrivateSettingsMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    )
}
