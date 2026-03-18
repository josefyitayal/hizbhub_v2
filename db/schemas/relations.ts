import { relations } from "drizzle-orm";
import { users } from "./users";
import { posts, comments, likes, channels, members } from "./posts";
import { groups } from "./groups";
import { groupSubscriptions, courseSubscriptions, discountCodes, orders } from "./payments";
import { affiliateCommission, affiliates, linkClicks } from "./affiliates";
import { courses, folders, pages, pageComplate } from "./courses";


export const usersRelations = relations(users, ({ many, one }) => ({
    posts: many(posts),
    comments: many(comments),
    likes: many(likes),
    ownedGroups: many(groups),
    groupSubscriptions: many(groupSubscriptions),
    referrer: one(users, {
        fields: [users.referredBy],
        references: [users.id],
        relationName: "referrals",
    }),
}));

export const groupsRelations = relations(groups, ({ many, one }) => ({
    owner: one(users, {
        fields: [groups.ownerId],
        references: [users.id],
    }),
    channels: many(channels),
    posts: many(posts),
    members: many(members),
    courses: many(courses), // 👈 add this
    groupSubscriptions: many(groupSubscriptions),
    courseSubscriptions: many(courseSubscriptions)
}));

export const groupSubscriptionsRelations = relations(groupSubscriptions, ({ one }) => ({
    user: one(users, {
        fields: [groupSubscriptions.userId],
        references: [users.id],
    }),
    group: one(groups, {
        fields: [groupSubscriptions.groupId],
        references: [groups.id],
    }),
}));

export const courseSubscriptionsRelations = relations(courseSubscriptions, ({ one }) => ({
    user: one(users, {
        fields: [courseSubscriptions.userId],
        references: [users.id],
    }),
    group: one(groups, {
        fields: [courseSubscriptions.groupId],
        references: [groups.id],
    }),
    // FIXED: Reference 'courses' table, not 'groups'
    course: one(courses, {
        fields: [courseSubscriptions.courseId],
        references: [courses.id]
    })
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
    user: one(users, {
        fields: [affiliates.userId],
        references: [users.id],
    }),
    clicks: many(linkClicks),
    commissions: many(affiliateCommission),
    discountCodes: many(discountCodes),
}));

export const discountCodesRelations = relations(discountCodes, ({ many, one }) => ({
    affiliate: one(affiliates, {
        fields: [discountCodes.affiliateId],
        references: [affiliates.id],
    }),
    // Link to orders so you can see which orders used this code
    orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    discountCode: one(discountCodes, {
        fields: [orders.discountId],
        references: [discountCodes.id],
    }),
    affiliates: one(affiliates, {
        fields: [orders.affiliateId],
        references: [affiliates.id]
    })
}));

export const affiliateCommissionsRelations = relations(affiliateCommission, ({ one }) => ({
    affiliate: one(affiliates, { fields: [affiliateCommission.affiliateId], references: [affiliates.id] }),
    buyerUser: one(users, { fields: [affiliateCommission.buyerUserId], references: [users.id] }),
    group: one(groups, { fields: [affiliateCommission.groupId], references: [groups.id] })
}));

export const coursesRelations = relations(courses, ({ many, one }) => ({
    folders: many(folders),
    // ADDED: Link back to subscriptions
    subscriptions: many(courseSubscriptions),
    group: one(groups, {
        fields: [courses.groupId],
        references: [groups.id]
    })
}));

export const channelsRelations = relations(channels, ({ many, one }) => ({
    group: one(groups, {
        fields: [channels.groupId],
        references: [groups.id],
    }),
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    group: one(groups, {
        fields: [posts.groupId],
        references: [groups.id],
    }),
    channel: one(channels, {
        fields: [posts.channelId],
        references: [channels.id],
    }),
    likes: many(likes),
    comments: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [likes.postId],
        references: [posts.id],
    }),
    comment: one(comments, {
        fields: [likes.commentId],
        references: [comments.id],
    }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    likes: many(likes),
}));

export const membersRelations = relations(members, ({ one }) => ({
    user: one(users, {
        fields: [members.userId],
        references: [users.id],
    }),
    group: one(groups, {
        fields: [members.groupId],
        references: [groups.id],
    }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
    course: one(courses, {
        fields: [folders.courseId],
        references: [courses.id],
    }),
    pages: many(pages),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
    folder: one(folders, {
        fields: [pages.folderId],
        references: [folders.id],
    }),
    completions: many(pageComplate),
}));

export const pageComplateRelations = relations(pageComplate, ({ one }) => ({
    page: one(pages, {
        fields: [pageComplate.pageId],
        references: [pages.id],
    }),
}));
