import z from "zod";

export const createCourseFormSchema = z.object({
    name: z.string().min(3, "Course name must be at least 3 characters").max(70, "Course name must at mose 70 characters"),
    description: z.string().min(10, "Course description must be at least 10 characters").max(200, "Course name must at mose 50 characters"),
    published: z.boolean(),
    coverImage: z.string(),
    price: z.number(),
})

export type createCourseFormSchemaTypes = z.infer<typeof createCourseFormSchema>;
