"use client"

import * as React from "react"
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
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { Course } from "@/db/schemas"
import { createCourseFormSchema, createCourseFormSchemaTypes } from "@/zod-schema/createCourseZodSchema"
import { useCurrentGroupQuery } from "../../_components/hooks/useCurrentGroupQuery"
import { CourseFormDialog } from "./CourseFormDialog"

export function CreateCourseButton() {
    const { groupSlug } = useParams<{ groupSlug: string }>()
    const router = useRouter()

    const { data: { isUserOwned, group } } = useCurrentGroupQuery()

    if (!group.isMember) router.push(`/g/${groupSlug}`)
    if (!isUserOwned) return null

    return (
        <CourseFormDialog
            mode="create"
            groupId={group.id}
            groupSlug={group.slug}
            trigger={<Button>Create course</Button>}
            phoneNumber={group.phoneNumber}
            onSuccess={(newCourse) => {
                router.push(`/g/${group.slug}/course/${newCourse.id}`)
            }}
        />
    )
}
