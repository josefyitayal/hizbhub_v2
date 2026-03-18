import { affiliateOnboardingFormSchema } from "@/zod-schema/affiliateOnboardingZodSchema";
import { base } from "../middlewares/base";
import { AffiliateCommissionSchema, affiliates, AffiliateSchema, creatorCodes, discountCodes, DiscountCodeScema, GroupSchema, linkClicks, users, UserSchema } from "@/db/schemas";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { count, eq, sql, sum } from "drizzle-orm";
import { z } from "zod"
import { requiredAuthMiddleware } from "../middlewares/auth";

export const createAffilate = base
    .route({
        method: "POST",
        path: "/affiliate",
        summary: "create new affiliate",
        tags: ["affiliate"]
    })
    .input(affiliateOnboardingFormSchema.extend({ creatorCode: z.string() }))
    .output(AffiliateSchema)
    .handler(async ({ input, errors }) => {
        const { referralCode, telebirr, creatorCode } = input;

        const { userId } = await auth();
        if (!userId) throw errors.UNAUTHORIZED();

        // 1. Fetch Creator Code Data
        const [creatorCodeData] = await db.select().from(creatorCodes)
            .where(eq(creatorCodes.code, creatorCode)).limit(1);

        if (!creatorCodeData) {
            errors.NOT_FOUND({ message: "Creator code not found" })
        }

        const [dbUser] = await db.select().from(users).where(eq(users.clerkId, userId));

        if (!dbUser) throw errors.UNAUTHORIZED({ message: "User record not found" });

        // 3. Create the Affiliate
        const [finalAffiliate] = await db.insert(affiliates).values({
            userId: dbUser.id,
            referralCode: creatorCodeData?.referralCode || `${dbUser.userName}${creatorCodeData?.commissionRate || 10}`,
            telebirrNumber: telebirr,
            commissionRate: creatorCodeData?.commissionRate,
            discountRate: creatorCodeData?.discountRate ?? 10,
            totalEarned: 0, // Stored in smallest unit (e.g., cents)
            totalSale: 0,
            status: "ACTIVE",
            maxUses: creatorCodeData?.maxUses ?? 100,
        }).onConflictDoNothing().returning();

        const oneYearFromNow = new Date(); // Current date
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        if (creatorCodeData) {
            await db.insert(discountCodes).values({
                code: creatorCodeData.referralCode, // e.g. SAVE10
                discountValue: creatorCodeData?.discountRate || 0, // 10 = 10% or $10 depending on type
                affiliateId: finalAffiliate.id,
                maxUses: creatorCodeData?.maxUses, // optional usage limit
                expiresAt: creatorCodeData?.expiresAt ?? oneYearFromNow, // optional expiration
                createdBy: dbUser.id, // link to creator/admin
            }).returning()
        }

        if (!finalAffiliate) {
            // If insert failed due to conflict, fetch the existing one
            const [existing] = await db.select().from(affiliates).where(eq(affiliates.userId, dbUser.id));
            return existing;
        }

        return finalAffiliate;
    })

// affiliate: dbAffiliate,
// discountCode: dbDiscount,
// stats: {
//     totalClicks: clickStats.count,
//     totalSignups: signupStats.count,
//     totalEarned: dbAffiliate.totalEarned,
//     totalSale: dbAffiliate.totalSale
// },

const getCurrentUserAffiliateDataOutput = z.object({
    affiliate: AffiliateSchema.extend({
        user: UserSchema,
        commissions: z.array(AffiliateCommissionSchema.extend({
            buyerUser: UserSchema
        }))
    }),
    discountCode: DiscountCodeScema,
    stats: z.object({
        totalClicks: z.number(),
        totalSignups: z.number(),
        totalEarned: z.number(),
        totalSale: z.number()
    }),
});

export const getCurrentUserAffiliateData = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/affiliate/usercurrent",
        method: "GET",
        summary: "getting the current user affiliate data",
        tags: ["affiliate"]
    })
    .input(z.void())
    .output(getCurrentUserAffiliateDataOutput)
    .handler(async ({ context }) => {
        const dbAffiliate = await db.query.affiliates.findFirst({
            where: eq(affiliates.userId, context.user.id),
            with: {
                user: true,
                commissions: {
                    limit: 10,
                    orderBy: (comm, { desc }) => [desc(comm.createdAt)],
                    with: {
                        buyerUser: true, // This populates the "Recent Referrals" table
                    }
                },
            },
        });

        if (!dbAffiliate) throw new Error("Affiliate profile not found");

        const [dbDiscount] = await db
            .select()
            .from(discountCodes)
            .where(eq(discountCodes.affiliateId, dbAffiliate.id))

        // 2. Stats: Total Clicks
        const [clickStats] = await db
            .select({ count: count() })
            .from(linkClicks)
            .where(eq(linkClicks.affiliateId, dbAffiliate.id));

        // 3. Stats: Total Signups (Referrals)
        // We count users who were referred by this specific user
        const [signupStats] = await db
            .select({ count: count() })
            .from(users)
            .where(eq(users.referredBy, dbAffiliate.userId));


        return {
            affiliate: dbAffiliate,
            discountCode: dbDiscount,
            stats: {
                totalClicks: clickStats.count,
                totalSignups: signupStats.count,
                totalEarned: dbAffiliate.totalEarned,
                totalSale: dbAffiliate.totalSale
            },
        };
    })

export const isUserJoinAffiliate = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/affiliate/isJoin",
        method: "GET",
        summary: "check if user join affiliate program",
        tags: ["affiliate"]
    })
    .input(z.void())
    .output(AffiliateSchema.nullable())
    .handler(async ({ context }) => {
        const [dbAffiliate] = await db.select().from(affiliates).where(eq(affiliates.userId, context.user.id))

        if (!dbAffiliate) {
            return null
        }

        return dbAffiliate
    })
