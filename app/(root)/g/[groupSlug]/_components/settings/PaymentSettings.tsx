"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/orpc";
import { paymentSettingFormSchema, paymentSettingFormTypes } from "@/zod-schema/settingsZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function PaymentSettings({ groupId }: { groupId: string }) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: paymentSettingData, isLoading } = useQuery(
        orpc.settings.paymentSettings.list.queryOptions({ input: { groupId } })
    )

    const updatePaymentSettingsMutation = useMutation(orpc.settings.paymentSettings.update.mutationOptions({
        onSuccess: (newGroup) => {
            toast.success("Setting saved")
            queryClient.invalidateQueries(orpc.group.list.slug.queryOptions({ input: { groupSlug: newGroup.slug } }))
            router.push(`/g/${newGroup.slug}/#settings/payment`)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<paymentSettingFormTypes>({
        resolver: zodResolver(paymentSettingFormSchema),
        values: {
            phoneNumber: paymentSettingData?.phoneNumber || "",
        },
    })

    function onSubmit(data: paymentSettingFormTypes) {
        updatePaymentSettingsMutation.mutate({ groupId, phoneNumber: data.phoneNumber })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full ">
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
                            <p className="text-muted-foreground">Your telebirr account phone number for user to send the money to your telebirr account directly</p>
                        </div>
                        <FieldGroup>
                            {/* Title */}
                            <Controller
                                name="phoneNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-phoneNumber">Phone number</FieldLabel>
                                        <Input
                                            id="form-phoneNumber"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="eg. 09 -- -- -- --"
                                            className="w-full"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                        <Button type="submit" disabled={updatePaymentSettingsMutation.isPending}>
                            {updatePaymentSettingsMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    )
}
