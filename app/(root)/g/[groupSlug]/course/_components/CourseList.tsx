"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { orpc } from "@/lib/orpc"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Course } from "@/db/schemas"
import { useCurrentGroupQuery } from "../../_components/hooks/useCurrentGroupQuery"
import { Folder, MoreVertical } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { CourseFormDialog } from "./CourseFormDialog"
import { CoursePricingDialog } from "./CoursePricingDialog"

export function CourseList() {
    const { groupSlug } = useParams<{ groupSlug: string }>()
    const [coursePricingOpen, setCoursePricingOpen] = React.useState(false)
    const [courseForPrice, setCourseForPrice] = React.useState<Course | null>(null)
    const [courseToEdit, setCourseToEdit] = React.useState<Course | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const normalizedSlug = React.useMemo(() => groupSlug.replace("%40", ""), [groupSlug])

    const { data: courses, isLoading } = useQuery(
        orpc.course.list.byGroupSlug.queryOptions({
            input: { groupSlug: normalizedSlug },
        })
    )

    const { data: { group, isUserOwned } } = useCurrentGroupQuery()

    const deleteCourseMutation = useMutation(
        orpc.course.delete.mutationOptions({
            onSuccess: (deletedCourse) => {
                queryClient.invalidateQueries({
                    queryKey: orpc.course.list.byGroupSlug.queryKey({
                        input: { groupSlug: normalizedSlug },
                    }),
                })
                toast.success(`${deletedCourse.name} deleted`)
            },
            onError: (error) => {
                toast.error(error.message)
            },
        })
    )

    const handleDelete = (courseId: string) => {
        deleteCourseMutation.mutate({ courseId })
    }

    const handleEdit = (course: Course) => {
        setCourseToEdit(course)
        setIsEditDialogOpen(true)
    }

    const handlePaidCourseClick = (course: Course) => {
        setCourseForPrice(course)
        setCoursePricingOpen(true)
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (!courses || courses.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <HugeiconsIcon icon={Folder} />
                    </EmptyMedia>
                    <EmptyTitle>Not found</EmptyTitle>
                    <EmptyDescription>Course is not found </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <>
            {isUserOwned && (
                <CourseFormDialog
                    mode="edit"
                    groupSlug={normalizedSlug}
                    course={courseToEdit ?? undefined}
                    open={isEditDialogOpen}
                    phoneNumber={group.phoneNumber}
                    onOpenChange={(nextOpen) => {
                        setIsEditDialogOpen(nextOpen)
                        if (!nextOpen) {
                            setCourseToEdit(null)
                        }
                    }}
                    onSuccess={() => {
                        setCourseToEdit(null)
                    }}
                />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => {
                    const isDeleting = deleteCourseMutation.isPending && deleteCourseMutation.variables?.courseId === course.id

                    return (
                        <div
                            key={course.id}
                            className="flex flex-col h-[320px] border border-border rounded-xl overflow-hidden group transition hover:shadow-md bg-card"
                        >
                            {/* 1. FIXED IMAGE HEIGHT */}
                            <div className="relative h-44 w-full overflow-hidden">
                                <Image
                                    src={course.coverImage || "/course banner placeholder.png"}
                                    alt="banner"
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Menu overlay - keeping your logic */}
                                {isUserOwned && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <HugeiconsIcon icon={MoreVertical} className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem
                                                    onSelect={(event) => {
                                                        event.preventDefault()
                                                        handleEdit(course as Course)
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onSelect={(event) => event.preventDefault()}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete course</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete {course.name}? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    handleDelete(course.id)
                                                                }}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? "Deleting..." : "Delete"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>

                            {/* 2. FLEX-1 CONTENT AREA */}
                            <div
                                className="flex flex-col flex-1 p-5 cursor-pointer"
                                onClick={() => {
                                    // 1. Owner always has access
                                    if (isUserOwned) {
                                        return router.push(`/g/${normalizedSlug}/course/${course.id}`);
                                    }

                                    // 2. Extract the current user's subscription (if it exists)
                                    // Because of the server-side filter, index 0 is always the current user
                                    const mySubscription = course.subscriptions[0];
                                    const isPaid = course.price !== null && course.price > 0;
                                    const hasActiveAccess = mySubscription?.status === "active";

                                    // 3. Logic Check
                                    if (isPaid && !hasActiveAccess) {
                                        // Includes cases where status is 'trial' (pending) or no sub exists
                                        handlePaidCourseClick(course);
                                    } else {
                                        // It's free OR user is 'active'
                                        router.push(`/g/${normalizedSlug}/course/${course.id}`);
                                    }
                                }}
                            >
                                {/* Top Section: Constrained Title & Description */}
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold line-clamp-1 group-hover:text-primary">
                                        {course.name}
                                    </p>
                                    {/* FORCE 3 LINES: This keeps the text block height consistent */}
                                    <p className="text-sm text-muted-foreground truncate min-h-[45px]">
                                        {course.description}
                                    </p>
                                </div>

                                {/* 3. PUSHED TO BOTTOM */}
                                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                                        Price
                                    </span>
                                    <p className="text-lg font-bold text-primary">
                                        {course.price ? `${course.price} Birr` : "Free"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Only render if we have a valid ID and Price */}
            {group.id && courseForPrice?.id && typeof courseForPrice?.price === 'number' && (
                <CoursePricingDialog
                    courseId={courseForPrice.id}
                    coursePrice={courseForPrice.price} // Now strictly a number
                    open={coursePricingOpen}
                    onChangeAction={setCoursePricingOpen}
                />
            )}
        </>
    )
}
