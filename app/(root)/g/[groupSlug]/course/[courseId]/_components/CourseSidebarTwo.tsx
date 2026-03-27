"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { CourseSchema, FolderSchema, PageComplateSchema, PageSchema } from "@/db/schemas";
import { useCurrentGroupQuery } from "../../../_components/hooks/useCurrentGroupQuery";
import { ArrowLeft, ChevronRight, CircleCheck, FileText, Plus, Trash2 } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFolderPageMutations } from "./hooks/useFolderPage";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from 'framer-motion';

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

export function CourseSidebarTwo({ courseId }: { courseId: string }) {
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
        <div className="h-full w-[360px] flex flex-col gap-3 p-5 border-r border-border bg-sidebar overflow-hidden">
            {/* Course Header */}
            <div className="flex flex-col gap-3 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.replace(`/g/${groupSlug}/course`)}
                        size={"icon"}
                    >
                        <HugeiconsIcon icon={ArrowLeft} size={10} />
                    </Button>
                    <p className="text-lg font-semibold truncate min-w-0">
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

            <div className="flex items-center justify-between flex-shrink-0">
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

            {/* Folder section – takes remaining height and scrolls when needed */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-5">
                <div className="flex flex-col gap-1">
                    {/* Use overflow-y-auto – shows scrollbar only when content overflows */}
                    {course?.folders.map(folder => {
                        const isOpen = openFolderIds.has(folder.id);
                        return (
                            <div key={folder.id} className="w-full min-w-0 max-w-full overflow-hidden">
                                {/* Folder row */}
                                <div className={`flex items-center w-full min-w-0 ${ITEM_HEIGHT_CLASS} px-2 rounded-md transition group bg-white/[0.02] hover:bg-white/[0.05] overflow-hidden`}>
                                    <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                                        <Button variant="ghost" size="icon" className="size-6 p-0 shrink-0 cursor-pointer" onClick={() => handleCollapsibleChange(folder.id, !isOpen)}>
                                            <HugeiconsIcon icon={ChevronRight} className="h-4 w-4 transition-transform duration-300 text-muted-foreground" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                        </Button>
                                        {editingFolderId === folder.id ? (
                                            <Input value={tempName} onChange={(e) => setTempName(e.target.value)} className="h-7 px-2 py-0 text-xs w-full min-w-0" onBlur={() => handleFolderRename(folder)} onKeyDown={(e) => e.key === 'Enter' && handleFolderRename(folder)} autoFocus />
                                        ) : (
                                            <span className="block font-medium cursor-pointer text-xs min-w-0 max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-muted-foreground" onDoubleClick={() => isUserOwned && startFolderRename(folder)}>
                                                {folder.name}
                                            </span>
                                        )}
                                    </div>
                                    {isUserOwned && (
                                        <div className="flex items-center gap-1 flex-none ml-auto opacity-0 group-hover:opacity-100 transition">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/5 shrink-0" onClick={() => onAddPage({ folderId: folder.id, name: 'Untitled Page', content: 'New Page created!' })}>
                                                <HugeiconsIcon icon={Plus} className="h-3.5 w-3.5 text-white/60" />
                                            </Button>
                                            <Button variant="destructive" size="icon" className="h-6 w-6 hover:bg-white/5 shrink-0" onClick={() => onDeleteFolder({ id: folder.id })}>
                                                <HugeiconsIcon icon={Trash2} className="h-3.5 w-3.5 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Collapsible content */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="w-full space-y-0.5 py-1 pl-3 ml-3 border-l border-white/5 overflow-hidden min-w-0"
                                        >
                                            {folder.pages.map(page => {
                                                const isActive = page.id === currentPageId;
                                                return (
                                                    <div
                                                        key={page.id}
                                                        className={`w-full flex items-center ${ITEM_HEIGHT_CLASS} px-2 pl-6 rounded-md group transition overflow-hidden min-w-0 max-w-full ${isActive ? 'bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'hover:bg-white/[0.04] text-white/60'}`}
                                                    >
                                                        <div className="flex-1 min-w-0 overflow-hidden flex items-center">
                                                            {editingPageId === page.id ? (
                                                                <Input value={tempName} onChange={(e) => setTempName(e.target.value)} className="h-7 px-2 py-0 text-xs bg-black/40 border-white/10 text-white w-full min-w-0" onBlur={() => handlePageRename(page, folder.id)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handlePageRename(page, folder.id); } }} autoFocus />
                                                            ) : (
                                                                <button className={`flex items-center gap-2 text-xs tracking-wide transition min-w-0 w-full overflow-hidden whitespace-nowrap text-left ${isActive ? 'text-white' : 'hover:text-white'}`} onClick={() => router.push(`?page=${page.id}`)} onDoubleClick={() => { if (isUserOwned) startPageRename(page) }}>
                                                                    <HugeiconsIcon icon={FileText} className="h-3.5 w-3.5 opacity-60 shrink-0" />
                                                                    <span className="block min-w-0 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">{page.name}</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0 ml-auto flex-none">
                                                            {page.completions?.some((c) => c.isCompleted) && (
                                                                <div className="px-1">
                                                                    <HugeiconsIcon icon={CircleCheck} className="text-white/70 size-4" />
                                                                </div>
                                                            )}
                                                            {isUserOwned && (
                                                                <button onClick={() => onDeletePage({ id: page.id })} className={`h-6 w-6 p-1 rounded-md transition hover:bg-white/5 shrink-0 ${editingPageId === page.id ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                                                                    <HugeiconsIcon icon={Trash2} className="h-3.5 w-3.5 text-white/50" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
