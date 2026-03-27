import { telebirrApiResponseType } from "@/types/globals";

// Function in your backend to verify the payment data
export function verifyPayment(telebirrApiResponse: telebirrApiResponseType, telebirrNumber: string, expectedAmount: number) {
    // 1. Check status
    if (telebirrApiResponse.transactionStatus !== 'Completed') {
        return { success: false, message: 'Transaction not completed' };
    }

    // 2. Verify credited account number (YOUR number)
    if (telebirrApiResponse.creditedPartyAccountNo !== telebirrNumber) {
        return { success: false, message: 'Incorrect recipient account number' };
    }

    // 3. Confirm the amount (You may need to handle string/number conversion carefully)
    // Example: '200.00 Birr' -> 200
    const actualAmount = parseInt(telebirrApiResponse.settledAmount.split(' ')[0]);
    if (actualAmount !== expectedAmount) {
        return { success: false, message: 'Insufficient amount paid' };
    }

    // If all checks pass:
    return { success: true, message: 'Payment successfully verified and credited' };
}
