"use client"

import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
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
