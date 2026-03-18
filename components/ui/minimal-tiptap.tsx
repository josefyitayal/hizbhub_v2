'use client';

import * as React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    Undo,
    Redo,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { HugeiconsIcon } from '@hugeicons/react';

// getAvatar(clerkUser?.imageUrl ?? "", user?.email ?? "")

interface MinimalTiptapProps {
    id?: string;
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
}

function MinimalTiptap({
    id,
    content = '',
    onChange,
    placeholder = 'Start typing...',
    editable = true,
    className,
}: MinimalTiptapProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                // We need to tell Tiptap to render correct list attributes
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Highlight.configure({ multicolor: true }),
            Underline,
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
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

                    // BLOCKQUOTE: Add border and padding
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4',

                    // GENERAL SPACING
                    '[&_p]:mb-4'
                ),
            },
        },
    });

    React.useEffect(() => {
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

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('border border-border rounded-lg overflow-hidden bg-background', className)}>
            <div className="border-b border-border p-2 flex flex-wrap items-center gap-1 bg-muted/50">
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
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                >
                    <HugeiconsIcon icon={Strikethrough} className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                >
                    <HugeiconsIcon icon={Code} className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-6 mx-1" />
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
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run() }}
                >
                    <HugeiconsIcon icon={Minus} className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <HugeiconsIcon icon={Undo} className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    <HugeiconsIcon icon={Redo} className="h-4 w-4" />
                </Button>
            </div>

            <EditorContent
                id={id}
                editor={editor}
                placeholder={placeholder}
            />
        </div>
    );
}
export { MinimalTiptap, type MinimalTiptapProps };
