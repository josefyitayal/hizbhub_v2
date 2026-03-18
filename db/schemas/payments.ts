import {
    pgTable,
    text,
    boolean,
    timestamp,
    uuid,
    real,
    integer,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from 'drizzle-zod';
import { users } from "./users";
import { groups } from "./groups";
import { courses } from "./courses";
import { discountTypeEnum, billingIntervalEnum, subscriptionStatusEnum } from "./enums";
import { affiliates } from "./affiliates";

export const discountCodes = pgTable("discount_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(), // e.g. SAVE10
    type: discountTypeEnum("type").default("percentage").notNull(), // "percentage" or "fixed"
    discountValue: integer("discount_value").notNull(), // 10 = 10% or $10 depending on type
    affiliateId: uuid("affiliate_id").references(() => affiliates.id),
    usedBy: uuid("used_by").references(() => users.id),
    maxUses: integer("max_uses"), // optional usage limit
    usedCount: integer("used_count").default(0),
    expiresAt: timestamp("expires_at"), // optional expiration
    active: boolean("active").default(true),
    createdBy: uuid("created_by").references(() => users.id), // link to creator/admin
    createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    discountId: uuid("discount_id").references(() => discountCodes.id),
    affiliateId: uuid("affiliate_id").references(() => affiliates.id),
    totalAmount: integer("total_amount").notNull(),
    finalAmount: integer("final_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const plans = pgTable("plans", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    billingInterval: billingIntervalEnum("billing_interval").notNull()
})

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id").references(() => groups.id, { onDelete: "cascade" }).notNull(),
    planId: uuid("plan_id").references(() => plans.id, { onDelete: "cascade" }).notNull(),
    startDate: timestamp("start_date").defaultNow().notNull(),
    endDate: timestamp("end_date").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    discountId: uuid("discount_id").references(() => discountCodes.id),
    amount: integer("amount").notNull(),
    paymentReference: text("payment_reference").notNull(),
    status: subscriptionStatusEnum("status").notNull().default("trial"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const groupSubscriptions = pgTable("group_subscription", {
    id: uuid("id").defaultRandom().primaryKey(),
    // The user who is attempting to join/subscribe
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    // The group they are subscribing to
    groupId: uuid("group_id")
        .references(() => groups.id, { onDelete: "cascade" })
        .notNull(),
    // The amount they reported paying (use 'real' to match groups.price)
    paidAmount: real("paid_amount").notNull(),
    // The receipt number the user inputs for verification
    telebirrReceiptNumber: text("telebirr_receipt_number").notNull(),
    // Status: e.g., 'trial' (pending verification), 'active' (verified/member)
    status: subscriptionStatusEnum("status").notNull().default("trial"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const courseSubscriptions = pgTable("course_subscription", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    groupId: uuid("group_id")
        .references(() => groups.id, { onDelete: "cascade" })
        .notNull(),
    // FIXED: Changed reference from groups.id to courses.id
    courseId: uuid("course_id")
        .references(() => courses.id, { onDelete: "cascade" })
        .notNull(),
    paidAmount: real("paid_amount").notNull(),
    telebirrReceiptNumber: text("telebirr_receipt_number").notNull(),
    status: subscriptionStatusEnum("status").notNull().default("trial"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plans
export type Plan = InferSelectModel<typeof plans>;
export type NewPlan = InferInsertModel<typeof plans>;

// Subscriptions
export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;

// Discount Codes
export type DiscountCode = InferSelectModel<typeof discountCodes>;
export type NewDiscountCode = InferInsertModel<typeof discountCodes>;

// Group subscription 
export type GroupSubscription = InferSelectModel<typeof groupSubscriptions>;
export type NewGroupSubscription = InferInsertModel<typeof groupSubscriptions>;

export const PlanSchema = createSelectSchema(plans)
export const SubscriptionSchema = createSelectSchema(subscriptions)
export const GroupSubscriptionSchema = createSelectSchema(groupSubscriptions)
export const CourseSubscriptionSchema = createSelectSchema(courseSubscriptions)
export const DiscountCodeScema = createSelectSchema(discountCodes)
