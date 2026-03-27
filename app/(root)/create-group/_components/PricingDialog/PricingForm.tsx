import { Button } from "@/components/ui/button"
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { paymentFormSchema, paymentFormSchemaTypes } from "@/zod-schema/paymentZodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { isDefinedError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { usePricing } from "./PricingContext"
import { Plan } from "@/db/schemas"
import { orpc } from "@/lib/orpc"
import { useState } from "react"
import { DiscountVerification } from "@/zod-schema/discountVerificationSchema"
import { DiscountCodeButton } from "./DiscountCode"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"

type PricingFormProps = {
    selectedPlan: Plan
}

export const PricingForm = () => {
    const router = useRouter()
    const { selectedPlan, formattedPrice, setStep, setOpen, groupForm } = usePricing()
    const [discountDetails, setDiscountDetails] = useState<DiscountVerification | null>(null);
    const [affiliateId, setAffiliateId] = useState<string | null>(null)

    const paymentForm = useForm<paymentFormSchemaTypes>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            receiptNumber: ""
        }
    })

    const paymentMutation = useMutation(orpc.payment.creatingGroup.mutationOptions({
        onSuccess: ({ group, channel }) => {
            toast.success(`Group ${group.title} created successfully`)

            paymentForm.reset()

            setStep("pricing");
            setOpen(false);
            router.push(`/g/${group.slug}/community/${channel.id}`)
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                const definedError = error as Error
                toast.error(definedError.message)
                return
            }

            toast.error("Something went wrong, try again.")
        }
    }))

    const submitPayment = paymentForm.handleSubmit(async ({ receiptNumber }) => {
        if (!selectedPlan) {
            toast.error("Please select a plan.")
            return
        }

        paymentMutation.mutate({
            receiptNumber,
            planId: selectedPlan.id,
            discountCode: discountDetails?.code,
            group: groupForm.getValues(),
            affiliateId: affiliateId,
        })
    })

    const finalAmount = discountDetails?.finalAmount ?? selectedPlan?.price ?? 0
    const finalAmountLabel = selectedPlan ? `${finalAmount.toLocaleString()} birr` : "--"

    const isPaymentPending = paymentMutation.isPending
    const isFreeWithDiscount = !!discountDetails && finalAmount === 0

    return (
        <div className="flex flex-col gap-8 w-full">
            <DialogHeader>
                <DialogTitle className="text-2xl font-light tracking-tight">Complete payment</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 w-full rounded-2xl border border-border overflow-hidden">
                <div className="flex flex-col items-center gap-2 p-6 border-r border-zinc-800">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Plan</p>
                    <p className="text-xl font-light">{selectedPlan?.name}</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Total amount</p>
                    <div className="flex flex-col items-center">
                        {discountDetails ? (
                            <>
                                <span className="text-sm line-through text-muted-foreground">
                                    {selectedPlan ? `${selectedPlan.price.toLocaleString()} birr` : "--"}
                                </span>
                                <span className="text-xl font-light text-white">{finalAmountLabel}</span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full mt-1">
                                    -{discountDetails.amountOff.toLocaleString()} birr ({discountDetails.code})
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-light">{formattedPrice}</span>
                        )}
                    </div>
                </div>
            </div>

            {!isFreeWithDiscount ? (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="border border-border p-5 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">1</div>
                                <p className="text-sm text-zinc-300">
                                    Send <span className="text-white font-medium">{formattedPrice}</span> to <span className="text-white font-bold underline underline-offset-4">Telebirr +251926502272</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-zinc-700 text-white flex items-center justify-center text-xs font-bold">2</div>
                                <p className="text-sm text-zinc-300">Enter the 5-15 character reference number below</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submitPayment} className="flex flex-col gap-6">
                        <FieldGroup>
                            <Controller
                                name="receiptNumber"
                                control={paymentForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-muted-foreground text-xs uppercase tracking-widest mb-2" htmlFor="form-receiptNumber">Receipt Number</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-receiptNumber"
                                            className="h-12 transition-all "
                                            placeholder="e.g TXN123456789"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-rose-400 text-xs mt-2" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button className="w-full h-12 rounded-xl font-semibold" disabled={isPaymentPending}>
                            {isPaymentPending ? "Verifying..." : "Verify Payment"}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                        <p className="text-sm text-emerald-400">
                            Plan fully discounted with <span className="font-bold">{discountDetails.code}</span>
                        </p>
                    </div>
                    <Button
                        className="w-full h-12  font-semibold"
                        disabled={isPaymentPending}
                        onClick={() => {
                            paymentMutation.mutate({
                                receiptNumber: "FREE00",
                                planId: selectedPlan!.id,
                                discountCode: discountDetails.code,
                                group: groupForm.getValues(),
                                affiliateId: null,
                            })
                        }}
                    >
                        {isPaymentPending ? "Activating..." : "Activate Now"}
                    </Button>
                </div>
            )}

            <div className="pt-2 border-t border-zinc-900">
                <DiscountCodeButton
                    planId={selectedPlan?.id}
                    appliedDiscount={discountDetails}
                    onApplied={setDiscountDetails}
                    setAffiliateId={setAffiliateId}
                />
            </div>

            <DialogFooter className="flex !flex-row items-center !justify-between mt-4 border border-border">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="link">How it work?</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader>
                            <PopoverTitle>Why is this happend</PopoverTitle>
                            <PopoverDescription>because there is not payment getaway in ethiopia.</PopoverDescription>
                        </PopoverHeader>
                    </PopoverContent>
                </Popover>
                <Button
                    variant="ghost"
                    onClick={() => setStep("pricing")}
                    className="text-muted-foreground hover:text-white px-6 cursor-pointer"
                    disabled={isPaymentPending}
                >
                    Back to plans
                </Button>
            </DialogFooter>
        </div>
    )
}
