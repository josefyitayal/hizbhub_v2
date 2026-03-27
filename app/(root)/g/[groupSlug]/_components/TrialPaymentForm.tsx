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
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight, Check } from "@hugeicons/core-free-icons";

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
                <div className="flex flex-col items-center w-full min-h-[550px] relative py-10 px-6">
                    {/* Background Glow for Focus */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-12 relative z-10">
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
                            Choose your <span className="text-emerald-500">growth plan</span>
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase tracking-[0.15em]">
                            Select the perfect fit for your community
                        </p>
                    </div>

                    {/* Plan Toggle (Tabs) */}
                    <Tabs
                        value={selectedPlan?.id}
                        onValueChange={(val) => {
                            const nextPlan = plans?.find(p => p.id === val)
                            if (nextPlan) setSelectedPlan(nextPlan)
                        }}
                        className="mb-12 relative z-10"
                    >
                        <TabsList className="h-12 rounded-full bg-zinc-900 border border-zinc-800 p-1.5 shadow-2xl backdrop-blur-md">
                            {plans?.map(plan => (
                                <TabsTrigger
                                    key={plan.id}
                                    value={plan.id}
                                    className="rounded-full px-8 text-xs font-bold uppercase tracking-widest transition-all duration-300
                               data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg
                               text-zinc-500 hover:text-zinc-300"
                                >
                                    {plan.name.replace(" ", "\u00A0")}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Pricing Card: Central Display */}
                    <div className="flex flex-col items-center text-center w-full max-w-sm relative z-10">
                        {/* Plan Name */}
                        <Badge variant="outline"
                            key={`badge-${selectedPlan?.name}`}
                            className="mb-6 border-emerald-500/20 bg-emerald-500/5 text-emerald-500 animate-fadeIn"
                        >
                            {selectedPlan?.name} Edition
                        </Badge>

                        {/* Price Display */}
                        <div key={`price-${formattedPrice}`} className="flex items-baseline gap-2 mb-10 animate-fadeIn">
                            <span className="text-7xl font-bold tracking-tighter text-white">
                                {formattedPrice}
                            </span>
                            <span className="text-zinc-500 font-medium italic">/access</span>
                        </div>

                        {/* Feature List: Refined with Shields */}
                        <ul className="space-y-5 text-left w-full mb-12">
                            {[
                                "Unlimited product uploads",
                                "Customizable store theme",
                                "Advanced Analytics dashboard",
                                "Priority 24/7 support"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-[15px] text-zinc-400 font-light group">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                                        <HugeiconsIcon icon={Check} className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Call to Action */}
                        <button
                            onClick={handleStart}
                            className="group relative w-full rounded-2xl bg-white py-5 text-sm font-bold text-black 
                       transition-all hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] 
                       shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Get Started Now
                                <HugeiconsIcon icon={ArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>

                        <p className="mt-6 text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                            Secure checkout via Chapa & Telebirr
                        </p>
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
