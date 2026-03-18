import { Button } from "@/components/ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "@hugeicons/core-free-icons"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { usePricing } from "./PricingContext"
import { SkipToTrail } from "./SkipToTrial"
import { HugeiconsIcon } from "@hugeicons/react"


export const PricingList = () => {
    const { selectedPlan, open, setSelectedPlan, plans, setStep, formattedPrice } = usePricing()

    const handleStart = async () => {
        if (!selectedPlan) {
            toast.error("Please select a plan to continue.")
            return
        }

        setStep("form");
    }

    return (
        <div className="flex flex-col gap-8 w-full h-full">
            <DialogHeader className="text-center">
                <DialogTitle className="text-3xl">
                    choose plan
                </DialogTitle>
                <DialogDescription className="">
                    Unlock endless possibilities with Hizbhub
                </DialogDescription>
            </DialogHeader>

            {/* Plan Toggle (Tabs) */}
            <div className="w-full flex flex-col items-center gap-5">
                <Tabs
                    value={selectedPlan?.id}
                    onValueChange={(val) => {
                        const nextPlan = plans?.find(p => p.id === val)
                        if (nextPlan) {
                            setSelectedPlan(nextPlan)
                        }
                    }}
                    className=""
                >
                    <TabsList className="">
                        {plans?.map(plan => (
                            <TabsTrigger
                                key={plan.id}
                                value={plan.id}
                            >
                                {plan.name.replace(" ", "\u00A0")}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Pricing Card */}
                <div className="flex flex-col gap-5 items-center text-center w-full max-w-sm">
                    <h2
                        key={selectedPlan?.name}
                        className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                        {selectedPlan?.name}
                    </h2>

                    <div className="text-7xl font-normal tracking-tighter animate-in fade-in zoom-in-95 duration-700">
                        {formattedPrice}
                    </div>

                    {/* Feature List */}
                    <div className="text-center">
                        <p className="text-muted-foreground flex items-center gap-3">
                            <HugeiconsIcon icon={CheckCircle} size={12} /> In this plan you can you Hizbhub for {selectedPlan?.name.replace(" ", "\u00A0")}
                        </p>
                    </div>

                    <Button
                        onClick={handleStart}
                    >
                        Choose Plan
                    </Button>
                </div>
            </div>
            {/* Skip Link */}
            <DialogFooter className="border border-border">
                <SkipToTrail />
            </DialogFooter>
        </div>
    )
}
