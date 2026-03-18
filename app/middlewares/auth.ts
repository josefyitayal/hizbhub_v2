import { auth, User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { base } from "./base";
import { type User as dbUser, users } from "@/db/schemas";

export const requiredAuthMiddleware = base
    .$context<{
        session?: { clerkUser?: User | null, user?: dbUser }
    }>()
    .middleware(async ({ context, next }) => {
        const session = context.session ?? (await getSession())
        if (!session.user) {
            return redirect("/sign-in")
        }

        return next({
            context: { user: session.user }
        })
    })


const getSession = async () => {
    const { userId } = await auth()

    if (!userId) {
        return { user: null }
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))

    return {
        user: user,
    }
}
