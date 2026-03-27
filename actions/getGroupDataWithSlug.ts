"use server"

import db from "@/db/drizzle";
import { sql, eq } from "drizzle-orm"
import { groups, subscriptions, users } from "@/db/schemas";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";

export const getGroupDataWithSlug = async (groupSlug: string) => {
    const catchFetcher = unstable_cache(
        async () => {
            try {
                const { userId: clerkUserId } = await auth()
                if (!clerkUserId) {
                    return redirect("/login")
                }

                const [dbUser] = await db.select().from(users).where(eq(users.clerkId, clerkUserId))

                const dbGroup = await db.query.groups.findFirst({
                    where: eq(groups.slug, groupSlug),
                    with: {
                        channels: {
                            orderBy: (c, { asc }) => [asc(c.createdAt)],
                        },
                    },
                    extras: {
                        memberCount: sql<number>`(
                    SELECT count(*) FROM "members" 
                    WHERE "members"."group_id" = "groups"."id"
                )`.mapWith(Number).as('member_count'),
                        isMember: sql<boolean>`EXISTS (
                    SELECT 1 FROM "members" 
                    WHERE "members"."group_id" = "groups"."id" 
                    AND "members"."user_id" = ${dbUser.id}
                )`.mapWith(Boolean).as('is_member'),
                    }
                });

                if (!dbGroup) {
                    return { success: false, data: null }
                }

                const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.groupId, dbGroup.id))
                if (!subscription) return { success: false, data: null }

                const data = {
                    group: dbGroup,
                    subscription: subscription,
                    isUserOwned: dbGroup.ownerId === dbUser.id
                }
                return { success: true, data: data }
            } catch (error) {
                throw new Error("something went wrong")
            }
        },
        [`group-${groupSlug}`],
        {
            tags: ['groups', `group-slug-${groupSlug}`], // Tags for revalidation
            revalidate: 3600, // Optional: auto-revalidate every hour
        }
    )
    return await catchFetcher()
}
