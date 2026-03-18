import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { affiliateCommission, AffiliateCommissionSchema, GroupSchema, UserSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const getCommissionByAffiliateId = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/commission",
        method: "GET",
        summary: "get commission by affiliate id",
        tags: ["commission"]
    })
    .input(z.object({ affiliateId: z.string() }))
    .output(z.array(AffiliateCommissionSchema.extend({ buyerUser: UserSchema.nullable(), group: GroupSchema })))
    .handler(async ({ input, errors }) => {
        const dbCommissions = await db.query.affiliateCommission.findMany({
            where: eq(affiliateCommission.affiliateId, input.affiliateId),
            with: {
                buyerUser: true,
                group: true
            }
        })

        if (!dbCommissions) {
            throw errors.NOT_FOUND()
        }

        return dbCommissions
    })
