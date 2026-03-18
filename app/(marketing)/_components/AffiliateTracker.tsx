"use client";

import { registerAffiliate } from "@/actions/registerAffiliate";
import { useEffect } from "react";

export default function AffiliateTracker({ referral }: { referral: string }) {
    useEffect(() => {
        if (referral) {
            // Calling the server action from the client makes it a valid "Action"
            registerAffiliate(referral);
        }
    }, [referral]);

    return null; // This component doesn't need to render anything
}
