import { onboardingSchema } from "@/zod-schema/onboardingZodSchema";
import { base } from "../middlewares/base";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { users, UserSchema } from "@/db/schemas";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { cookies } from "next/headers";

export const createUser = base
    .route({
        method: "POST",
        path: "/user",
        summary: "create user",
        tags: ["user"]
    })
    .input(onboardingSchema)
    .output(UserSchema)
    .handler(async ({ input, errors }) => {
        const { userId } = await auth();
        if (!userId) throw errors.UNAUTHORIZED()

        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId!)

        const cookieStore = await cookies();

        const cookie = cookieStore.get("hizb_affiliate");
        // All properties become optional: slug?, id?, ownerId?
        let userReferredBy: Partial<{ slug: string, id: string, ownerId: string, autoCode: string | null }> = {};

        if (cookie?.value) {
            try {
                userReferredBy = JSON.parse(cookie.value);
            } catch (e) {
                console.error("Failed to parse affiliate cookie:", e);
                // Fallback to empty object if JSON is malformed
                userReferredBy = {};
            }
        }

        const referrerId = userReferredBy.ownerId || null;

        const [dbUser] = await db.insert(users).values({
            clerkId: clerkUser.id,
            firstName: input.firstName,
            lastName: input.lastName,
            email: clerkUser.emailAddresses[0].emailAddress,
            bio: input.bio,
            userName: input.userName,
            profilePicture: input.profilePicture,
            referredBy: referrerId
        }).returning()

        if (referrerId) {
            cookieStore.delete("hizb_affiliate");
        }

        if (!dbUser) throw errors.NOT_FOUND()

        try {
            await client.users.updateUser(userId!, {
                firstName: input.firstName,
                lastName: input.lastName,
                username: input.userName,
                publicMetadata: {
                    onboardingComplete: true,
                },
            });

            const response = await fetch(input.profilePicture);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.png", { type: blob.type });

            await client.users.updateUserProfileImage(userId!, {
                file: file
            });
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                // 1. Get the first error from Clerk's errors array
                const clerkError = err.errors[0];

                // 2. Check by parameter name (e.g., 'username')
                if (clerkError.meta?.paramName === "username") {
                    // You can check specific length/formatting rules
                    if (input.userName.length < 4) {
                        throw errors.BAD_REQUEST({ message: "Username must be at least 4 characters" });
                    }
                    else if (input.userName.length > 15) {
                        throw errors.BAD_REQUEST({ message: "Username must be at most 15 characters." })
                    }
                    // Or use Clerk's own descriptive message
                    throw errors.BAD_REQUEST({ message: clerkError.longMessage });
                }

                if (clerkError.meta?.paramName === "file") {
                    throw errors.BAD_REQUEST({ message: clerkError.longMessage });
                }

                // 3. Check by error code (e.g., username already taken)
                if (clerkError.code === "form_identifier_not_unique") {
                    throw errors.FORBIDDEN({ message: "This username is already taken" });
                }

            }

            // 4. Fallback for other non-Clerk errors
            throw errors.INTERNAL_SERVER_ERROR({ message: "Could not update user profile" });
        }

        return dbUser
    })
