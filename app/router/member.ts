import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { groups, members, MemberSchema, UserSchema } from "@/db/schemas";
import { clerkClient } from "@clerk/nextjs/server";

export const listAllMembers = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/member",
        summary: "get all members in group",
        tags: ['member']
    })
    .input(z.object({ groupSlug: z.string() }))
    .output(z.array(MemberSchema.extend({ user: UserSchema })))
    .handler(async ({ input, errors }) => {
        const [dbGroup] = await db.select().from(groups).where(eq(groups.slug, input.groupSlug))
        if (!dbGroup) {
            throw errors.NOT_FOUND({
                message: "Group not found"
            });
        }
        // const dbMembers = await db.select().from(members).where(eq(members.groupId, dbGroup.id))
        const dbMembers = await db.query.members.findMany({
            where: eq(members.groupId, dbGroup.id),
            with: {
                user: true
            }
        })

        if (!dbMembers) throw errors.NOT_FOUND()

        const clerkIds = [...new Set(dbMembers.map(m => m.user?.clerkId).filter(Boolean) as string[])];

        // 2. Fetch all these users from Clerk in ONE request
        const client = await clerkClient();
        const { data: clerkUsers } = await client.users.getUserList({
            userId: clerkIds,
            limit: 100, // Clerk limit
        });

        // 3. Create a lookup map for O(1) access inside the .map() loop
        const clerkUserMap = new Map(clerkUsers.map(u => [u.id, u.imageUrl]));

        const updatedMembers = dbMembers.map(member => ({
            ...member,
            user: {
                ...member.user,
                profilePicture: clerkUserMap.get(member.user.clerkId) ?? member.user.profilePicture,
            }
        }));

        return updatedMembers
    })
