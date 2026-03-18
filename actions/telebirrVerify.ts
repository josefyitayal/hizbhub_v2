"use server"

import axios, { AxiosError } from "axios";

export const telebirrVerify = async (reference: string) => {
    try {
        const response = await axios.post(
            "https://verifyapi.leulzenebe.pro/verify-telebirr",
            { reference },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.VERIFY_TELEBIRR_API_KEY || "",
                },
                timeout: 150000, // 10 seconds
            }
        );

        // Axios only reaches here if status is 2xx
        return {
            data: response.data,
            success: true,
            message: "successful"
        };

    } catch (error: unknown) {
        // 1. Handle Axios-specific errors (HTTP errors, timeouts, etc.)
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const code = error.code;

            // Handle Timeout
            if (code === 'ECONNABORTED') {
                return { data: null, success: false, message: "Verification timed out. Please try again." };
            }

            // Handle specific HTTP Status Codes
            if (status === 401 || status === 403) {
                return { data: null, success: false, message: "Auth failed (Invalid API Key)" };
            }
            if (status === 404) {
                return { data: null, success: false, message: "Transaction reference not found" };
            }
            if (status && status >= 500) {
                return { data: null, success: false, message: "Telebirr verification server is down" };
            }

            // Handle Network errors (no response)
            if (!error.response) {
                return { data: null, success: false, message: "Network error: check your connection" };
            }
        }

        // 2. Generic fallback for unexpected code errors
        console.error("[Telebirr_Verify_Error]:", error);
        return {
            data: null,
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred"
        };
    }
};
