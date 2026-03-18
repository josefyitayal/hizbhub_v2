import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { pageComplate, PageComplateSchema, pages, PageSchema } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

const PageWithDetailsSchema = PageSchema.extend({
    completions: z.array(PageComplateSchema)
});

// --- ADD PAGE ---
export const addPage = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/page/add",
        summary: "Add a new page to a folder",
        tags: ["course", "page"]
    })
    .input(z.object({ folderId: z.string(), name: z.string().min(1), content: z.string() }))
    .output(PageWithDetailsSchema)
    .handler(async ({ input, errors }) => {
        const [newPage] = await db.insert(pages).values({
            folderId: input.folderId,
            name: input.name,
            content: input.content,
        }).returning();

        if (!newPage) throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to create page' });

        const pageWithDetails = await db.query.pages.findFirst({
            where: (pages, { eq }) => eq(pages.id, newPage.id),
            with: {
                completions: true,
            },
        });

        if (!pageWithDetails) {
            throw errors.NOT_FOUND({ message: "Failed to retrieve the created page." });
        }

        return pageWithDetails;
    });


// --- DELETE PAGE ---
export const deletePage = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/page/delete/:id",
        summary: "Delete a page",
        tags: ["course", "page"]
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ id: z.string() }))
    .handler(async ({ input, errors }) => {
        const result = await db.delete(pages).where(eq(pages.id, input.id)).returning({
            id: pages.id
        });

        if (result.length === 0) throw errors.NOT_FOUND({ message: 'Page not found' });

        return { id: input.id };
    });


export const renamePage = base
    .use(requiredAuthMiddleware)
    .route({
        method: "PATCH",
        path: "/page/rename/:id",
        summary: "Rename a course page",
        tags: ["course", "page"]
    })
    .input(z.object({
        id: z.string(), // Page ID to update
        name: z.string().min(1, "Page name cannot be empty"),
        folderId: z.string(),
    }))
    .output(z.object({ id: z.string(), name: z.string() }))
    .handler(async ({ input, errors }) => {
        const [updatedPage] = await db.update(pages)
            .set({
                name: input.name,
                updatedAt: new Date(), // Update timestamp
            })
            .where(eq(pages.id, input.id))
            .returning({
                id: pages.id,
                name: pages.name,
            });

        if (!updatedPage) {
            throw errors.NOT_FOUND({ message: 'Page not found or update failed.' });
        }

        return updatedPage;
    });

export const completePage = base
    .use(requiredAuthMiddleware)
    .route({
        method: "PATCH",
        path: "/page/complete",
        summary: "change page IsComplete value",
        tags: ["course", "page"]
    })
    .input(z.object({
        pageId: z.string(),
        isComplete: z.boolean()
    }))
    .output(PageComplateSchema)
    .handler(async ({ input, errors, context }) => {
        const [result] = await db
            .insert(pageComplate)
            .values({
                // The values we try to insert first time
                pageId: input.pageId,
                userId: context.user.id,
                isCompleted: true, // Set to true on the very first creation
            })
            .onConflictDoUpdate({
                // Use the name of the unique constraint column(s)
                target: [pageComplate.pageId, pageComplate.userId],
                set: {
                    // If a conflict occurs, update the isCompleted field by toggling the current value
                    isCompleted: input.isComplete,
                    updatedAt: new Date(),
                },
            })
            .returning();

        if (!result) {
            throw errors.NOT_FOUND()
        }

        return result
    })


export const savePage = base
    .use(requiredAuthMiddleware)
    .route({
        method: "PATCH",
        path: "/page/save",
        summary: "save page",
        tags: ["course", "page"]
    })
    .input(z.object({
        pageId: z.string(),
        folderId: z.string(),
        content: z.string().nullable()
    }))
    .output(PageSchema)
    .handler(async ({ input, errors }) => {
        const [dbPage] = await db.update(pages)
            .set({
                content: input.content,
            })
            .where(and(
                eq(pages.id, input.pageId),
                eq(pages.folderId, input.folderId)
            ))
            .returning()
        if (!dbPage) {
            throw errors.NOT_FOUND({ message: "Page not found or saving faild" })
        }

        return dbPage
    })
