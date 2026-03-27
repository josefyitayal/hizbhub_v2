"use client"

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { PricingList } from "./PricingList";
import { CreateGroupFormTypes } from "@/zod-schema/createGroupZodSchema";
import { PricingForm } from "./PricingForm";
import { PricingProvider } from "./PricingContext";

type PricingDialogProps = {
    pricingDialogOpen: boolean,
    setPricingDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    groupForm: UseFormReturn<CreateGroupFormTypes>
}

export const PricingDialog = ({ pricingDialogOpen, setPricingDialogOpen, groupForm }: PricingDialogProps) => {
    const [step, setStep] = useState<"pricing" | "form">("pricing")

    const { data: plans } = useSuspenseQuery(orpc.plan.list.queryOptions())

    const handleDialogChange = (state: boolean) => {
        setPricingDialogOpen(state)
        if (!state) {
            setStep("pricing")
        }
    }

    return (
        <PricingProvider
            initialPlans={plans!}
            open={pricingDialogOpen}
            setOpen={setPricingDialogOpen}
            step={step}
            setStep={setStep}
            groupForm={groupForm}
        >
            <Dialog open={pricingDialogOpen} onOpenChange={handleDialogChange}>
                <DialogContent
                    className="
                        !max-w-none w-[95vw] md:w-[60vw] lg:w-[45vw] h-auto 
                    "
                >
                    {step === "pricing" ? (
                        <PricingList />
                    ) : (
                        /* --- Phone Verification Step --- */
                        <PricingForm />
                    )}
                </DialogContent>
            </Dialog>
        </PricingProvider>
    )
}
