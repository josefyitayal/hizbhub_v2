import {
    pgTable,
    text,
    boolean,
    timestamp,
    uuid,
    integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { affiliateStatus, affiliateTierEnum, billingIntervalEnum, commissionStatusEnum, statusEnum } from "./enums";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";

export const affiliates = pgTable("affiliates", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
    commissionRate: integer("commission_rate").default(10).notNull(), // e.g., 10 for 10%
    discountRate: integer("discount_rate").default(10).notNull(),
    referralCode: text("affiliate_slug").notNull().unique(), // hizbhub.com/ref/slug
    totalEarned: integer("total_earned").default(0).notNull(), // Stored in smallest unit (e.g., cents)
    totalSale: integer("total_sale").default(0).notNull(),
    status: affiliateStatus("status"),
    maxUses: integer("max_uses"),
    telebirrNumber: text("telebirr_number"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const affiliateCommission = pgTable("affiliate_commission", {
    id: uuid("id").defaultRandom().primaryKey(),
    affiliateId: uuid("affiliate_id").references(() => affiliates.id).notNull(),
    buyerUserId: uuid("buyer_user_id").references(() => users.id).notNull(),
    groupId: uuid("group_id").references(() => groups.id).notNull(),
    billingCycle: billingIntervalEnum("billing_cycle").notNull(),
    originalPrice: integer("original_price").notNull(),
    discountAmount: integer("discount_amount").notNull(),
    finalPaidAmount: integer("final_paid_amount").notNull(),
    commissionAmount: integer("commission_amount").notNull(),
    status: commissionStatusEnum("status"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const creatorCodes = pgTable("creator_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(), // The code used during onboarding
    commissionRate: integer("commission_rate").default(10).notNull(), // what the affiliate get
    discountRate: integer("discount_rate"), // if the affiliate is creator what the audiance discount
    referralCode: text("referral_code").notNull().unique(), // hizbhub.com/ref/slug
    status: affiliateStatus("status"),
    maxUses: integer("max_uses"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const linkClicks = pgTable("link_clicks", {
    id: uuid("id").defaultRandom().primaryKey(),
    affiliateId: uuid("affiliate_id").references(() => affiliates.id).notNull(),
    ipAddress: text("ip_address"),
    referralCode: text("affiliate_slug").notNull().unique(), // hizbhub.com/ref/slug
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Affiliate = InferSelectModel<typeof affiliates>;
export type NewAffiliate = InferInsertModel<typeof affiliates>;

export type AffiliateCommission = InferSelectModel<typeof affiliateCommission>;
export type NewAffiliateCommission = InferInsertModel<typeof affiliateCommission>;

export type CreatorCode = InferSelectModel<typeof creatorCodes>;
export type NewCreatorCode = InferInsertModel<typeof creatorCodes>;

export type LinkClick = InferSelectModel<typeof linkClicks>;
export type NewLinkClick = InferInsertModel<typeof linkClicks>;

export const AffiliateSchema = createSelectSchema(affiliates)
export const AffiliateCommissionSchema = createSelectSchema(affiliateCommission)
export const CreatorCodeSchema = createSelectSchema(creatorCodes)
export const LinkClickSchema = createSelectSchema(linkClicks)
