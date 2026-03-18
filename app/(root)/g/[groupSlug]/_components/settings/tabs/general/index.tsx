"use client"

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { orpc } from "@/lib/orpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { MinimalTiptap } from "@/components/ui/minimal-tiptap"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import z from "zod"
import { ImageUploader } from "@/components/ImageUploader"
import { FormTagsInput } from "./TagsInput"
import { FormCategoryInput } from "./CategoryInput"
import { generalSettingsFormSchema } from "@/zod-schema/settingsZodSchema"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export type GeneralSettingsFormInput = z.input<typeof generalSettingsFormSchema>;
export type GeneralSettingsFormOutput = z.infer<typeof generalSettingsFormSchema>;

export function GeneralSetting({ groupId }: { groupId: string }) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: generalSettingData, isLoading } = useQuery(
        orpc.settings.generalSettings.list.queryOptions({ input: { groupId } })
    )

    const updateGeneralSettingsMutation = useMutation(orpc.settings.generalSettings.update.mutationOptions({
        onSuccess: (newGroup) => {
            toast.success("Setting saved")
            queryClient.invalidateQueries(orpc.group.list.slug.queryOptions({ input: { groupSlug: newGroup.slug } }))
            queryClient.invalidateQueries(orpc.group.list.userGroupInfo.queryOptions())
            router.push(`/g/${newGroup.slug}/#settings/general`)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<GeneralSettingsFormInput>({
        resolver: zodResolver(generalSettingsFormSchema),
        values: {
            title: generalSettingData?.title || "",
            description: generalSettingData?.description || "",
            longDescription: generalSettingData?.longDescription || "",
            icon: generalSettingData?.icon || "",
            bannerImage: generalSettingData?.bannerImage || "",
            category: generalSettingData?.category || [],
            tags: generalSettingData?.tags || [],
        },
    })

    const onSubmit: SubmitHandler<GeneralSettingsFormInput> = (data) => {
        const validatedData = generalSettingsFormSchema.parse(data)

        updateGeneralSettingsMutation.mutate({
            groupId,
            data: validatedData // This is now correctly typed as GeneralSettingsFormOutput
        })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full">
                <p className="text-lg text-start pl-3">General</p>
            </div>
            <Separator />
            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            console.log("FORM ERRORS ❌", errors)
                        })}
                        className="w-full px-10 flex flex-col gap-4"
                    >
                        <FieldGroup>
                            {/* Title */}
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-title">Name</FieldLabel>
                                        <Input
                                            id="form-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter title"
                                            className="w-full"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Description */}
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-description">Description</FieldLabel>
                                        <Textarea
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            id="form-description"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Short description"
                                            className="w-full"
                                        />
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Long Description */}
                            <Controller
                                name="longDescription"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-longDescription">Long Description</FieldLabel>
                                        <MinimalTiptap id="form-longDescription" aria-invalid={fieldState.invalid} content={field.value ?? ""} onChange={(e) => { field.onChange(e.toString()) }} placeholder="Detailed Description" />
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Icon */}
                            <Controller
                                name="icon"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-icon">Icon</FieldLabel>
                                        <ImageUploader value={field.value ?? null} onChange={field.onChange} />
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Banner Image */}
                            <Controller
                                name="bannerImage"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-bannerImage">Banner Image</FieldLabel>
                                        <ImageUploader value={field.value ?? null} onChange={field.onChange} />
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Category */}
                            <Controller
                                name="category"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-category">Category</FieldLabel>
                                        <FormCategoryInput value={field.value ?? []} onValueChange={field.onChange} />
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Tags */}
                            <Controller
                                name="tags"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-tags">Tags</FieldLabel>
                                        <FormTagsInput tags={field.value ?? []} onTagsChange={field.onChange} />
                                        <FieldDescription>Tags is usefull for search improvement.</FieldDescription>
                                        {fieldState.error && (
                                            <p className="text-sm text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button type="submit" onClick={() => console.log("from the button")} disabled={updateGeneralSettingsMutation.isPending}>
                            {updateGeneralSettingsMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    )
}
