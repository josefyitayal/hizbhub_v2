"use client"

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { isDefinedError } from "@orpc/client";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Plan } from "@/db/schemas";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCurrentGroupQuery } from "./hooks/useCurrentGroupQuery";
import { paymentFormSchema, paymentFormSchemaTypes } from "@/zod-schema/paymentZodSchema";

export function SubscripitonPayment() {
    const { groupSlug } = useParams<{ groupSlug: string }>()
    const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: plans } = useQuery(orpc.plan.list.queryOptions())
    const { data: { group, subscription } } = useCurrentGroupQuery()

    useEffect(() => {
        if (plans) {
            setSelectedPlan(plans.find(p => p.id === subscription.planId));
        }
    }, [plans, subscription.planId]); // Added subscription.planId here

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

    const submitPayment = paymentForm.handleSubmit(async ({ receiptNumber }) => {
        if (selectedPlan) {
            paymentMutation.mutate({
                receiptNumber,
                planId: selectedPlan.id,
                discountCode: "",
                groupId: "",
            });
        }
    })
    const formattedPrice = useMemo(() => {
        if (!selectedPlan) return "--"
        return `${selectedPlan.price.toLocaleString()} birr`
    }, [selectedPlan])

    return (
        <div className="flex flex-col gap-7 w-full p-5 bg-black text-white rounded-2xl relative">
            <div>
                <p className="text-xl font-bold">Your subscription is ended</p>
            </div>

            <div className="w-full rounded-lg border border-border flex items-center justify-between p-8">
                <div className="flex flex-col items-center gap-4 w-full border-r border-border">
                    <p className="text-lg text-muted-foreground">Plan</p>
                    <div className="flex flex-col">
                        <p className="text-3xl font-medium">{selectedPlan?.name}</p>
                        <Button onClick={() => setDialogOpen(true)} variant="link" size="sm" className="text-sm">Change</Button>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-lg text-muted-foreground">Total amount</p>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-medium">{formattedPrice}</span>
                    </div>
                </div>
            </div>
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
                <Button className="w-full" disabled={paymentMutation.isPending}>
                    {paymentMutation.isPending ? "Verifying..." : "Buy and verify"}
                </Button>
            </form>

            <div className="flex !flex-row items-center !justify-between">
                <div className="">
                    <p className="text-muted-foreground">How it work</p>
                </div>
            </div>
            <ChangePlanDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                setSelectedPlan={setSelectedPlan}
                plans={plans}
            />
        </div>
    )
}

type ChangePlanDialogProps = {
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedPlan: React.Dispatch<React.SetStateAction<Plan | undefined>>;
    plans: Plan[] | undefined;
}

const ChangePlanDialog = ({ dialogOpen, setDialogOpen, plans, setSelectedPlan }: ChangePlanDialogProps) => {
    function handleSelect(planId: string) {
        setSelectedPlan(plans?.find(p => p.id === planId))
        setDialogOpen(false)
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Plan</DialogTitle>
                </DialogHeader>
                <div className="">
                    <div className="grid grid-cols-3 gap-5">
                        {plans?.map((plan) => (
                            <div key={plan.id} className="flex w-full flex-col gap-3">
                                <p className="text-xl text-center">{plan.name}</p>
                                <p className="text-muted-foreground text-center">{plan.billingInterval}</p>
                                <Button onClick={() => handleSelect(plan.id)} className="w-full">Select</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
