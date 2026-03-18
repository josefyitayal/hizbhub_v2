"use client"

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";
import { motion } from "framer-motion";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { CourseSchema, FolderSchema, PageComplateSchema, PageSchema } from "@/db/schemas";
import { useCurrentGroupQuery } from "../../../_components/hooks/useCurrentGroupQuery";
import { ArrowLeft, ChevronRight, CircleCheck, FileText, Plus, Trash2 } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFolderPageMutations } from "./hooks/useFolderPage";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a consistent height class for sidebar items
const ITEM_HEIGHT_CLASS = "h-9";

// Fully expanded Zod schema for the course data
export const _getCourseByIdOutputSchema = CourseSchema.extend({
    folders: z.array(
        FolderSchema.extend({
            pages: z.array(PageSchema.extend({
                completions: z.array(PageComplateSchema)
            })),
        })
    ),
})

// Type definitions derived from Zod schema
type Folder = z.infer<typeof _getCourseByIdOutputSchema>['folders'][number];

export function CourseSidebar({ courseId }: { courseId: string }) {
    const router = useRouter();
    const { groupSlug } = useParams<{ groupSlug: string }>()
    const searchParams = useSearchParams();
    const currentPageId = searchParams.get('page');


    const { data: { isUserOwned } } = useCurrentGroupQuery()
    const { data: course, isLoading } = useQuery(orpc.course.list.byId.queryOptions({ input: { courseId: courseId } }))

    // 💡 FIX 1: Change state to a Set to allow multiple open folders
    const [openFolderIds, setOpenFolderIds] = useState<Set<string>>(() => new Set());

    // State to manage which item is being edited (ID) and the temporary name being typed
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [tempName, setTempName] = useState<string>('');


    const {
        onAddFolder,
        onDeleteFolder,
        onAddPage,
        onDeletePage,
        onRenameFolder,
        onRenamePage
    } = useFolderPageMutations(courseId);

    // 💡 FIX 2: Utility to update the Set state
    const toggleFolderOpen = (folderId: string, open: boolean) => {
        setOpenFolderIds(prev => {
            // Create a new Set based on the previous one to ensure immutability
            const newSet = new Set(prev);
            if (open) {
                newSet.add(folderId);
            } else {
                newSet.delete(folderId);
            }
            return newSet;
        });
    };

    // --- EFFECT TO INITIALIZE FOLDER STATE ---
    useEffect(() => {
        if (currentPageId) {
            // Find the folder that contains the currently active page
            const folderWithPage = course?.folders.find(folder =>
                folder.pages.some(page => page.id === currentPageId)
            );
            // 💡 FIX 3: If found, add that folder ID to the Set
            if (folderWithPage) {
                setOpenFolderIds(prev => {
                    const newSet = new Set(prev);
                    newSet.add(folderWithPage.id);
                    return newSet;
                });
            }
        }
    }, [currentPageId, course?.folders]); // Re-run when page changes or folders are updated (by TanStack Query)

    // --- RENAME HANDLERS FOR UI ---

    const startFolderRename = (folder: Folder) => {
        setTempName(folder.name);
        setEditingFolderId(folder.id);
    };

    const handleFolderRename = (folder: Folder) => {
        if (tempName && tempName.trim() !== '' && tempName !== folder.name) {
            onRenameFolder({ id: folder.id, name: tempName.trim() });
        }
        setEditingFolderId(null);
        setTempName('');
    };

    const startPageRename = (page: Folder['pages'][number]) => {
        setTempName(page.name);
        setEditingPageId(page.id);
    };

    const handlePageRename = (page: Folder['pages'][number], folderId: string) => {
        if (tempName && tempName.trim() !== '' && tempName !== page.name) {
            onRenamePage({ id: page.id, name: tempName.trim(), folderId });
        }
        setEditingPageId(null);
        setTempName('');
    };

    // --- NEW HANDLER FOR COLLAPSIBLE CHANGE ---
    const handleCollapsibleChange = (folderId: string, open: boolean) => {
        // 💡 FIX 4: Use the toggle utility for manual clicks
        toggleFolderOpen(folderId, open);
    };

    // calculalting percent
    // 1. Flatten all pages from all folders
    const allPages = course?.folders.flatMap(folder => folder.pages) ?? [];

    // 2. A page is "completed" if it has at least one completion record where isCompleted is true
    const completedPagesCount = allPages.filter(page =>
        page.completions && page.completions.some(c => c.isCompleted)
    ).length;

    // 3. Calculate percentage
    const percent = allPages.length === 0
        ? 0
        : Math.round((completedPagesCount / allPages.length) * 100);

    if (isLoading) {
        return <div>
            <Skeleton className="flex-[0.3] min-w-2xs h-full" />
        </div>
    }

    return (
        // 🎬 Cinematic Monochrome Studio-Light Sidebar
        <div className="flex-[0.3] min-w-2xs h-full flex flex-col gap-6 p-5 border-r border-border bg-sidebar relative overflow-hidden">

            {/* Course Header */}
            <div className="flex flex-col gap-3 flex-shrink-0"> {/* Added flex-shrink-0 to keep header fixed */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.replace(`/g/${groupSlug}/course`)}
                        size={"icon"}
                    >
                        <HugeiconsIcon icon={ArrowLeft} size={10} />
                    </Button>
                    <p className="text-lg font-semibold truncate">
                        {course?.name}
                    </p>
                </div>

                <div className="relative w-full">
                    <Progress value={percent} className="h-4 bg-white/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/5 to-transparent opacity-40" />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold mix-blend-difference text-white">
                        {percent}% Complete
                    </span>
                </div>
            </div>

            {/* Folder Section */}
            <div className="flex-1 min-h-0 flex flex-col relative z-10 mt-2 overflow-hidden">
                {/* Fixed Header */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Folders</p>
                    {isUserOwned && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 p-0 rounded-md hover:bg-white/5"
                            onClick={() => onAddFolder({ courseId, name: 'New Folder' })}
                        >
                            <HugeiconsIcon icon={Plus} className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>

                {/* Scrollable folders list */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full w-full">
                        <div className="flex flex-col gap-1 pr-4 pb-12">
                            {course?.folders.map(folder => (
                                <Collapsible
                                    key={folder.id}
                                    open={openFolderIds.has(folder.id)}
                                    onOpenChange={(open) => handleCollapsibleChange(folder.id, open)}
                                >
                                    {/* Folder Row */}
                                    <div className={`flex items-center justify-between ${ITEM_HEIGHT_CLASS} px-2 rounded-md transition group bg-white/[0.02] hover:bg-white/[0.05]`}>
                                        <div className="flex items-center gap-1 min-w-0 grow">
                                            <CollapsibleTrigger asChild className="cursor-pointer group">
                                                <Button variant="ghost" size="icon" className="size-6 p-0">
                                                    <HugeiconsIcon icon={ChevronRight} className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-90 text-muted-foreground" />
                                                </Button>
                                            </CollapsibleTrigger>

                                            {editingFolderId === folder.id ? (
                                                <Input
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    className="h-7 px-2 py-0 text-xs"
                                                    onBlur={() => handleFolderRename(folder)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleFolderRename(folder)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    className="font-medium cursor-pointer text-xs tracking-wide truncate grow min-w-0 text-muted-foreground"
                                                    onDoubleClick={() => isUserOwned && startFolderRename(folder)}
                                                >
                                                    {folder.name}
                                                </span>
                                            )}
                                        </div>

                                        {isUserOwned && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 hover:bg-white/5"
                                                    onClick={() => onAddPage({ folderId: folder.id, name: 'Untitled Page', content: 'New Page created!' })}
                                                >
                                                    <HugeiconsIcon icon={Plus} className="h-3.5 w-3.5 text-white/60" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-6 w-6 hover:bg-white/5"
                                                    onClick={() => onDeleteFolder({ id: folder.id })}
                                                >
                                                    <HugeiconsIcon icon={Trash2} className="h-3.5 w-3.5 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <CollapsibleContent className="overflow-hidden">
                                        <motion.div
                                            initial={false}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="space-y-0.5 py-1 pl-3 ml-3 border-l border-white/5"
                                        >
                                            {folder.pages.map(page => {
                                                const isActive = page.id === currentPageId;
                                                return (
                                                    <div
                                                        key={page.id}
                                                        className={`flex items-center justify-between ${ITEM_HEIGHT_CLASS} px-2 pl-6 rounded-md group transition
                                        ${isActive
                                                                ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                                                                : 'hover:bg-white/[0.04] text-white/60'
                                                            }`}
                                                    >
                                                        {editingPageId === page.id ? (
                                                            <Input
                                                                value={tempName}
                                                                onChange={(e) => setTempName(e.target.value)}
                                                                className="h-7 px-2 py-0 text-xs bg-black/40 border-white/10 text-white"
                                                                onBlur={() => handlePageRename(page, folder.id)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handlePageRename(page, folder.id);
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <button
                                                                className={`flex items-center gap-2 text-xs tracking-wide transition truncate grow min-w-0 text-left
                                                ${isActive ? 'text-white' : 'hover:text-white'}`}
                                                                onClick={() => router.push(`?page=${page.id}`)}
                                                                onDoubleClick={() => { if (isUserOwned) startPageRename(page) }}
                                                            >
                                                                <HugeiconsIcon icon={FileText} className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                                                                <span className="truncate">{page.name}</span>
                                                            </button>
                                                        )}

                                                        {page.completions?.some((c) => c.isCompleted) && (
                                                            <div className="px-2">
                                                                <HugeiconsIcon icon={CircleCheck} className="text-white/70 size-4" />
                                                            </div>
                                                        )}

                                                        {isUserOwned && (
                                                            <button
                                                                onClick={() => onDeletePage({ id: page.id })}
                                                                className={`h-6 w-6 p-1 rounded-md transition hover:bg-white/5
                                                ${editingPageId === page.id ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
                                                            >
                                                                <HugeiconsIcon icon={Trash2} className="h-3.5 w-3.5 text-white/50" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </motion.div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
