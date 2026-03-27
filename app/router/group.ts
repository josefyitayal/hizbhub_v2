import db from "@/db/drizzle";
import { base } from "../middlewares/base";
import { z } from "zod"
import { and, arrayOverlaps, desc, eq, lt, or, SQL, sql } from "drizzle-orm";
import { ChannelSchema, Group, groups, GroupSchema, members, MemberSchema, subscriptions, SubscriptionSchema } from "@/db/schemas";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { revalidatePath } from "next/cache";

export const detailGroupSchema = GroupSchema.extend({
    channels: z.array(ChannelSchema),
    isMember: z.boolean(),
    memberCount: z.string(),
})

const getGroupWithSlugOutputSchema = z.object({
    group: detailGroupSchema,
    subscription: SubscriptionSchema,
    isUserOwned: z.boolean()
})

export const getGroupWithSlug = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/group/get/slug",
        summary: "getting group data with group slug",
        tags: ["group"]
    })
    .input(z.object({ groupSlug: z.string() }))
    .output(getGroupWithSlugOutputSchema)
    .handler(async ({ input, context, errors }) => {
        const dbGroup = await db.query.groups.findFirst({
            where: eq(groups.slug, input.groupSlug),
            with: {
                channels: {
                    orderBy: (c, { asc }) => [asc(c.createdAt)],
                },
            },
            extras: {
                memberCount: sql<string>`(
                    SELECT count(*) FROM "members" 
                    WHERE "members"."group_id" = "groups"."id"
                )`.mapWith(String).as('memberCount'),
                isMember: sql<boolean>`EXISTS (
                    SELECT 1 FROM "members" 
                    WHERE "members"."group_id" = "groups"."id" 
                    AND "members"."user_id" = ${context.user.id}
                )`.mapWith(Boolean).as('isMember'),
            }
        });

        if (!dbGroup) {
            throw errors.NOT_FOUND()
        }

        const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.groupId, dbGroup.id))
        if (!subscription) throw errors.NOT_FOUND()

        const data = {
            group: dbGroup,
            subscription: subscription,
            isUserOwned: dbGroup.ownerId === context.user.id
        }
        return data
    })

export const userGroupInfo = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/group/userInfo",
        summary: "list user join and owned groups",
        tags: ["group"]
    })
    .input(z.void())
    .output(z.object({ joinedGroups: z.array(GroupSchema), ownedGroups: z.array(GroupSchema) }))
    .handler(async ({ context }) => {
        const userId = context.user.id;

        // Fetch all groups associated with the user (joined + owned) in one go
        const results = await db
            .select({
                group: groups,
                isOwner: sql<boolean>`${groups.ownerId} = ${userId}`
            })
            .from(groups)
            // Join members to find groups they joined
            .leftJoin(members, eq(members.groupId, groups.id))
            // Filter: Either they own the group OR they are a member
            .where(
                sql`${groups.ownerId} = ${userId} OR ${members.userId} = ${userId}`
            )
            .groupBy(groups.id);

        // One-pass reduction into two arrays
        return results.reduce(
            (acc, row) => {
                if (row.isOwner) {
                    acc.ownedGroups.push(row.group);
                } else {
                    acc.joinedGroups.push(row.group);
                }
                return acc;
            },
            { joinedGroups: [] as Group[], ownedGroups: [] as Group[] }
        );
    })


export const joinGroupInput = z.object({ groupId: z.string(), groupSlug: z.string() })

export const joinGroup = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/group",
        summary: "join group",
        tags: ["group"]
    })
    .input(joinGroupInput)
    .output(MemberSchema)
    .handler(async ({ context, input, errors }) => {
        const [member] = await db.insert(members).values({
            userId: context.user.id,
            groupId: input.groupId,
        }).returning()

        if (!member) throw errors.NOT_FOUND()

        revalidatePath(`/g/${input.groupSlug}`)
        return member
    })



export const leaveGroup = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/group",
        summary: "join group",
        tags: ["group"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(MemberSchema)
    .handler(async ({ context, input, errors }) => {
        const [member] = await db
            .delete(members)
            .where(and(
                eq(members.groupId, input.groupId),
                eq(members.userId, context.user.id))
            ).returning()

        if (!member) throw errors.NOT_FOUND()

        return member
    })

export const getAllGroupsOutput = z.array(
    GroupSchema.extend({
        memberCount: z.number(),
    })
)

export const listGroupInDiscover = base
    .route({
        method: "GET",
        path: "/group/discover",
        summary: "list all groups",
        tags: ["group"],
    })
    .input(
        z.object({
            search: z.string().optional(),
            category: z.string().optional(),
            tags: z.string().optional(),
            cursor: z.string().optional(),   // ISO timestamp
            limit: z.number().optional().default(10),
            top: z.boolean().optional().default(false),
        })
    )
    .output(
        z.object({
            items: getAllGroupsOutput,
            nextCursor: z.string().nullable(),
        })
    )
    .handler(async ({ input }) => {
        const { search, category, tags, cursor, limit, top } = input;

        const whereClauses: SQL[] = [eq(groups.private, false)];

        // 1. Optimized Category Filter (Uses GIN index if you have one)
        if (category) {
            whereClauses.push(sql`${groups.category} @> array[${category}]::text[]`);
        }

        // 2. High-Performance Search (Title + Description + Tags)
        if (search) {
            whereClauses.push(
                or(
                    // 1. Check the indexed text (Title/Description)
                    sql`${groups.titleSearch} @@ websearch_to_tsquery('english', ${search})`,

                    // 2. Check the Tags array for an exact match
                    // This is very fast if you have a GIN index on tags
                    sql`${search} = ANY(${groups.tags})`,

                    // 3. Optional: Partial tag match (e.g., searching "yos" finds "yosef")
                    // Remove this if you only want exact tag matches for better speed
                    sql`array_to_string(${groups.tags}, ' ') ILIKE ${'%' + search + '%'}`
                ) as SQL
            );
        }

        if (tags) whereClauses.push(arrayOverlaps(groups.tags, [tags]));

        // 3. Dynamic Cursor Pagination
        if (cursor) {
            if (top) {
                // If sorting by members, the cursor should be the member count
                // For an MVP, we'll stick to a simple date-based cursor for now 
                // unless you want to implement complex keyset pagination.
                whereClauses.push(lt(groups.createdAt, new Date(cursor)));
            } else {
                whereClauses.push(lt(groups.createdAt, new Date(cursor)));
            }
        }

        try {
            const result = await db
                .select({
                    group: groups,
                    // Using a subquery for memberCount is often faster than a Join + GroupBy 
                    // for "Discover" pages with many filters.
                    memberCount: sql<number>`(SELECT count(*) FROM ${members} WHERE ${members.groupId} = ${groups.id})`.mapWith(Number),
                })
                .from(groups)
                .where(and(...whereClauses))
                // Inside your handler
                .orderBy(
                    // If searching, maybe rank by relevance? Otherwise, use createdAt for stability
                    search ? sql`ts_rank(${groups.titleSearch}, websearch_to_tsquery('english', ${search})) DESC`
                        : desc(groups.createdAt)
                )
                // .orderBy(
                //     top ? desc(countSql) : desc(groups.createdAt)
                // )
                .limit(limit + 1);

            // handle pagination
            let nextCursor: string | null = null;
            let items = result;

            if (result.length > limit) {
                const last = result.pop()!;
                nextCursor = last.group.createdAt.toISOString();
                items = result;
            }

            const final = items.map(({ group, memberCount }) => ({
                ...group,
                memberCount,
            }));

            return { items: final, nextCursor };
        } catch (error) {
            console.error("DATABASE_ERROR:", error); // This will show in your terminal
            throw error;
        }
    });
