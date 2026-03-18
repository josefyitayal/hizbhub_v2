import { creatorCodes, CreatorCodeSchema } from "@/db/schemas";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { z } from "zod"
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";

export const checkCreatorCode = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/createCode/check",
        summary: "checking creator code",
        tags: ["checkCreatorCode"]
    })
    .input(z.object({ code: z.string() }))
    .output(CreatorCodeSchema)
    .handler(async ({ input, errors }) => {
        const [dbCreatorCode] = await db.select().from(creatorCodes).where(eq(creatorCodes.code, input.code))

        if (!dbCreatorCode) {
            throw errors.NOT_FOUND()
        }

        return dbCreatorCode
    })
