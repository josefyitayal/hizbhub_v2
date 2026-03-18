import z from "zod";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { plans, PlanSchema } from "@/db/schemas";

export const listPlans = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/plan",
        summary: "list plans",
        tags: ["plan"]
    })
    .input(z.void())
    .output(z.array(PlanSchema))
    .handler(async ({ errors }) => {
        const dbPlans = await db.select().from(plans)
        if (!dbPlans) throw errors.NOT_FOUND()
        return dbPlans
    })
