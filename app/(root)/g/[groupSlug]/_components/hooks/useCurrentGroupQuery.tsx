"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useGroup } from "../context/GroupContext"
import { orpc } from "@/lib/orpc"

export const useCurrentGroupQuery = () => {
    const { group } = useGroup()

    const { data, isLoading } = useSuspenseQuery(orpc.group.list.slug.queryOptions({ input: { groupSlug: group.slug } }))

    return {
        data,
        isLoading
    }
}