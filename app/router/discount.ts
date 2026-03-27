import z from "zod";
import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { DiscountVerification, discountVerificationSchema } from "@/zod-schema/discountVerificationSchema";
import { Affiliate, DiscountCode, discountCodes, Plan, plans } from "@/db/schemas";
import { errorsType } from "@/types/globals";

const discountInputSchema = z.object({
    code: z.string().min(3, "Discount code is too short").trim(),
    planId: z.string(),
});

export type DiscountValidationResult = {
    summary: DiscountVerification;
    record: DiscountCode & { affiliate: Affiliate | null };
};

type ValidateDiscountArgs = {
    code: string;
    plan: Plan;
    errors: errorsType
};

export const verifyDiscount = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/discount",
        summary: "verify discount",
        tags: ["discount"]
    })
    .input(discountInputSchema)
    .output(discountVerificationSchema)
    .handler(async ({ input, errors }) => {
        const [plan] = await db
            .select()
            .from(plans)
            .where(eq(plans.id, input.planId));

        if (!plan) {
            throw errors.NOT_FOUND({
                message: "Plan not found",
            });
        }

        const { summary } = await validateDiscountForPlan({
            code: input.code,
            plan,
            errors,
        });

        return summary;
    });

export const validateDiscountForPlan = async ({
    code,
    plan,
    errors,
}: ValidateDiscountArgs): Promise<DiscountValidationResult> => {
    // const [dbDiscount] = await db
    //     .select()
    //     .from(discountCodes)
    //     .where(and(eq(discountCodes.code, code), eq(discountCodes.active, true)));

    const dbDiscount = await db.query.discountCodes.findFirst({
        where: and(eq(discountCodes.code, code), eq(discountCodes.active, true)),
        with: {
            affiliate: true
        }
    })

    if (!dbDiscount) {
        throw errors.NOT_FOUND({
            message: "Discount code not found",
        });
    }

    const now = new Date();

    if (dbDiscount.expiresAt && dbDiscount.expiresAt <= now) {
        throw errors.BAD_REQUEST({
            message: "Discount code expired",
        });
    }

    const usedCount = dbDiscount.usedCount ?? 0;
    if (
        typeof dbDiscount.maxUses === "number" &&
        dbDiscount.maxUses > 0 &&
        usedCount >= dbDiscount.maxUses
    ) {
        throw errors.BAD_REQUEST({
            message: "Discount usage limit reached",
        });
    }

    const isPercentage = dbDiscount.type === "percentage";
    const amountOff = isPercentage
        ? Math.round((plan.price * dbDiscount.discountValue) / 100)
        : dbDiscount.discountValue;

    const finalAmount = Math.max(plan.price - amountOff, 0);

    return {
        summary: {
            discountId: dbDiscount.id,
            code: dbDiscount.code,
            type: isPercentage ? "percentage" as const : "fixed" as const,
            value: dbDiscount.discountValue,
            originalAmount: plan.price,
            finalAmount,
            amountOff: plan.price - finalAmount,
            planId: plan.id,
        },
        record: dbDiscount,
    };
};
