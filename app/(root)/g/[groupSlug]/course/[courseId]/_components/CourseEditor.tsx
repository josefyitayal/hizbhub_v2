"use client"

import { Button } from "@/components/ui/button"
import { FullTiptap } from "@/components/ui/full-tiptap"
import { Editor } from '@tiptap/react';
import { Toggle } from "@/components/ui/toggle"
import { Page, PageComplate } from "@/db/schemas"
import { orpc } from "@/lib/orpc"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useCurrentGroupQuery } from "../../../_components/hooks/useCurrentGroupQuery"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight, CircleCheck } from "@hugeicons/core-free-icons"
import { ScrollArea } from "@/components/ui/scroll-area";
import { TiptapViewer } from "@/components/TiptapViewer";

type CourseEditorProp = {
    courseId: string;
};

type pageWithCompletionsTypes = Page & {
    completions: PageComplate[]
}

export function CourseEditor({ courseId }: CourseEditorProp) {
    const queryClient = useQueryClient()

    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();
    const selectedPageId = searchParams.get("page")

    const { data: { isUserOwned } } = useCurrentGroupQuery()
    const { data: course, isLoading } = useQuery(orpc.course.list.byId.queryOptions({ input: { courseId: courseId } }))

    const selectedPage = useMemo(() => {
        if (!course?.folders) return undefined;

        for (const folder of course.folders) {
            const match = folder.pages?.find(p => p.id === selectedPageId);
            if (match) return match as pageWithCompletionsTypes;
        }
        return undefined;
    }, [course, selectedPageId]);

    // 1. Flatten all pages into one list for easy indexing
    const allPages = useMemo(() => {
        return course?.folders?.flatMap(folder => folder.pages || []) || [] as pageWithCompletionsTypes[];
    }, [course]);

    // 2. Find the current index and neighbor pages
    const currentIndex = allPages.findIndex(p => p.id === selectedPageId);
    const prevPage = allPages[currentIndex - 1];
    const nextPage = allPages[currentIndex + 1];

    // 3. Helper to update the URL param
    const navigateToPage = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", id);
        router.push(`${pathname}?${params.toString()}`);
    };

    const [activeEditor, setActiveEditor] = useState<Editor | null>(null)
    const [content, setContent] = useState<string | null>(selectedPage?.content ?? null)
    const [canSave, setCanSave] = useState(false)

    const [previewToggle, setPreviewToggle] = useState(true)

    useEffect(() => {
        if (selectedPage) {
            setContent(selectedPage.content)
        } else {
            setContent(null)
        }
    }, [selectedPage])



    const saveMutation = useMutation(orpc.course.page.save.mutationOptions({
        onSuccess: (newPage) => {
            setContent(newPage.content)
            queryClient.invalidateQueries(orpc.course.list.byId.queryOptions({ input: { courseId: courseId } }))
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const toggleCompleteMutation = useMutation(orpc.course.page.complele.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(orpc.course.list.byId.queryOptions({ input: { courseId: courseId } }))
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    function handleSave() {
        if (!activeEditor) return;

        const htmlToSave = activeEditor.getHTML();

        if (selectedPage) {
            saveMutation.mutate({ pageId: selectedPage.id, folderId: selectedPage.folderId, content: htmlToSave })
        }
        setCanSave(false); // Disable button until next change
    }

    if (!selectedPage) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                {isUserOwned ? "Select a page to start editing" : "Select a page to view"}
            </div>
        );
    }

    const isCompleted = selectedPage.completions?.some((c) => c.isCompleted) ?? false;

    if (isLoading) {
        return (
            <div>from courseEditor</div>
        )
    }

    return (
        <ScrollArea className="flex-1 overflow-y-auto h-full px-5">
            <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    {prevPage ? (
                        <Button variant={"ghost"} onClick={() => navigateToPage(prevPage.id)}>
                            <HugeiconsIcon icon={ArrowRight} className="rotate-180" />
                        </Button>
                    ) : <div />}
                    <p className="text-lg font-semibold">{selectedPage.name}</p>
                    {nextPage && (
                        <Button variant={"ghost"} onClick={() => navigateToPage(nextPage.id)}>
                            <HugeiconsIcon icon={ArrowRight} className="" />
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isUserOwned && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant={"secondary"}
                                onClick={handleSave}
                                disabled={saveMutation.isPending || !canSave}
                            >
                                {saveMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Toggle pressed={previewToggle} onPressedChange={setPreviewToggle} variant={"outline"}>
                                <p>{previewToggle ? "Priview" : "Edit"}</p>
                            </Toggle>
                        </div>
                    )}
                    <Toggle
                        aria-label="Toggle completion"
                        variant="outline"
                        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:stroke-blue-500"
                        pressed={isCompleted}
                        onPressedChange={(pressed) => {
                            toggleCompleteMutation.mutate({
                                pageId: selectedPage.id,
                                isComplete: pressed,
                            });
                        }}
                    >
                        <HugeiconsIcon icon={CircleCheck} className={cn(isCompleted && "text-blue-500")} />
                    </Toggle>
                </div>
            </div>
            {previewToggle ? (
                <div className="py-3">
                    <TiptapViewer content={content} />
                    {/* <div */}
                    {/*     className={cn( */}
                    {/*         'leading-snug', // Tighter space between lines within a paragraph */}
                    {/*         '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3', // Reduced h1 margin */}
                    {/*         '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2',  // Reduced h2 margin */}
                    {/*         '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-1',  // Reduced h3 margin */}
                    {/*         '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2', */}
                    {/*         '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2', */}
                    {/*         '[&_li]:mb-0.5', // Tighter list items */}
                    {/*         '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-2', */}
                    {/*         '[&_pre]:bg-gray-800 [&_pre]:text-white [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-2', */}
                    {/*         '[&_pre]:shadow-inner', */}
                    {/*         '[&_a]:text-blue-600 [&_a]:underline', */}
                    {/*         '[&_a:hover]:cursor-pointer', */}
                    {/*         '[&_hr]:my-2', */}
                    {/*         '[&_p]:mb-2' // Reduced from mb-4 to mb-2 for smaller gaps between paragraphs */}
                    {/*     )} */}
                    {/*     dangerouslySetInnerHTML={{ __html: content || "yosef" }} */}
                    {/* /> */}
                </div>
            ) : (
                <div className="h-full py-3">
                    {isUserOwned && (
                        <FullTiptap
                            key={selectedPage.id}
                            content={content}
                            onChange={(editor: Editor) => {
                                setActiveEditor(editor);
                                const currentHTML = editor.getHTML();
                                // Logic: Enable if it's different from last save AND not empty
                                const isDirty = currentHTML !== content;
                                const isNotEmpty = !editor.isEmpty;

                                setCanSave(isDirty && isNotEmpty);
                            }}
                            className="h-full"
                        />
                    )}
                </div>
            )}
        </ScrollArea>
    )
}
