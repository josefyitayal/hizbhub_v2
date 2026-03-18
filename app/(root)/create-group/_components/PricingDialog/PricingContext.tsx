'use client'

import { Plan } from '@/db/schemas';
import { CreateGroupFormTypes } from '@/zod-schema/createGroupZodSchema';
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch, useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export type PricingContextType = {
    plans: Plan[] | null, // Removed undefined since it starts with initialPlans
    selectedPlan: Plan | null,
    setSelectedPlan: Dispatch<SetStateAction<Plan | null>>,
    open: boolean,
    setOpen: (open: boolean) => void,
    step: string;
    setStep: Dispatch<SetStateAction<"pricing" | "form">>
    formattedPrice: string,
    groupForm: UseFormReturn<CreateGroupFormTypes>
}

// Keep the null here for the default value
const PricingContext = createContext<PricingContextType | null>(null);

type PricingProviderProps = {
    children: ReactNode,
    initialPlans: Plan[],
    open: boolean,
    setOpen: (open: boolean) => void
    step: string;
    setStep: Dispatch<SetStateAction<"pricing" | "form">>
    groupForm: UseFormReturn<CreateGroupFormTypes>
}

export function PricingProvider({ children, initialPlans, open, setOpen, step, setStep, groupForm }: PricingProviderProps) {
    const [plans] = useState<Plan[]>(initialPlans);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const formattedPrice = useMemo(() => {
        if (!selectedPlan) return "--"
        return `${selectedPlan.price.toLocaleString()} birr`
    }, [selectedPlan])

    return (
        <PricingContext.Provider
            value={{
                plans,
                selectedPlan,
                setSelectedPlan,
                open,    // Now synced with parent
                setOpen, // Now synced with parent
                step,
                setStep,
                formattedPrice,
                groupForm
            }}
        >
            {children}
        </PricingContext.Provider>
    );
}

export const usePricing = () => {
    const context = useContext(PricingContext);
    if (!context) {
        throw new Error("usePricing must be used within a PricingProvider");
    }
    return context;
};
