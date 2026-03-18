"use client"

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { isDefinedError } from "@orpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PricingList } from "./PricingList";
import { CreateGroupFormTypes } from "@/zod-schema/createGroupZodSchema";
import { PricingForm } from "./PricingForm";
import { PricingProvider, usePricing } from "./PricingContext";
import { uuid } from "drizzle-orm/gel-core";

type PricingDialogProps = {
    pricingDialogOpen: boolean,
    setPricingDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    groupForm: UseFormReturn<CreateGroupFormTypes>
}

export const PricingDialog = ({ pricingDialogOpen, setPricingDialogOpen, groupForm }: PricingDialogProps) => {
    const [step, setStep] = useState<"pricing" | "form">("pricing")

    const { data: plans, isPending } = useSuspenseQuery(orpc.plan.list.queryOptions())

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
