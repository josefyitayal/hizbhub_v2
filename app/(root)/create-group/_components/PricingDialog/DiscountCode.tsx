"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";
import { Spinner } from "@/components/ui/spinner";
import { getCookie } from 'cookies-next/client';
import { DiscountVerification } from "@/zod-schema/discountVerificationSchema";

type DiscountCodeProps = {
    planId?: string;
    appliedDiscount: DiscountVerification | null;
    onApplied: (discount: DiscountVerification | null) => void;
    setAffiliateId: Dispatch<SetStateAction<string | null>>
};

export function DiscountCodeButton({ planId, appliedDiscount, onApplied, setAffiliateId }: DiscountCodeProps) {
    const [showInput, setShowInput] = useState(false);
    const [code, setCode] = useState("");
    const [hasAutoApplied, setHasAutoApplied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const verifyDiscountMutation = useMutation(orpc.discount.verify.mutationOptions({
        onSuccess: (data) => {
            onApplied(data);
            toast.success(`Discount ${data.code} applied`);
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                toast.error(error.message);
                return;
            }
            toast.error("Failed to verify discount code");
        }
    }));

    useEffect(() => {
        // Only run if a plan is selected and we haven't already applied a code
        if (planId && !appliedDiscount && !hasAutoApplied) {
            setIsLoading(true)
            const cookieValue = getCookie("hizb_affiliate");
            console.log(cookieValue, "============")
            if (cookieValue) {
                try {
                    const affiliateData = JSON.parse(cookieValue);

                    // If the cookie has a code from a Creator link
                    if (affiliateData.autoCode) {
                        setCode(affiliateData.autoCode);
                        setShowInput(true); // Show the field so they see it worked
                        setAffiliateId(affiliateData.id)

                        // Trigger the mutation automatically
                        verifyDiscountMutation.mutate({
                            code: affiliateData.autoCode,
                            planId,
                        });

                        setHasAutoApplied(true);
                        setIsLoading(false)
                    }
                } catch (e) {
                    setIsLoading(false)
                    console.error("Error parsing affiliate cookie", e);
                }
            }
            setIsLoading(false)

        }
    }, [planId, appliedDiscount, hasAutoApplied, setAffiliateId, verifyDiscountMutation.mutate]);

    useEffect(() => {
        setCode(appliedDiscount?.code ?? "");
    }, [appliedDiscount?.code]);


    const handleVerify = () => {
        if (!planId) {
            toast.error("Select a plan first.");
            return;
        }

        if (!code.trim()) {
            toast.error("Enter a discount code.");
            return;
        }

        verifyDiscountMutation.mutate({
            code: code.trim(),
            planId,
        });
    };

    const handleRemove = () => {
        onApplied(null);
        setCode("");
    };

    return (
        <div className="flex flex-col gap-2 pt-5">
            {!showInput ? (
                <Button
                    variant="link"
                    className="w-fit cursor-pointer"
                    onClick={() => setShowInput(true)}
                    disabled={isLoading}
                >
                    {isLoading ? (<p><Spinner /> Checking coupon</p>) : (<p>Have a coupon code?</p>)}
                </Button>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Enter code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-64"
                            disabled={verifyDiscountMutation.isPending}
                        />
                        <Button
                            variant="secondary"
                            onClick={handleVerify}
                            disabled={verifyDiscountMutation.isPending}
                        >
                            {verifyDiscountMutation.isPending ? "Checking..." : appliedDiscount ? "Reapply" : "Apply"}
                        </Button>
                        {appliedDiscount && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleRemove}
                                disabled={verifyDiscountMutation.isPending}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                    {appliedDiscount && (
                        <p className="text-xs text-green-400">
                            You save {appliedDiscount.amountOff.toLocaleString()} birr with {appliedDiscount.code}.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
