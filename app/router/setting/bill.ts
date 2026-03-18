import z from "zod";
import db from "@/db/drizzle";
import { channels, ChannelSchema, groups, GroupSchema, plans, PlanSchema, subscriptions, SubscriptionSchema } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, eq } from "drizzle-orm";

export const listBillingSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/billing",
        method: "GET",
        summary: "get billing settings",
        tags: ["billingSetting"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(z.object({ plan: PlanSchema, subscription: z.array(SubscriptionSchema) }))
    .handler(async ({ input, errors }) => {
        const subscriptionResult = await db.query.subscriptions.findMany({
            where: eq(subscriptions.groupId, input.groupId)
        })

        if (!subscriptionResult || subscriptionResult.length === 0) {
            throw errors.NOT_FOUND({ message: "subscription is not found" });
        }

        const lastSubscription = subscriptionResult.at(-1);
        const lastPlanId = lastSubscription?.planId;

        if (!lastPlanId) {
            throw errors.NOT_FOUND({ message: "valid plan ID not found in subscription" });
        }

        const [planResult] = await db.select()
            .from(plans)
            .where(eq(plans.id, lastPlanId));

        if (!planResult) {
            throw errors.NOT_FOUND({ message: "plan is not found" });
        }

        return {
            plan: planResult,
            subscription: subscriptionResult
        };
    })
