"use client"

import { detailGroupSchema, joinGroupInput } from "@/app/router/group";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MemberSchema } from "@/db/schemas";
import { orpc } from "@/lib/orpc";
import { paymentFormSchema, paymentFormSchemaTypes } from "@/zod-schema/paymentZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type GroupType = z.infer<typeof detailGroupSchema>;

type JoinMutationData = z.infer<typeof MemberSchema>; /* Type of successful response (e.g., A Group object) */;
type JoinMutationVariables = z.infer<typeof joinGroupInput>; /* Type of input (e.g., { groupId: string }) */;
type JoinMutationError = Error;

type GroupPricingProps = {
    group: GroupType;
    joinGroupMutation: UseMutationResult<
        JoinMutationData,
        JoinMutationError,
        JoinMutationVariables,
        unknown // The 'context' type, usually unknown or void if unused
    >;
}

export function GroupPricing({ group, joinGroupMutation }: GroupPricingProps) {
    const paymentMutation = useMutation(orpc.payment.joiningGroup.mutationOptions({
        onSuccess: () => {
            joinGroupMutation.mutate({ groupId: group.id, groupSlug: group.slug })
        },
        onError: (errors) => {
            toast.error(errors.message)
        }
    }))

    const form = useForm<paymentFormSchemaTypes>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            receiptNumber: ""
        }
    })

    function onSubmit(data: paymentFormSchemaTypes) {
        paymentMutation.mutate({
            groupId: group.id,
            receiptNumber: data.receiptNumber,
            paidAmount: group.price!,
            phoneNumber: group.phoneNumber!,
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full">Join for {group.price} birr</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Complete payment</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="font-semibold">Enter Receipt reference</p>
                            <p className="text-muted-foreground">
                                complete payment in Telebirr <span className="font-semibold">{group.phoneNumber}</span> app, then enter the reference number
                            </p>
                        </div>
                        <div className="border border-border rounded-lg p-2">
                            <p className="text-muted-foreground">
                                <span className="font-semibold">Instructions:</span> send <span className="font-semibold">{group.price}</span> to{" "}
                                <span className="font-semibold">Telebirr {group.phoneNumber}</span> You&apos;ll receive reference (5 - 15 character)
                            </p>
                        </div>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <FieldGroup>
                            <Controller
                                name="receiptNumber"
                                control={form.control}
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
                            {paymentMutation.isPending ? "Verifying..." : "Verify and join"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
