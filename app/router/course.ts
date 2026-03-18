import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { desc, eq } from "drizzle-orm";
import { courses, CourseSchema, CourseSubscriptionSchema, folders, FolderSchema, groups, PageComplateSchema, pages, PageSchema } from "@/db/schemas";
import { createCourseFormSchema } from "@/zod-schema/createCourseZodSchema";

export const listCourses = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/course/list",
        summary: "list courses",
        tags: ["course"]
    })
    .input(z.object({ groupSlug: z.string() }))
    .output(
        z.array(
            CourseSchema.extend({
                folders: z.array(FolderSchema),
                subscriptions: z.array(CourseSubscriptionSchema)
            })
        )
    )
    .handler(async ({ context, input, errors }) => {
        const [dbGroup] = await db.select().from(groups).where(eq(groups.slug, input.groupSlug))
        if (!dbGroup) throw errors.NOT_FOUND()

        const dbCourses = await db.query.courses.findMany({
            where: eq(courses.groupId, dbGroup.id),
            with: {
                folders: true,
                subscriptions: {
                    // CRITICAL: Only return the subscription for the person asking
                    where: (subs, { eq }) => eq(subs.userId, context.user.id)
                },
            },
            orderBy: [desc(courses.createdAt)]
        })

        if (!dbCourses) throw errors.NOT_FOUND()

        return dbCourses
    })


export const createCourse = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/course/create",
        summary: "create courses",
        tags: ["course"]
    })
    .input(z.object({ groupId: z.string(), data: createCourseFormSchema }))
    .output(CourseSchema)
    .handler(async ({ input, errors }) => {
        const [dbCourse] = await db.insert(courses).values({
            name: input.data.name,
            description: input.data.description,
            published: input.data.published,
            coverImage: input.data.coverImage,
            price: input.data.price,
            groupId: input.groupId
        }).returning()

        if (!dbCourse) throw errors.NOT_FOUND()
        const [dbFolder] = await db.insert(folders).values({
            name: "New Folder",
            courseId: dbCourse.id
        }).returning()

        await db.insert(pages).values({
            name: "Page One",
            folderId: dbFolder.id,
            content: "Page One"
        })

        return dbCourse
    })


export const updateCourse = base
    .use(requiredAuthMiddleware)
    .route({
        method: "PUT",
        path: "/course/edit",
        summary: "update course",
        tags: ["course"]
    })
    .input(z.object({ courseId: z.string(), data: createCourseFormSchema }))
    .output(CourseSchema)
    .handler(async ({ input, context, errors }) => {
        const [courseWithGroup] = await db
            .select({
                course: courses,
                group: groups,
            })
            .from(courses)
            .innerJoin(groups, eq(courses.groupId, groups.id))
            .where(eq(courses.id, input.courseId))

        if (!courseWithGroup) throw errors.NOT_FOUND()
        if (courseWithGroup.group.ownerId !== context.user.id) throw errors.FORBIDDEN()

        const [updatedCourse] = await db
            .update(courses)
            .set({
                name: input.data.name,
                description: input.data.description,
                published: input.data.published,
                coverImage: input.data.coverImage,
                price: input.data.price,
                updatedAt: new Date(),
            })
            .where(eq(courses.id, input.courseId))
            .returning()

        if (!updatedCourse) throw errors.NOT_FOUND()

        return updatedCourse
    })


export const deleteCourse = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/course/delete",
        summary: "delete course",
        tags: ["course"]
    })
    .input(z.object({ courseId: z.string() }))
    .output(CourseSchema)
    .handler(async ({ input, context, errors }) => {
        const [courseWithGroup] = await db
            .select({
                course: courses,
                group: groups,
            })
            .from(courses)
            .innerJoin(groups, eq(courses.groupId, groups.id))
            .where(eq(courses.id, input.courseId))

        if (!courseWithGroup) throw errors.NOT_FOUND()
        if (courseWithGroup.group.ownerId !== context.user.id) throw errors.FORBIDDEN()

        const [deletedCourse] = await db
            .delete(courses)
            .where(eq(courses.id, input.courseId))
            .returning()

        if (!deletedCourse) throw errors.NOT_FOUND()

        return deletedCourse
    })


export const getCourseByIdOutputSchema = CourseSchema.extend({
    folders: z.array(
        FolderSchema.extend({
            pages: z.array(PageSchema.extend({
                completions: z.array(PageComplateSchema)
            })),
        })
    ),
})

export const getCourseById = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/course/[courseId]",
        summary: "get courses by id",
        tags: ["course"]
    })
    .input(z.object({ courseId: z.string() }))
    .output(getCourseByIdOutputSchema)
    .handler(async ({ input, errors, context }) => {
        const dbCourse = await db.query.courses.findFirst({
            where: eq(courses.id, input.courseId),
            // Order the main course result
            orderBy: [desc(courses.createdAt)],
            with: {
                folders: {
                    // Order folders within the course
                    orderBy: (folders, { asc }) => [asc(folders.createdAt)],
                    with: {
                        pages: {
                            // Order pages within each folder
                            orderBy: (pages, { asc }) => [asc(pages.createdAt)],
                            with: {
                                completions: {
                                    where: (pageComplate, { eq }) => eq(pageComplate.userId, context.user.id),
                                },
                            }
                        },
                    },
                },
            },
        });

        if (!dbCourse) throw errors.NOT_FOUND()

        return dbCourse
    })


