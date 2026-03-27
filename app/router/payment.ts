import z from "zod";
import slugify from "slugify";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { formatTelebirrMask } from "@/lib/formatTelebirrMask";
import { DbClient } from "@/db/types";
import { errorsType } from "@/types/globals";
import { createGroupFormSchema, CreateGroupFormTypes } from "@/zod-schema/createGroupZodSchema";
import { affiliateCommission, affiliates, channels, ChannelSchema, courseSubscriptions, CourseSubscriptionSchema, discountCodes, groups, GroupSchema, groupSubscriptions, GroupSubscriptionSchema, members, orders, Plan, plans, subscriptions } from "@/db/schemas";
import { telebirrVerify } from "@/actions/telebirrVerify";
import { verifyPayment } from "@/actions/verifyPayment";
import { DiscountValidationResult, validateDiscountForPlan } from "./discount";
import { nanoid } from 'nanoid';

const creatingGroupPaymentInput = z.object({
    receiptNumber: z.string().min(5).max(15),
    planId: z.string(),
    discountCode: z.string().trim().optional(),
    group: createGroupFormSchema,
    affiliateId: z.string().nullable()
});

const startTrialInput = z.object({
    planId: z.string(),
    group: createGroupFormSchema,
});

type CreateGroupArgs = {
    tx: DbClient;
    input: CreateGroupFormTypes;
    userId: string;
    errors: errorsType;
    isTrial?: boolean;
};

const createGroupWithDefaults = async ({
    tx,
    input,
    userId,
    errors,
    isTrial
}: CreateGroupArgs) => {
    const [group] = await tx
        .insert(groups)
        .values({
            slug: `${slugify(input.name)}-${nanoid(6)}`,
            title: input.name,
            description: input.description,
            ownerId: userId,
            category: [input.category],
            private: isTrial ? true : false
        })
        .returning();

    if (!group) {
        throw errors.INTERNAL_SERVER_ERROR({
            message: "Failed to create group",
        });
    }

    const [channel] = await tx
        .insert(channels)
        .values({
            name: "General",
            postPermission: "all",
            replayPermission: "all",
            groupId: group.id,
        })
        .returning();

    if (!channel) {
        throw errors.INTERNAL_SERVER_ERROR({
            message: "Failed to create default channel",
        });
    }

    const [member] = await tx
        .insert(members)
        .values({
            userId,
            groupId: group.id,
        })
        .returning();

    if (!member) {
        throw errors.INTERNAL_SERVER_ERROR({
            message: "Failed to join owner to group",
        });
    }

    return { group, channel };
};

export const calculatePeriodEnd = (start: Date, interval: Plan["billingInterval"]) => {
    const end = new Date(start);
    if (interval === "month") {
        end.setMonth(end.getMonth() + 1);
    } else if (interval === "6month") {
        end.setMonth(end.getMonth() + 6);
    } else {
        end.setFullYear(end.getFullYear() + 1);
    }
    return end;
};

const addDays = (start: Date, days: number) => {
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    return end;
};

export const incrementDiscountUsage = async (tx: DbClient, discount: DiscountValidationResult | null) => {
    if (!discount) return;

    await tx
        .update(discountCodes)
        .set({
            usedCount: (discount.record.usedCount ?? 0) + 1,
        })
        .where(eq(discountCodes.id, discount.summary.discountId));
};

export const verifyReceiptNotUsed = async (receiptNumber: string, errors: errorsType) => {
    const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.paymentReference, receiptNumber));

    if (existing.length > 0) {
        throw errors.BAD_REQUEST({
            message: "This receipt number has already been used",
        });
    }
};

const successResponseSchema = z.object({
    group: GroupSchema,
    channel: ChannelSchema,
});

export const creatingGroupPayment = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/payment",
        summary: "verify payment",
        tags: ["payment"],
    })
    .input(creatingGroupPaymentInput)
    .output(successResponseSchema)
    .handler(async ({ input, context, errors }) => {
        const [plan] = await db.select().from(plans).where(eq(plans.id, input.planId));

        if (!plan) {
            throw errors.NOT_FOUND({
                message: "Plan not found",
            });
        }

        await verifyReceiptNotUsed(input.receiptNumber, errors);

        const discountData = input.discountCode
            ? await validateDiscountForPlan({
                code: input.discountCode,
                plan,
                errors,
            })
            : null;

        const finalAmount = discountData?.summary.finalAmount ?? plan.price;
        const isFreeWithDiscount = !!discountData && finalAmount === 0;

        if (!isFreeWithDiscount) {
            const { data, success: telebirrSuccess, message: telebirrMessage } = await telebirrVerify(input.receiptNumber);

            if (!telebirrSuccess) {
                throw errors.NOT_FOUND({ message: telebirrMessage })
            }

            const { success, message } = verifyPayment(
                data.data,
                formatTelebirrMask(process.env.MY_TELEBIRR_PHONE_NUMBER!),
                finalAmount
            )

            if (!success) {
                throw errors.NOT_FOUND({ message: message })
            }
        }

        let finalAffiliateId = discountData?.record.affiliateId || input.affiliateId;

        // 5. SELF-REFERRAL BLOCK (Backend Safety Net)
        if (finalAffiliateId === context.user.id) {
            finalAffiliateId = null;
        }

        return await db.transaction(async (tx) => {

            const now = new Date();
            const activeUntil = calculatePeriodEnd(now, plan.billingInterval);

            // A. Create Group
            const created = await createGroupWithDefaults({
                tx: tx, // Pass the transaction object!
                input: input.group,
                userId: context.user.id,
                errors,
            });

            // B. Create Subscription
            await tx.insert(subscriptions).values({
                groupId: created.group.id,
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
            });


            // C. Create Order
            const [dbOrder] = await tx.insert(orders).values({
                userId: context.user.id,
                discountId: discountData?.record.id,
                affiliateId: finalAffiliateId,
                totalAmount: plan.price,
                finalAmount: finalAmount,
            }).returning();


            // D. Handle Commission (Only if money was paid)
            // We usually don't pay commission on $0 orders unless you want to reward free signups
            if (finalAffiliateId && finalAmount > 0) {
                const [dbAffiliate] = await tx.select()
                    .from(affiliates)
                    .where(eq(affiliates.id, finalAffiliateId));

                if (dbAffiliate && dbAffiliate.status === "ACTIVE" && discountData) {
                    // CALCULATE COMMISSION ON FINAL AMOUNT
                    // Example: Sale 1000, Discount 10% -> Final 900. Commission 10% -> Earns 90.
                    const rawCommission = finalAmount * (dbAffiliate.commissionRate / 100);
                    const commissionAmount = Math.floor(rawCommission); // Keep it integer/cents

                    await tx.insert(affiliateCommission).values({
                        affiliateId: finalAffiliateId,
                        buyerUserId: context.user.id,
                        commissionAmount: commissionAmount,
                        status: "PENDING", // Always start pending!
                        groupId: created.group.id,
                        billingCycle: plan.billingInterval,
                        originalPrice: plan.price,
                        discountAmount: discountData?.summary.amountOff,
                        finalPaidAmount: discountData?.summary.finalAmount,
                    });
                }
            }

            // E. Update Discount Usage
            if (discountData) {
                await incrementDiscountUsage(tx, discountData);
            }

            return created;
        });
    });

export const startTrial = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/payment/trial",
        summary: "start trial",
        tags: ["payment"],
    })
    .input(startTrialInput)
    .output(successResponseSchema)
    .handler(async ({ input, context, errors }) => {
        const [plan] = await db.select().from(plans).where(eq(plans.id, input.planId));

        if (!plan) {
            throw errors.NOT_FOUND({
                message: "Plan not found",
            });
        }

        const now = new Date();
        const trialEndsAt = addDays(now, 3);

        const created = await createGroupWithDefaults({
            tx: db,
            input: input.group,
            userId: context.user.id,
            errors,
            isTrial: true
        });

        await db.insert(subscriptions).values({
            groupId: created.group.id,
            planId: plan.id,
            startDate: now,
            endDate: trialEndsAt,
            currentPeriodEnd: trialEndsAt,
            discountId: null,
            amount: 0,
            paymentReference: "TRIAL",
            status: "trial",
        });

        return created;
    });


export const payForJoiningGroupInput = z.object({
    groupId: z.string(),
    receiptNumber: z.string(),
    paidAmount: z.number(),
    phoneNumber: z.string()
})

export const payForJoiningGroup = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/payment",
        summary: "payment for group",
        tags: ["payment"],
    })
    .input(payForJoiningGroupInput)
    .output(GroupSubscriptionSchema)
    .handler(async ({ input, context, errors }) => {
        const existing = await db
            .select()
            .from(groupSubscriptions)
            .where(eq(groupSubscriptions.telebirrReceiptNumber, input.receiptNumber));

        if (existing.length > 0) {
            throw errors.BAD_REQUEST({
                message: "This receipt number has already been used",
            });
        }

        try {
            const { data, success: telebirrSuccess, message: telebirrMessage } = await telebirrVerify(input.receiptNumber);
            if (!telebirrSuccess) {
                throw errors.NOT_FOUND({ message: telebirrMessage })
            }

            const { success, message } = verifyPayment(
                data.data,
                formatTelebirrMask(input.phoneNumber),
                input.paidAmount
            )

            if (!success) {
                throw errors.NOT_FOUND({ message: message })
            }
        } catch (error) {
            throw errors.BAD_REQUEST({
                message: "Could not verify payment. Please double-check the receipt number.",
            });
        }

        const [result] = await db.insert(groupSubscriptions).values({
            userId: context.user.id,
            groupId: input.groupId,
            paidAmount: input.paidAmount,
            telebirrReceiptNumber: input.receiptNumber,
            status: "active",
        }).returning();

        if (!result) throw errors.NOT_FOUND()


        return result;
    });


export const payForCourseInput = z.object({ groupId: z.string(), courseId: z.string(), receiptNumber: z.string(), paidAmount: z.number(), ownerPhoneNumber: z.string() })

export const payForCourse = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/payment",
        summary: "payment for course",
        tags: ["payment"],
    })
    .input(payForCourseInput)
    .output(CourseSubscriptionSchema)
    .handler(async ({ input, context, errors }) => {
        const existing = await db
            .select()
            .from(courseSubscriptions)
            .where(eq(courseSubscriptions.telebirrReceiptNumber, input.receiptNumber));

        if (existing.length > 0) {
            throw errors.BAD_REQUEST({
                message: "This receipt number has already been used",
            });
        }

        try {
            const { data, success: telebirrSuccess, message: telebirrMessage } = await telebirrVerify(input.receiptNumber);
            if (!telebirrSuccess) {
                throw errors.NOT_FOUND({ message: telebirrMessage })
            }
            const { success, message } = verifyPayment(
                data.data,
                formatTelebirrMask(input.ownerPhoneNumber),
                input.paidAmount
            )
            if (!success) {
                throw errors.NOT_FOUND({ message: message })
            }
        } catch {
            throw errors.BAD_REQUEST({
                message: "Could not verify payment. Please double-check the receipt number.",
            });
        }

        const [result] = await db.insert(courseSubscriptions).values({
            userId: context.user.id,
            groupId: input.groupId,
            courseId: input.courseId,
            paidAmount: input.paidAmount,
            telebirrReceiptNumber: input.receiptNumber,
            status: "active",
        }).returning();

        if (!result) throw errors.NOT_FOUND()

        return result;
    });
