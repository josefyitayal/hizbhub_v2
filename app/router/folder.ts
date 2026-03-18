import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { folders, pages } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const addFolder = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/folder/add",
        summary: "Add a new folder to a course",
        tags: ["course", "folder"]
    })
    .input(z.object({ courseId: z.string(), name: z.string().min(1) }))
    .output(z.object({
        id: z.string(),
        name: z.string(),
        courseId: z.string().nullable()
    }))
    .handler(async ({ input, errors }) => {
        const [newFolder] = await db.insert(folders).values({
            courseId: input.courseId,
            name: input.name,
        }).returning({
            id: folders.id,
            name: folders.name,
            courseId: folders.courseId,
        });

        if (!newFolder) throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to create folder' });

        // Optional: Create a default page inside the new folder
        await db.insert(pages).values({
            name: "Introduction",
            folderId: newFolder.id,
            content: "Welcome to this new folder!",
        });

        return newFolder;
    });


// --- DELETE FOLDER ---
export const deleteFolder = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/folder/delete/:id",
        summary: "Delete a folder",
        tags: ["course", "folder"]
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ id: z.string() }))
    .handler(async ({ input, errors }) => {
        // Drizzle's onDelete: "cascade" in your schema will automatically delete pages.
        const result = await db.delete(folders).where(eq(folders.id, input.id)).returning({
            id: folders.id
        });

        if (result.length === 0) throw errors.NOT_FOUND({ message: 'Folder not found' });

        return { id: input.id };
    });

export const renameFolder = base
    .use(requiredAuthMiddleware)
    .route({
        method: "PATCH",
        path: "/folder/rename/:id",
        summary: "Rename a course folder",
        tags: ["course", "folder"]
    })
    .input(z.object({
        id: z.string(), // Folder ID to update
        name: z.string().min(1, "Folder name cannot be empty")
    }))
    // Outputting the updated name and ID is sufficient for the client's optimistic rollback logic
    .output(z.object({ id: z.string(), name: z.string() }))
    .handler(async ({ input, errors }) => {
        const [updatedFolder] = await db.update(folders)
            .set({
                name: input.name,
                updatedAt: new Date(), // Update timestamp
            })
            .where(eq(folders.id, input.id))
            .returning({
                id: folders.id,
                name: folders.name,
            });

        if (!updatedFolder) {
            throw errors.NOT_FOUND({ message: 'Folder not found or update failed.' });
        }

        return updatedFolder;
    });
