export { }

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            onboardingComplete?: boolean
        }
    }
}


export type errorsType = ORPCErrorConstructorMap<MergedErrorMap<Record<never, never>, {
    FORBIDDEN: {
        message: string;
    };
    BAD_REQUEST: {
        message: string;
    };
    NOT_FOUND: {
        message: string;
    };
    UNAUTHORIZED: {
        message: string;
    };
    INTERNAL_SERVER_ERROR: {
        message: string;
    };
}>>

export type telebirrApiResponseType = {
    payerName: string;
    payerTelebirrNo: string;
    creditedPartyName: string;
    creditedPartyAccountNo: string;
    transactionStatus: string;
    receiptNo: string;
    paymentDate: string;
    settledAmount: string;
    serviceFee: string;
    serviceFeeVAT: string;
    totalPaidAmount: string;
    bankName: string;
}
