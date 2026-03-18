import z from "zod";

export const postPermissionEnum = z.enum(["all", "admin"])
export const replayPermissionEnum = z.enum(["all", "admin"])

export const createChannelFormSchema = z.object({
    name: z.string().min(2, "Group name at least must be 2 character").max(18, "Group name at most be 18 character"),
    postPermission: postPermissionEnum,
    replayPermission: replayPermissionEnum,
})

export type createChannelFormTypes = z.infer<typeof createChannelFormSchema>;
