import {
    pgTable,
    text,
    boolean,
    timestamp,
    uuid,
    real,
    unique
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from 'drizzle-zod';
import { users } from "./users";
import { groups } from "./groups";

export const courses = pgTable("courses", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    published: boolean("published").default(false),
    coverImage: text("cover_image"),
    price: real("price"),
    groupId: uuid("group_id")
        .references(() => groups.id, { onDelete: "cascade" }) // 👈 link to groups
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const folders = pgTable("folders", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    courseId: uuid("course_id")
        .references(() => courses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    folderId: uuid("folder_id")
        .references(() => folders.id, { onDelete: "cascade" })
        .notNull(),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pageComplate = pgTable("page_complate", {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("pageId")
        .references(() => pages.id, { onDelete: "cascade" })
        .notNull(),
    userId: uuid("userId")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    isCompleted: boolean("is_completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [ // Use an array here instead of an object
    unique("page_user_unique").on(table.pageId, table.userId),
]);

// Courses
export type Course = InferSelectModel<typeof courses>;
export type NewCourse = InferInsertModel<typeof courses>;

// Folders
export type Folder = InferSelectModel<typeof folders>;
export type NewFolder = InferInsertModel<typeof folders>;

// Pages
export type Page = InferSelectModel<typeof pages>;
export type NewPage = InferInsertModel<typeof pages>;

// page complate
export type PageComplate = InferSelectModel<typeof pageComplate>;
export type NewPageComplate = InferInsertModel<typeof pageComplate>;

export const CourseSchema = createSelectSchema(courses)
export const FolderSchema = createSelectSchema(folders)
export const PageSchema = createSelectSchema(pages)
export const PageComplateSchema = createSelectSchema(pageComplate)