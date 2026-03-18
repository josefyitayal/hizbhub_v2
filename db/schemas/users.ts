import {
    pgTable,
    text,
    timestamp,
    uuid,
    AnyPgColumn
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from 'drizzle-zod';

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: text("clerk_id").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    userName: text("user_name").notNull().unique(),
    email: text("email").notNull(),
    bio: text("bio"),
    profilePicture: text("profile_picture"),
    referredBy: uuid("referred_by").references((): AnyPgColumn => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

//user
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// zod schemas
export const UserSchema = createSelectSchema(users);