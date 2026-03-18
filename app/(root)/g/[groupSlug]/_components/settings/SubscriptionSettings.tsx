"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/orpc";
import { subscriptionSettingFormSchema, subscriptionSettingFormTypes } from "@/zod-schema/settingsZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function SubscriptionSettings({
    groupId,
    phoneNumber,
    memberCount
}: { groupId: string, phoneNumber: string | null | undefined, memberCount: string }) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: subscriptionSettingData, isLoading } = useQuery(
        orpc.settings.subscriptionSettings.list.queryOptions({ input: { groupId } })
    )

    const updateSubscriptionSettingsMutation = useMutation(orpc.settings.subscriptionSettings.update.mutationOptions({
        onSuccess: (newGroup) => {
            toast.success("Setting saved")
            queryClient.invalidateQueries(orpc.group.list.slug.queryOptions({ input: { groupSlug: newGroup.slug } }))
            router.push(`/g/${newGroup.slug}/#settings/subscription`)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<subscriptionSettingFormTypes>({
        resolver: zodResolver(subscriptionSettingFormSchema),
        values: {
            price: subscriptionSettingData?.price || 0,
        },
    })

    function onSubmit(data: subscriptionSettingFormTypes) {
        if (Number(data.price) > 0) {
            if (phoneNumber === null || phoneNumber === undefined) {
                toast.error("you need to set telebirr phone number")
                return
            }
        }
        updateSubscriptionSettingsMutation.mutate({ groupId, price: Number(data.price) })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full">
                <p className="text-lg text-start pl-3">Payment</p>
            </div>
            <Separator />
            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 flex flex-col gap-4">
                        <div>
                            <p className="text-muted-foreground">Your group price you can add price so user can pay to join or leave it 0 so that mean free</p>
                        </div>
                        {Number(memberCount) > 1 && (
                            <div className="p-2 border-2 border-border rounded-md bg-secondary">
                                <p className="text-muted-foreground">This group already has members.
                                    Pricing will apply to new members only.</p>
                            </div>
                        )}
                        <FieldGroup>
                            {/* Title */}
                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-price">Price</FieldLabel>
                                        {!phoneNumber && (
                                            <div className="p-3 border-2 border-border rounded-md bg-secondary">
                                                <p className="text-muted-foreground">
                                                    You are not set you telebirr phone number. you need to add your telebirr phone number to collect payment. you can add it in settings {'->'} payment
                                                </p>
                                            </div>
                                        )}
                                        <Input
                                            id="form-price"
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="eg. 0 for free"
                                            className="w-full"
                                            disabled={!phoneNumber}
                                            value={Number.isFinite(field.value) ? field.value : ""}
                                            onChange={(event) => field.onChange(Number(event.target.value))}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                        <Button type="submit" disabled={updateSubscriptionSettingsMutation.isPending}>
                            {updateSubscriptionSettingsMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    )
}
