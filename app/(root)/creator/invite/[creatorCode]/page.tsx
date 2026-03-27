"use client"

import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { affiliateOnboardingFormSchema, affiliateOnboardingFormTypes } from "@/zod-schema/affiliateOnboardingZodSchema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Info } from "@hugeicons/core-free-icons";

const ReferralCodeInfo = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="size-6">
                    <HugeiconsIcon icon={Info} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>What will be the referral code for your audience</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default function AffiliateOnboarding() {
    const { creatorCode } = useParams<{ creatorCode: string }>()
    const router = useRouter()

    const { data, isLoading } = useQuery(orpc.creatorCode.check.queryOptions({ input: { code: creatorCode } }))

    const form = useForm<affiliateOnboardingFormTypes>({
        resolver: zodResolver(affiliateOnboardingFormSchema),
        values: {
            referralCode: data?.referralCode || "",
            telebirr: "",
        }
    })

    const createAffiliate = useMutation(orpc.affiliate.create.mutationOptions({
        onSuccess: () => {
            toast.success("You are successfully joined Hizbhub affiliate program")
            router.push("/affiliate/dashboard")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    function onSubmit(data: affiliateOnboardingFormTypes) {
        createAffiliate.mutate({ ...data, creatorCode })
    }


    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="flex flex-col items-center gap-8 w-3/12">
                <h2 className="text-2xl text-center">Creator affiliate program</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full flex flex-col items-center">
                    <FieldGroup>
                        <Controller
                            name="referralCode"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-referralCode">Referral Code <ReferralCodeInfo /></FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-referralCode"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isLoading}
                                        placeholder="Referral code"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="telebirr"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-telebirr">Telebirr phone number</FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-telebirr"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Your Telebirr account phone number"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button type="submit" disabled={createAffiliate.isPending} className="mt-4">
                        {createAffiliate.isPending ? "Creating..." : "Create"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

