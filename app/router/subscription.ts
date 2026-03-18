import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { affiliateCommission, affiliates, orders, plans, subscriptions, SubscriptionSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { calculatePeriodEnd, incrementDiscountUsage, verifyReceiptNotUsed } from "./payment";
import { validateDiscountForPlan } from "./discount";
import { formatTelebirrMask } from "@/lib/formatTelebirrMask";
import { telebirrVerify } from "@/actions/telebirrVerify";
import { verifyPayment } from "@/actions/verifyPayment";

const activateFullAccessInput = z.object({
    receiptNumber: z.string().min(5).max(15),
    planId: z.string(),
    discountCode: z.string().trim().optional(),
    groupId: z.string(),
    // Added affiliateId to track referrals on upgrade
    affiliateId: z.string().nullable().optional()
});

export const activateFullAccess = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/subscription",
        summary: "updating subscription",
        tags: ["subscription"]
    })
    .input(activateFullAccessInput)
    .output(SubscriptionSchema)
    .handler(async ({ input, context, errors }) => {
        // 1. Validate Plan
        const [plan] = await db.select().from(plans).where(eq(plans.id, input.planId));

        if (!plan) {
            throw errors.NOT_FOUND({
                message: "Plan not found",
            });
        }

        // 2. Verify Receipt (ensure it hasn't been used before)
        await verifyReceiptNotUsed(input.receiptNumber, errors);

        // 3. Validate Discount
        const discountData = input.discountCode
            ? await validateDiscountForPlan({
                code: input.discountCode,
                plan,
                errors,
            })
            : null;

        const finalAmount = discountData?.summary.finalAmount ?? plan.price;
        const isFreeWithDiscount = !!discountData && finalAmount === 0;

        // 4. Verify Payment (Telebirr)
        if (!isFreeWithDiscount) {
            try {
                const data = await telebirrVerify(input.receiptNumber);
                const { success, message } = verifyPayment(
                    data.data,
                    formatTelebirrMask(process.env.MY_TELEBIRR_PHONE_NUMBER!),
                    finalAmount
                )

                if (!success) {
                    throw errors.NOT_FOUND({ message: message })
                }
            } catch {
                throw errors.BAD_REQUEST({
                    message: "Could not verify payment. Please double-check the receipt number.",
                });
            }
        }

        // 5. Determine Affiliate (Self-Referral Check)
        let finalAffiliateId = discountData?.record.affiliateId || input.affiliateId;

        if (finalAffiliateId === context.user.id) {
            finalAffiliateId = null;
        }

        // 6. START TRANSACTION
        return await db.transaction(async (tx) => {
            const now = new Date();
            const activeUntil = calculatePeriodEnd(now, plan.billingInterval);

            // A. Create/Update Subscription
            // Note: We use tx.insert here. If you need to "close" a previous trial subscription,
            // you might want to update that previous row's status to 'canceled' here first.
            const [updatedSubscription] = await tx.insert(subscriptions).values({
                groupId: input.groupId,
                planId: plan.id,
                startDate: now,
                endDate: activeUntil,
                currentPeriodEnd: activeUntil,
                discountId: discountData?.summary.discountId ?? null,
                amount: finalAmount,
                paymentReference: isFreeWithDiscount
                    ? `FREE:${discountData!.summary.code}`
                    : input.receiptNumber,
                status: "active",
            }).returning();

            // B. Create Order Record
            const [dbOrder] = await tx.insert(orders).values({
                userId: context.user.id,
                discountId: discountData?.record.id,
                affiliateId: finalAffiliateId,
                totalAmount: plan.price,
                finalAmount: finalAmount,
            }).returning();

            // C. Handle Commission (Only if money was paid)
            if (finalAffiliateId && finalAmount > 0) {
                const [dbAffiliate] = await tx.select()
                    .from(affiliates)
                    .where(eq(affiliates.id, finalAffiliateId));

                if (dbAffiliate && dbAffiliate.status === "ACTIVE" && discountData) {
                    const rawCommission = finalAmount * (dbAffiliate.commissionRate / 100);
                    const commissionAmount = Math.floor(rawCommission);

                    await tx.insert(affiliateCommission).values({
                        affiliateId: finalAffiliateId,
                        buyerUserId: context.user.id,
                        commissionAmount: commissionAmount,
                        status: "PENDING",
                        groupId: input.groupId,
                        billingCycle: plan.billingInterval,
                        originalPrice: plan.price,
                        discountAmount: discountData?.summary.amountOff,
                        finalPaidAmount: discountData?.summary.finalAmount,
                    });
                }
            }

            // D. Update Discount Usage
            if (discountData) {
                await incrementDiscountUsage(tx, discountData);
            }

            return updatedSubscription;
        });
    })
