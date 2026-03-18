"use client"

import { getAvatar } from "@/lib/get-avatar"
import { orpc } from "@/lib/orpc"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCurrentGroupQuery } from "../../_components/hooks/useCurrentGroupQuery"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function MembersList() {
    const { groupSlug } = useParams<{ groupSlug: string }>()
    const router = useRouter()

    const { data: { group } } = useCurrentGroupQuery()

    const { data: members, isLoading } = useQuery(orpc.member.list.byGroupSlug.queryOptions({
        input: { groupSlug: group.slug }
    }))

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-36" />
                <Skeleton className="w-full h-36" />
                <Skeleton className="w-full h-36" />
            </div>
        )
    }

    return (
        <>
            {members?.map((member) => (
                <div key={member.id} className="flex flex-col gap-4 border border-border rounded-lg p-5">
                    <div className="flex items-center gap-3">
                        <Image src={getAvatar(member.user.profilePicture, member.user.email)} alt="user" width={24} height={24} className="rounded-full object-cover size-9" />
                        <div className="flex flex-col justify-between">
                            <p className="text-lg">{member.user.firstName} {member.user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{member.user.userName}</p>
                        </div>
                    </div>
                    <div>
                        <p>{member.user.bio}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <HugeiconsIcon icon={Calendar} />
                        <p className="text-muted-foreground">{dayjs(member.createdAt).format('MMMM D, YYYY')}</p>
                    </div>
                </div>
            ))
            }
        </>
    )
}
