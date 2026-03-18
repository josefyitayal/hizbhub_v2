import { pgEnum } from "drizzle-orm/pg-core";

export const postPermissionEnum = pgEnum('channel_post_permission', ['all', 'admin'])
export const replayPermissionEnum = pgEnum('channel_replay_permission', ['all', 'admin'])
export const billingIntervalEnum = pgEnum("billing_interval", ["month", "6month", "year"])
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "trial", "expired", "canceled"])
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"])
export const affiliateTierEnum = pgEnum("affiliate_tier", ["REGULAR", "CREATOR"]);
export const statusEnum = pgEnum("status", ["PENDING", "APPROVED", "PAID", "REJECTED"]);
export const affiliateStatus = pgEnum("affiliate_status", ["PENDING", "ACTIVE", "REJECTED", "INVITED"])
export const commissionStatusEnum = pgEnum("commission_status", ["PENDING", "APPROVED", "PAID", "REJECTED"]);

