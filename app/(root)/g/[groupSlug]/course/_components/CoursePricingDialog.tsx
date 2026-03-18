"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { orpc } from "@/lib/orpc"
import { paymentFormSchema, paymentFormSchemaTypes } from "@/zod-schema/paymentZodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { isDefinedError } from "@orpc/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useGroup } from "../../_components/context/GroupContext"

type CoursePricingDialogProps = {
    courseId: string;
    coursePrice: number;
    open: boolean;
    onChangeAction: (open: boolean) => void;
}

export function CoursePricingDialog({ coursePrice, courseId, open, onChangeAction }: CoursePricingDialogProps) {
    const router = useRouter()

    const { group } = useGroup()

    const paymentMutation = useMutation(orpc.payment.course.mutationOptions({
        onSuccess: (newCourse) => {
            toast.success("Paid successfully")
            router.push(`/g/${group.slug}/course/${newCourse.courseId}`)
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                const definedError = error as Error
                toast.error(definedError.message)
                return
            }
            console.error(error)

            toast.error("Something went wrong, try again.")
        }
    }))

    const paymentForm = useForm<paymentFormSchemaTypes>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            receiptNumber: ""
        }
    })

    const submitPayment = paymentForm.handleSubmit(async ({ receiptNumber }) => {
        paymentMutation.mutate({
            groupId: group.id,
            courseId,
            receiptNumber,
            paidAmount: coursePrice,
            ownerPhoneNumber: group.phoneNumber!
        })
    })

    return (
        <Dialog open={open} onOpenChange={onChangeAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Complete payment</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-semibold">Enter Receipt reference</p>
                        <p className="text-muted-foreground">
                            complete payment in Telebirr <span className="font-semibold">{group.phoneNumber}</span> app, then enter the reference number
                        </p>
                    </div>
                    <div className="border border-border rounded-lg p-2">
                        <p className="text-muted-foreground">
                            <span className="font-semibold">Instructions:</span> send <span className="font-semibold">{coursePrice}</span> to{" "}
                            <span className="font-semibold">Telebirr {group.phoneNumber}</span> You&apos;ll receive reference (5 - 15 character)
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
            </DialogContent>
        </Dialog>
    )
}
