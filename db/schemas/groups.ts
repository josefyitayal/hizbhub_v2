import {
    pgTable,
    text,
    boolean,
    timestamp,
    uuid,
    real,
    customType
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, sql, SQL } from "drizzle-orm";
import { createSelectSchema } from 'drizzle-zod';
import { users } from "./users";


export const tsvector = customType<{
    data: string;
}>({
    dataType() {
        return `tsvector`;
    },
});

export const groups = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    titleSearch: tsvector('title_search').notNull().generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${groups.title})`),
    description: text("description"),
    ownerId: uuid("owner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    longDescription: text("long_description"),
    icon: text("icon"),
    bannerImage: text("banner_image"),
    price: real("price"),
    pricingEnabledAt: timestamp("pricing_enabled_at"),
    phoneNumber: text("phone_number"),
    category: text("category").array(),
    tags: text("tags").array(), // assuming tags[] array
    private: boolean("private").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Groups
export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export const GroupSchema = createSelectSchema(groups)
