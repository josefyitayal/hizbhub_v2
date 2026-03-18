"use server"

import db from "@/db/drizzle";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function updateProfilePicture(userId: string, newUrl: string | null) {
    // This runs safely on the server
    const [updatedUser] = await db.update(users)
        .set({ profilePicture: newUrl })
        .where(eq(users.clerkId, userId))
        .returning();

}
