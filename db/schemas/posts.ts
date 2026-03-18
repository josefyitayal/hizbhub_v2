import {
    pgTable,
    text,
    boolean,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from 'drizzle-zod';
import { users } from "./users";
import { groups } from "./groups";
import { postPermissionEnum, replayPermissionEnum } from "./enums";

export const channels = pgTable("channels", {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
        .references(() => groups.id, { onDelete: "cascade" })
        .notNull(),
    name: text("name").notNull(),
    postPermission: postPermissionEnum("post_permission").notNull().default("all"),
    replayPermission: replayPermissionEnum("replay_permission").notNull().default("all"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    groupId: uuid("group_id")
        .references(() => groups.id, { onDelete: "cascade" })
        .notNull(),
    channelId: uuid("channel_id")
        .references(() => channels.id, { onDelete: "cascade" }),
    isPinned: boolean("is_pinned").default(false).notNull(), // Add this!
    pinnedAt: timestamp("pinned_at"),
    content: text("content").notNull(),
    attachment: text("attachment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    postId: uuid("post_id")
        .references(() => posts.id, { onDelete: "cascade" })
        .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    postId: uuid("post_id")
        .references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id")
        .references(() => comments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const members = pgTable("members", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    groupId: uuid("group_id")
        .references(() => groups.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Channels
export type Channel = InferSelectModel<typeof channels>;
export type NewChannel = InferInsertModel<typeof channels>;

// Posts
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export type Like = InferSelectModel<typeof likes>;
export type NewLike = InferInsertModel<typeof likes>;

// Comments
export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

// Members
export type Member = InferSelectModel<typeof members>;
export type NewMember = InferInsertModel<typeof members>;


export const LikeSchema = createSelectSchema(likes);
export const CommentSchema = createSelectSchema(comments);
export const PostSchema = createSelectSchema(posts);
export const ChannelSchema = createSelectSchema(channels);
export const MemberSchema = createSelectSchema(members)
