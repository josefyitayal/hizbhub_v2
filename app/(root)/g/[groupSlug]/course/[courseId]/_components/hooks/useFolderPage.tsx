"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { orpc } from '@/lib/orpc';
import { CourseSchema, FolderSchema, PageComplateSchema, PageSchema } from '@/db/schemas';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

// --- 1. Type Definitions ---

// Define the fully expanded Zod schemas for the frontend data structure
const PageWithDetailsSchema = PageSchema.extend({
    completions: z.array(PageComplateSchema)
});
const FolderWithPagesSchema = FolderSchema.extend({
    pages: z.array(PageWithDetailsSchema),
});
const CourseDataSchema = CourseSchema.extend({
    folders: z.array(FolderWithPagesSchema),
});

type CourseData = z.infer<typeof CourseDataSchema>;
type FolderWithPages = z.infer<typeof FolderWithPagesSchema>;
type PageWithDetails = z.infer<typeof PageWithDetailsSchema>;

// Helper to provide all required fields for an optimistic object
const createOptimisticPage = (
    folderId: string,
    name: string,
    tempId: string
): PageWithDetails & { isOptimistic: true } => ({
    id: tempId,
    name,
    folderId,
    content: "New Page created!",
    createdAt: new Date(),
    updatedAt: new Date(),
    completions: [],
    isOptimistic: true,
});

const createOptimisticFolder = (courseId: string, name: string, tempId: string): FolderWithPages => ({
    id: tempId,
    name: name,
    courseId: courseId,
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: [],
    // Add any other non-nullable fields from FolderSchema
});


/**
 * Custom hook to handle all TanStack Query mutations for course folders and pages.
 * Includes optimistic UI updates for a smooth user experience.
 * @param courseId The ID of the course being modified.
 */
export function useFolderPageMutations(courseId: string) {
    const queryClient = useQueryClient();
    const router = useRouter(); // 👈 Added
    const searchParams = useSearchParams(); // 👈 Added
    const courseQueryKey = orpc.course.list.byId.queryKey({ input: { courseId } })

    // --- Helper function for optimistic state update ---
    const updateCourseDataOptimistically = async (
        updater: (oldData: CourseData) => CourseData,
        tempId?: string
    ) => {
        await queryClient.cancelQueries({ queryKey: courseQueryKey });

        const previousCourse = queryClient.getQueryData<CourseData>(courseQueryKey);

        if (previousCourse) {
            queryClient.setQueryData<CourseData>(
                courseQueryKey,
                updater(previousCourse)
            );
        }

        return { previousCourse, tempId };
    };

    // --- 2. ADD FOLDER MUTATION ---
    const addFolderMutation = useMutation(
        orpc.course.folder.add.mutationOptions({
            onMutate: async ({ name }) => {
                const tempId = crypto.randomUUID();

                return updateCourseDataOptimistically((previousCourse) => {
                    const optimisticFolder = createOptimisticFolder(courseId, name, tempId);

                    return {
                        ...previousCourse,
                        folders: [...previousCourse.folders, optimisticFolder],
                    };
                });
            },
            onError: (error, variables, context) => {
                toast.error(`Failed to add folder: ${error.message}`);
                if (context?.previousCourse) {
                    queryClient.setQueryData<CourseData>(courseQueryKey, context.previousCourse);
                }
            },
            // FIX: Ensure full invalidation and success toast
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: courseQueryKey });
            },
        })
    );

    // --- 3. RENAME FOLDER MUTATION (NEW) ---
    const renameFolderMutation = useMutation(
        orpc.course.folder.rename.mutationOptions({ // Assuming you add this to the backend
            onMutate: async ({ id, name }) => {
                return updateCourseDataOptimistically((previousCourse) => {
                    return {
                        ...previousCourse,
                        folders: previousCourse.folders.map(f =>
                            f.id === id ? { ...f, name } : f
                        ),
                    };
                });
            },
            onError: (error, variables, context) => {
                toast.error(`Failed to rename folder: ${error.message}`);
                if (context?.previousCourse) {
                    queryClient.setQueryData<CourseData>(courseQueryKey, context.previousCourse);
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: courseQueryKey });
            },
        })
    );


    // --- 4. DELETE FOLDER MUTATION ---
    const deleteFolderMutation = useMutation(
        orpc.course.folder.delete.mutationOptions({
            onMutate: async (variables) => {
                return updateCourseDataOptimistically((previousCourse) => {
                    return {
                        ...previousCourse,
                        folders: previousCourse.folders.filter(f => f.id !== variables.id),
                    };
                });
            },
            onError: (error, variables, context) => {
                toast.error(`Failed to delete folder: ${error.message}`);
                if (context?.previousCourse) {
                    queryClient.setQueryData<CourseData>(courseQueryKey, context.previousCourse);
                }
            },
            onSettled: (data) => {
                queryClient.invalidateQueries({ queryKey: courseQueryKey });
                if (data) toast.success(`Folder deleted!`);
            },
        })
    );

    // --- 5. ADD PAGE MUTATION ---
    const addPageMutation = useMutation(
        orpc.course.page.add.mutationOptions({
            onMutate: async ({ folderId, name }) => {
                const tempId = crypto.randomUUID();

                return updateCourseDataOptimistically(
                    previousCourse => ({
                        ...previousCourse,
                        folders: previousCourse.folders.map(folder =>
                            folder.id === folderId
                                ? {
                                    ...folder,
                                    pages: [
                                        ...folder.pages,
                                        createOptimisticPage(folderId, name, tempId),
                                    ],
                                }
                                : folder
                        ),
                    }),
                    tempId
                );
            },

            onSuccess: (data, _variables, context) => {
                if (!context?.tempId) return;

                // 🔁 Replace temp page with real page
                queryClient.setQueryData<CourseData>(courseQueryKey, old => {
                    if (!old) return old;

                    return {
                        ...old,
                        folders: old.folders.map(folder => ({
                            ...folder,
                            pages: folder.pages.map(page =>
                                page.id === context.tempId ? data : page
                            ),
                        })),
                    };
                });

                // 🔑 Update URL to real page ID
                router.replace(`?page=${data.id}`);
            },

            onError: (error, _variables, context) => {
                toast.error(`Failed to add page: ${error.message}`);

                if (context?.previousCourse) {
                    queryClient.setQueryData<CourseData>(
                        courseQueryKey,
                        context.previousCourse
                    );
                }
            },

            // 🚫 DO NOT invalidate immediately (important)
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: courseQueryKey,
                    refetchType: "inactive",
                });
            },
        })
    );

    // --- 6. RENAME PAGE MUTATION (NEW) ---
    const renamePageMutation = useMutation(
        orpc.course.page.rename.mutationOptions({ // Assuming you add this to the backend
            onMutate: async ({ id, name, folderId }) => {
                return updateCourseDataOptimistically((previousCourse) => {
                    return {
                        ...previousCourse,
                        folders: previousCourse.folders.map(folder =>
                            folder.id === folderId
                                ? {
                                    ...folder,
                                    pages: folder.pages.map(p => p.id === id ? { ...p, name } : p)
                                }
                                : folder
                        ),
                    };
                });
            },
            onError: (error, variables, context) => {
                toast.error(`Failed to rename page: ${error.message}`);
                if (context?.previousCourse) {
                    queryClient.setQueryData<CourseData>(courseQueryKey, context.previousCourse);
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: courseQueryKey });
            },
        })
    );

    // --- 7. DELETE PAGE MUTATION ---
    const deletePageMutation = useMutation(
        orpc.course.page.delete.mutationOptions({
            onMutate: async (variables) => {
                return updateCourseDataOptimistically((previousCourse) => {
                    return {
                        ...previousCourse,
                        folders: previousCourse.folders.map(folder => ({
                            ...folder,
                            pages: folder.pages.filter(p => p.id !== variables.id)
                        })),
                    };
                });
            },
            onSettled: (data) => {
                queryClient.invalidateQueries({ queryKey: courseQueryKey });
                if (data) toast.success(`Page deleted!`);
            },
        })
    );


    // --- 8. Export all mutation functions ---
    return {
        // Create/Delete
        onAddFolder: addFolderMutation.mutate,
        onDeleteFolder: deleteFolderMutation.mutate,
        onAddPage: addPageMutation.mutate,
        onDeletePage: deletePageMutation.mutate,
        // Rename (New)
        onRenameFolder: renameFolderMutation.mutate,
        onRenamePage: renamePageMutation.mutate,

        isMutating: addFolderMutation.isPending || deleteFolderMutation.isPending ||
            addPageMutation.isPending || deletePageMutation.isPending,
    };
}
