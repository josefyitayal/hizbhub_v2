"use client"

import { cn } from "@/lib/utils";

interface TiptapViewerProps {
    content: string | null;
    className?: string;
}

export function TiptapViewer({ content, className }: TiptapViewerProps) {
    return (
        <div
            className={cn(
                "prose dark:prose-invert max-w-none w-full", // Base typography styles

                // --- COPY OF THE STYLES FROM YOUR EDITOR ---
                // Headings
                "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
                "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3",
                "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2",

                // Lists (Fixing the clipping/style issues)
                "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4",
                "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4",
                "[&_li]:mb-1",

                // Blockquotes
                "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4",

                // Paragraphs
                "[&_p]:mb-4",

                // Links (if you have them)
                "[&_a]:text-blue-500 [&_a]:underline",

                className
            )}
            // This renders the HTML string
            dangerouslySetInnerHTML={{ __html: content || "" }}
        />
    );
}
