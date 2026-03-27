import { z } from "zod"

export const createGroupFormSchema = z.object({
    name: z.string().min(2, "Group name at least must be 2 character").max(50, "Group name at most be 50 character"),
    description: z.string().min(10, "Group descripiton at least must be 10 character").max(200, "Group description at most be 200 character"),
    category: z.string().min(2, "You must select one Category"),
})

export type CreateGroupFormTypes = z.infer<typeof createGroupFormSchema>;
