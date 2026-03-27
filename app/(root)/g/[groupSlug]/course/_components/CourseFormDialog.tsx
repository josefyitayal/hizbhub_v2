"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { orpc } from "@/lib/orpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Course } from "@/db/schemas"
import { createCourseFormSchema, createCourseFormSchemaTypes } from "@/zod-schema/createCourseZodSchema"
import { useEffect, useMemo, useState, useCallback } from "react"
import { ImageUploader } from "@/components/ImageUploader"

type CourseDialogMode = "create" | "edit"

type CourseFormDialogProps = {
    mode: CourseDialogMode
    groupSlug: string
    groupId?: string
    trigger?: React.ReactNode
    course?: Course
    phoneNumber: string | null | undefined;
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: (course: Course) => void
}

const mapCourseToFormValues = (course?: Course | null): createCourseFormSchemaTypes => ({
    name: course?.name ?? formDefaults.name,
    description: course?.description ?? formDefaults.description,
    published: course?.published ?? formDefaults.published,
    coverImage: course?.coverImage ?? formDefaults.coverImage,
    price: course?.price ?? formDefaults.price,
})

const formDefaults: createCourseFormSchemaTypes = {
    name: "",
    description: "",
    published: true,
    coverImage: "",
    price: 0,
}

export function CourseFormDialog({
    mode,
    groupId,
    groupSlug,
    trigger,
    course,
    phoneNumber,
    open,
    onOpenChange,
    onSuccess,
}: CourseFormDialogProps) {
    const queryClient = useQueryClient()
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = open !== undefined
    const dialogOpen = isControlled ? open : internalOpen
    const initialValues = useMemo(() => mapCourseToFormValues(course), [course])

    const form = useForm<createCourseFormSchemaTypes>({
        resolver: zodResolver(createCourseFormSchema),
        defaultValues: initialValues,
    })

    useEffect(() => {
        form.reset(initialValues)
    }, [form, initialValues])

    const handleDialogChange = (nextOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(nextOpen)
        }
        onOpenChange?.(nextOpen)
        if (!nextOpen) {
            form.reset(initialValues)
        }
    }

    const invalidateCourses = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: orpc.course.list.byGroupSlug.queryKey({
                input: { groupSlug },
            }),
        })
    }, [groupSlug, queryClient])

    const createMutation = useMutation(
        orpc.course.create.mutationOptions({
            onSuccess: (newCourse) => {
                invalidateCourses()
                toast.success(`${newCourse.name} successfully created`)
                handleDialogChange(false)
                onSuccess?.(newCourse)
            },
            onError: (error) => {
                toast.error(error.message)
            },
        })
    )

    const updateMutation = useMutation(
        orpc.course.update.mutationOptions({
            onSuccess: (updatedCourse) => {
                invalidateCourses()
                toast.success(`${updatedCourse.name} updated`)
                handleDialogChange(false)
                onSuccess?.(updatedCourse)
            },
            onError: (error) => {
                toast.error(error.message)
            },
        })
    )

    const mutation = mode === "create" ? createMutation : updateMutation

    const onSubmit = (data: createCourseFormSchemaTypes) => {
        if (data.price > 0) {
            if (phoneNumber === null || phoneNumber === undefined) {
                toast.error("You need to set telebirr phone number")
                return
            }
        }
        if (mode === "create") {
            if (!groupId) {
                toast.error("Group information is missing")
                return
            }
            createMutation.mutate({ groupId, data })
        } else {
            if (!course) {
                toast.error("Course information is missing")
                return
            }
            updateMutation.mutate({ courseId: course.id, data })
        }
    }

    if (mode === "edit" && !course) {
        return null
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
            <DialogContent className="!max-w-none w-[80vw] md:w-[60vw] lg:w-[50vw]">
                <DialogHeader>
                    <DialogTitle >{mode === "create" ? "Create course" : "Edit course"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Add a new course for members of this group."
                            : "Update the course details for your group."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="flex flex-col gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. How to use HizbHub"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-description">Description</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-description"
                                            placeholder="Describe your course"
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {(field.value?.length ?? 0)}/200 characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="published"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="form-published">Published</FieldLabel>
                                        <Switch
                                            id="form-published"
                                            name={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-invalid={fieldState.invalid}
                                        />
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />


                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-price">Price</FieldLabel>
                                    {!phoneNumber && (
                                        <div className="p-3 border-2 border-border rounded-md bg-secondary">
                                            <p className="text-muted-foreground">
                                                You are not set your Telebirr phone number. you need to add your telebirr phone number to collect payment. you can add it in settings {'->'} payment
                                            </p>
                                        </div>
                                    )}
                                    <Input
                                        id="form-price"
                                        type="number"
                                        disabled={!phoneNumber}
                                        value={Number.isFinite(field.value) ? field.value : ""}
                                        onChange={(event) => field.onChange(Number(event.target.value))}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Price"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="coverImage"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-coverImage">Cover Image</FieldLabel>
                                    <ImageUploader value={field.value ?? null} onChange={field.onChange} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Saving..."
                                : mode === "create"
                                    ? "Create"
                                    : "Save changes"}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
