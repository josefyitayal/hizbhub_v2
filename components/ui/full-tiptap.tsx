'use client';

import { useCallback, useEffect, useState } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    Undo,
    Redo,
    Link,
    Code as CodeIcon,
    Youtube,
    Image, // New: Image icon
    Loader, // New: Loading icon
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TiptapLink from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import { Youtube as TiptapYoutube } from '@tiptap/extension-youtube';
// New: Image Extension
import TiptapImage from '@tiptap/extension-image';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';


// Helper component for the Link Button logic (Unchanged)
const LinkButton: React.FC<{ editor: Editor }> = ({ editor }) => {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const newUrl = window.prompt('URL', previousUrl);

        // cancelled
        if (newUrl === null) {
            return;
        }

        // empty
        if (newUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: newUrl }).run();
    }, [editor]);

    return (
        <Toggle
            size="sm"
            pressed={editor.isActive('link')}
            onPressedChange={setLink}
            disabled={!editor.can().chain().focus().setLink({ href: 'https://example.com' }).run()}
        >
            <HugeiconsIcon icon={Link} className="h-4 w-4" />
        </Toggle>
    );
};

// Helper component for the YouTube Button logic (Unchanged)
const YoutubeButton: React.FC<{ editor: Editor }> = ({ editor }) => {
    const addYoutubeVideo = useCallback(() => {
        const url = window.prompt('Enter YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)');

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            });
        }
    }, [editor]);

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={addYoutubeVideo}
        >
            <HugeiconsIcon icon={Youtube} className="h-4 w-4" />
        </Button>
    );
};

// New: Image Upload Button Component
const ImageButton: React.FC<{ editor: Editor }> = ({ editor }) => {
    const [isUploading, setUploading] = useState(false);

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
                editor.chain().focus().setImage({ src: data.url }).run();
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
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 relative overflow-hidden"
            disabled={isUploading}
            asChild // Use asChild to apply button styling to the label/input wrapper
        >
            <label>
                {isUploading ? (
                    <HugeiconsIcon icon={Loader} className="h-4 w-4 animate-spin" />
                ) : (
                    <HugeiconsIcon icon={Image} className="h-4 w-4" aria-hidden="true" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
            </label>
        </Button>
    );
};


interface FullTiptapProps {
    content?: string | null;
    onChange: (editor: Editor) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
}

function FullTiptap({
    content = 'Start typing',
    onChange,
    placeholder = 'Start typing...',
    editable = true,
    className,
}: FullTiptapProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
                codeBlock: false, // Disable default StarterKit CodeBlock to use the custom one
            }),
            Highlight.configure({ multicolor: true }),
            Underline,
            // New Extensions for Course Content:
            TiptapLink.configure({
                openOnClick: true,
                autolink: true,
                defaultProtocol: 'https',
            }),
            CodeBlock, // Use the proper CodeBlock extension
            TiptapYoutube.configure({
                nocookie: true,
                modestBranding: true,
                autoplay: false,
                controls: false,      // Hides the bottom play/pause/volume bar
                HTMLAttributes: {
                    class: 'aspect-video w-full rounded-lg shadow-xl mb-4',
                },
            }),
            // New: Image Extension Configuration
            TiptapImage.configure({
                inline: true, // Allows images to be treated as text characters
                allowBase64: true, // Good for drag-and-drop or clipboard paste
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor);
        },
        editorProps: {
            attributes: {
                // We add specific selectors [&_tag] to force styles
                class: cn(
                    'focus:outline-none min-h-full p-4',
                    // HEADINGS: Fix sizes and font weights
                    '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4',
                    '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3',
                    '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2',

                    // LISTS: Fix "clipping" by adding left padding (pl-6)
                    '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
                    '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
                    '[&_li]:mb-1',

                    // BLOCKQUOTE: Add border and padding
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4',

                    // CODE BLOCKS
                    '[&_pre]:bg-gray-800 [&_pre]:text-white [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4',
                    '[&_pre]:shadow-inner',

                    // LINKS
                    '[&_a]:text-blue-600 [&_a]:underline',
                    '[&_a:hover]:cursor-pointer',

                    // IMAGES
                    '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-4',

                    // HORIZONTAL RULE
                    '[&_hr]:my-4',

                    // GENERAL SPACING
                    '[&_p]:mb-4'
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && content) {
            const currentContent = editor.getHTML();
            if (currentContent !== content) {
                editor.commands.setContent(content); // false to avoid focusing the editor after update
            }
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('border border-border rounded-lg overflow-hidden bg-background shadow-md', className)}>
            <div className="border-b border-border p-2 flex flex-wrap items-center gap-1 bg-muted/50">
                {/* Text Formatting */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                >
                    <HugeiconsIcon icon={Bold} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                    <HugeiconsIcon icon={Italic} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <span className="underline">U</span>
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                >
                    <HugeiconsIcon icon={Strikethrough} className="h-4 w-4" />
                </Toggle>

                {/*<Toggle
                    size="sm"
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                >
                    <Code className="h-4 w-4" />
                </Toggle>*/}

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <HugeiconsIcon icon={Heading1} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <HugeiconsIcon icon={Heading2} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <HugeiconsIcon icon={Heading3} className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists & Blocks */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <HugeiconsIcon icon={List} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <HugeiconsIcon icon={ListOrdered} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <HugeiconsIcon icon={Quote} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('codeBlock')}
                    onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <HugeiconsIcon icon={CodeIcon} className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Media and Links */}
                <LinkButton editor={editor} />
                <YoutubeButton editor={editor} />
                <ImageButton editor={editor} /> {/* New: Image Upload Button */}

                {/* Horizontal Rule (Divider) */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run() }}
                >
                    <HugeiconsIcon icon={Minus} className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Undo/Redo */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <HugeiconsIcon icon={Undo} className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    <HugeiconsIcon icon={Redo} className="h-4 w-4" />
                </Button>
            </div>

            <EditorContent
                editor={editor}
                placeholder={placeholder}
            />
        </div>
    );
}
export { FullTiptap, type FullTiptapProps };
