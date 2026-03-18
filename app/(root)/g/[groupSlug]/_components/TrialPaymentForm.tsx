"use client"

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { isDefinedError } from "@orpc/client";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useEffect, useMemo, useState } from "react";
import { Plan } from "@/db/schemas";
import { DiscountVerification } from "@/zod-schema/discountVerificationSchema";
import { useCurrentGroupQuery } from "./hooks/useCurrentGroupQuery";
import { paymentFormSchema, paymentFormSchemaTypes } from "@/zod-schema/paymentZodSchema";
import { DiscountCodeButton } from "@/app/(root)/create-group/_components/PricingDialog/DiscountCode";

export const TrialPaymentForm = () => {
    const { groupSlug } = useParams<{ groupSlug: string }>()
    const queryClient = useQueryClient()
    const router = useRouter()

    const [step, setStep] = useState<"pricing" | "form">("pricing");
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [discountDetails, setDiscountDetails] = useState<DiscountVerification | null>(null);
    const [affiliateId, setAffiliateId] = useState<string | null>(null)

    const { data: plans } = useQuery(orpc.plan.list.queryOptions())
    const { data: { group } } = useCurrentGroupQuery()

    useEffect(() => {
        if (plans) {
            setSelectedPlan(plans[0])
        }
    }, [plans])

    useEffect(() => {
        setDiscountDetails(null);
    }, [selectedPlan?.id]);

    const handleRequestError = (error: unknown) => {
        if (isDefinedError(error)) {
            const definedError = error as Error
            toast.error(definedError.message)
            return
        }

        toast.error("Something went wrong, try again.")
    }

    const paymentMutation = useMutation(orpc.subscription.activateFullAccess.mutationOptions({
        onSuccess: () => {
            toast.success(`Activate Full access`)
            queryClient.invalidateQueries({
                queryKey: orpc.group.list.userGroupInfo.queryKey()
            })
            paymentForm.reset()
            setDiscountDetails(null)
            setStep("pricing");
            router.refresh()
        },
        onError: handleRequestError
    }))

    const paymentForm = useForm<paymentFormSchemaTypes>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            receiptNumber: ""
        }
    })

    const handleStart = async () => {
        if (!selectedPlan) {
            toast.error("Please select a plan to continue.")
            return
        }

        setStep("form");
    }

    const submitPayment = paymentForm.handleSubmit(async ({ receiptNumber }) => {
        if (group && selectedPlan) {
            paymentMutation.mutate({
                receiptNumber,
                planId: selectedPlan.id,
                discountCode: discountDetails?.code,
                groupId: group.id,
                affiliateId: affiliateId,
            });
        }
    })


    const formattedPrice = useMemo(() => {
        if (!selectedPlan) return "--"
        return `${selectedPlan.price.toLocaleString()} birr`
    }, [selectedPlan])

    const finalAmount = discountDetails?.finalAmount ?? selectedPlan?.price ?? 0
    const finalAmountLabel = selectedPlan ? `${finalAmount.toLocaleString()} birr` : "--"

    const isPaymentPending = paymentMutation.isPending
    const isFreeWithDiscount = !!discountDetails && finalAmount === 0

    return (
        <div>
            {step === "pricing" ? (
                <div className="flex flex-col items-center w-full min-h-[500px] relative">
                    <div className="text-center space-y-1 mb-8">
                        <p className="text-3xl font-light tracking-wide">
                            choose plan
                        </p>
                        <p className="text-sm text-neutral-500 font-extralight tracking-wider">
                            small text with muted color
                        </p>
                    </div>

                    {/* Plan Toggle (Tabs) */}
                    <Tabs
                        value={selectedPlan?.id}
                        onValueChange={(val) => {
                            const nextPlan = plans?.find(p => p.id === val)
                            if (nextPlan) {
                                setSelectedPlan(nextPlan)
                            }
                        }}
                        className="mb-8"
                    >
                        <TabsList className="rounded-full bg-neutral-800 p-0.5 border border-neutral-700 transition-all duration-300">
                            {plans?.map(plan => (
                                <TabsTrigger
                                    key={plan.id}
                                    value={plan.id}
                                    // Adjusted styling for prototype feel
                                    className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black h-8 px-4 py-0 transition-all duration-300"
                                >
                                    {plan.name.replace(" ", "\u00A0")} {/* Use non-breaking space */}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Pricing Card: Central element with minimal design */}
                    <div className="flex flex-col items-center text-center w-full max-w-sm">
                        {/* Using key to force re-render and trigger a quick opacity transition */}
                        <h2
                            key={selectedPlan?.name} // Key change for transition
                            className="text-2xl font-light transition-opacity duration-200 opacity-100 animate-fadeIn"
                        >
                            {selectedPlan?.name}
                        </h2>

                        {/* Price: Large, prominent, with transition */}
                        <div className="text-6xl font-extralight mt-2 mb-8 transition-opacity duration-200 opacity-100 animate-fadeIn">
                            {formattedPrice}
                        </div>

                        {/* Feature List: Simpler, centered, matching prototype's minimal list */}
                        <ul className="mt-2 space-y-4 text-center text-base text-neutral-300 font-light tracking-wide">
                            <li>Unlimited product uploads</li>
                            <li>Customizable store theme</li>
                            <li>Analytics dashboard</li>
                            <li>24/7 support</li>
                        </ul>

                        {/* Get It Now Button */}
                        <Button
                            onClick={handleStart}
                            className="
                                        mt-10 rounded-lg 
                                        bg-white text-black 
                                        hover:bg-neutral-200 transition-colors 
                                        font-medium 
                                        shadow-lg shadow-neutral-700/50
                                    "
                        >
                            Get it now
                        </Button>
                    </div>
                </div>
            ) : (
                // --- Phone Verification Step (Unchanged functionality, minor style adjustments for dark mode) ---
                <div className="flex flex-col gap-7 w-full p-5 bg-black text-white rounded-2xl relative">
                    <div>
                        <p className="text-xl font-bold">Complete payment</p>
                    </div>

                    <div className="w-full rounded-lg border border-border flex items-center justify-between p-8">
                        <div className="flex flex-col items-center gap-4 w-full border-r border-border">
                            <p className="text-lg text-muted-foreground">Plan</p>
                            <p className="text-3xl font-medium">{selectedPlan?.name}</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 w-full">
                            <p className="text-lg text-muted-foreground">Total amount</p>
                            <div className="flex flex-col items-center">
                                {discountDetails ? (
                                    <>
                                        <span className="text-2xl line-through text-muted-foreground">
                                            {selectedPlan ? `${selectedPlan.price.toLocaleString()} birr` : "--"}
                                        </span>
                                        <span className="text-3xl font-medium">{finalAmountLabel}</span>
                                        <span className="text-sm text-green-400">
                                            -{discountDetails.amountOff.toLocaleString()} birr with {discountDetails.code}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-medium">{formattedPrice}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {!isFreeWithDiscount ? (
                        <>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p className="font-semibold">Enter Receipt reference</p>
                                    <p className="text-muted-foreground">
                                        complete payment in Telebirr <span className="font-semibold">+251926502272</span> app, then enter the reference number
                                    </p>
                                </div>
                                <div className="border border-border rounded-lg p-2">
                                    <p className="text-muted-foreground">
                                        <span className="font-semibold">Instructions:</span> send <span className="font-semibold">{formattedPrice}</span> to{" "}
                                        <span className="font-semibold">Telebirr +251926502272</span> You&apos;ll receive reference (5 - 15 character)
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submitPayment} className="flex flex-col gap-5">
                                <FieldGroup>
                                    <Controller
                                        name="receiptNumber"
                                        control={paymentForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-receiptNumber">Receipt Number</FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="form-receiptNumber"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="e.g TXN123456789"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <Button className="w-full" disabled={isPaymentPending}>
                                    {isPaymentPending ? "Verifying..." : "Buy and verify"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="border border-border rounded-lg p-3">
                                <p className="text-sm text-green-400">
                                    This plan is fully discounted with code <span className="font-semibold">{discountDetails.code}</span>. No Telebirr payment is required.
                                </p>
                            </div>
                            <Button
                                className="w-full"
                                disabled={isPaymentPending}
                                onClick={() => {
                                    // Use a dummy reference that passes validation; backend will treat it as free.
                                    paymentMutation.mutate({
                                        receiptNumber: "FREE00",
                                        planId: selectedPlan!.id,
                                        discountCode: discountDetails.code,
                                        groupId: group.id
                                    })
                                }}
                            >
                                {isPaymentPending ? "Activating..." : "Activate for free"}
                            </Button>
                        </div>
                    )}

                    <div>
                        <DiscountCodeButton
                            planId={selectedPlan?.id}
                            appliedDiscount={discountDetails}
                            onApplied={setDiscountDetails}
                            setAffiliateId={setAffiliateId}
                        />
                    </div>

                    <div className="flex !flex-row items-center !justify-between">
                        <div className="">
                            <p className="text-muted-foreground">How it work</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setStep("pricing")}
                                className="border-neutral-700 text-white hover:bg-neutral-800"
                                disabled={isPaymentPending}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
