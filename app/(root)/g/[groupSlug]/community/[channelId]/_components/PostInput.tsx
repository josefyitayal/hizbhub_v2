"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";
import { useUser } from "@clerk/nextjs";
import { getAvatar } from "@/lib/get-avatar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from '@tiptap/extension-placeholder'; // Import the extension
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bold, ImageIcon, Italic, List, ListOrdered } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGroup } from "../../../_components/context/GroupContext";

export function PostInput() {
    const [content, setContent] = useState("")

    const queryClient = useQueryClient()
    const { user: clerkUser } = useUser()
    const [isUploading, setUploading] = useState(false);
    const [theImage, setTheImage] = useState<string | null>(null)

    const { currentChannel: channel, } = useGroup()

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                // We need to tell Tiptap to render correct list attributes
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                // The placeholder text
                placeholder: 'Start typing something amazing...',
            }),
            Underline,
        ],
        content,
        editable: true,
        onUpdate: ({ editor }) => {
            setContent?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                // We add specific selectors [&_tag] to force styles
                class: cn(
                    'focus:outline-none min-h-[200px] p-4',
                    // HEADINGS: Fix sizes and font weights
                    '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4',
                    '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3',
                    '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2',

                    // LISTS: Fix "clipping" by adding left padding (pl-6)
                    '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
                    '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
                    '[&_li]:mb-1',


                    '[& _.ProseMirror]: min-h-[44px]',
                    '[& _.ProseMirror]: max-h-40',
                    '[& _.ProseMirror]: overflow-y-auto',
                    '[& _.ProseMirror]: pr-2',

                    // BLOCKQUOTE: Add border and padding
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4',

                    // GENERAL SPACING
                    '[&_p]:mb-4'
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && content) {
            // Get the current editor content
            const currentContent = editor.getHTML();

            // Only update if the content has actually changed to prevent an infinite loop
            if (currentContent !== content) {
                // Use setContent to replace the editor's current state
                editor.commands.setContent(content);
            }
        }
    }, [editor, content]);

    const postMutation = useMutation(orpc.post.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.post.list.byChannelId.key({ input: { channelId: channel?.id!, groupId: channel?.groupId! } })
            })
            setContent("")
            editor?.commands.setContent("");
            setTheImage(null)
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                toast.error(error.message)
                return
            }
            toast.error(error.message)
        }
    }))

    function handlePost() {
        if (content) {
            postMutation.mutate({ channelId: channel?.id!, groupId: channel?.groupId!, content, attachment: theImage })
        }
    }

    const userImage = getAvatar(clerkUser?.imageUrl ?? "", clerkUser?.emailAddresses[0]?.emailAddress ?? "")

    if (!editor) {
        return null;
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        const file = files?.[0];
        if (!file) return;

        // Reset the file input value immediately so the same file can be uploaded again if needed
        event.target.value = '';

        // Image validation settings (you can adjust these)
        const minWidth = 10;
        const minHeight = 10;
        const maxSizeMB = 1; // 1MB for compression

        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        img.alt = "priview"

        img.onload = async () => {
            if (img.width < minWidth || img.height < minHeight) {
                toast.error(`Image must be >= ${minWidth}x${minHeight}px`);
                return;
            }

            try {
                setUploading(true);
                const fd = new FormData();
                fd.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Upload failed");

                // Insert the uploaded image into the editor
                setTheImage(data.url);
                toast.success("Image uploaded successfully!");

            } catch (err) {
                toast.error("Upload failed");
                console.error(err);
            } finally {
                setUploading(false);
            }
        };
    };

    return (
        <div className="relative w-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 flex flex-col gap-6 ">

            {/* Studio light glow */}
            {/* <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-white/5 blur-[140px] rounded-full" /> */}
            {/* Top Row */}
            <div className="relative z-10 flex items-start gap-4 w-full">
                {userImage ? (
                    <Image
                        src={userImage}
                        alt="user pp"
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover border border-white/10"
                    />
                ) : (
                    <Skeleton className="rounded-full size-10 bg-white/10" />
                )}

                <div className="flex-1">
                    <ScrollArea className="max-h-40 pr-3"> {/* Defined height for ScrollArea */}
                        <EditorContent
                            editor={editor}
                            className="focus:outline-none [&_.ProseMirror]:min-h-[44px] [&_.ProseMirror]:pr-2"
                        />
                    </ScrollArea>
                </div>
            </div>

            {isUploading && (
                <div className="relative z-10">
                    <div className="w-[210px] h-40 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center animate-pulse">
                        <span className="text-xs text-zinc-500 tracking-wide">
                            Uploading image...
                        </span>
                    </div>
                </div>
            )}

            {!isUploading && theImage && (
                <div className="relative z-10 group">
                    <div className="relative w-[210px] overflow-hidden rounded-2xl border border-white/10 bg-black">
                        <img
                            src={theImage}
                            alt="preview"
                            className="w-full h-auto max-h-72 object-cover opacity-90"
                        />

                        {/* subtle cinematic top fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                        {/* remove button (you wire functionality) */}
                        <button
                            className="
                                absolute top-3 right-3 
                                px-3 py-1 text-xs 
                                rounded-full 
                                bg-white/10 
                                border border-white/20 
                                text-white 
                                backdrop-blur-md
                                hover:bg-white/20
                                transition
                            "
                            onClick={(e) => {
                                e.stopPropagation();
                                setTheImage(null);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Bottom Controls */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* Formatting Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className="text-muted-foreground cursor-pointer"
                    >
                        <HugeiconsIcon icon={Bold} className="h-4 w-4" />
                    </Toggle>

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className="text-muted-foreground cursor-pointer"
                    >
                        <HugeiconsIcon icon={Italic} className="h-4 w-4" />
                    </Toggle>

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        className="text-muted-foreground cursor-pointer"
                    >
                        <span className="underline text-sm">U</span>
                    </Toggle>

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        className="text-muted-foreground cursor-pointer"
                    >
                        <HugeiconsIcon icon={List} className="h-4 w-4" />
                    </Toggle>

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        className="text-muted-foreground cursor-pointer"
                    >
                        <HugeiconsIcon icon={ListOrdered} className="h-4 w-4" />
                    </Toggle>

                    {/* Image Upload Trigger Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 relative overflow-hidden text-muted-foreground hover:text-muted-foreground"
                        asChild // Use asChild to apply button styling to the label/input wrapper
                        disabled={isUploading}
                    >
                        <label>
                            <HugeiconsIcon icon={ImageIcon} className="h-4 w-4" aria-hidden="true" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />
                        </label>
                    </Button>
                </div>

                {/* Post Button */}
                <Button
                    className=""
                    disabled={postMutation.isPending}
                    onClick={handlePost}
                >
                    {postMutation.isPending ? "Posting..." : "Post"}
                </Button>
            </div>
        </div>
    )
}
