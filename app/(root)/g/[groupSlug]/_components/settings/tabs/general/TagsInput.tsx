"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type TagsInputProps = {
    tags: string[];                // non-nullable
    onTagsChange: (next: string[]) => void; // not "setSelected"
};

export function FormTagsInput({ tags, onTagsChange }: TagsInputProps) {
    const [value, setValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," && value.trim() !== "") {
            e.preventDefault();
            addTag(value.trim());
        }
        if (e.key === "Enter" && value.trim() !== "") {
            e.preventDefault();
            addTag(value.trim());
        }
    };

    const addTag = (tag: string) => {
        if (!tags.includes(tag)) {
            onTagsChange([...tags, tag]);
        }
        setValue("");
    };

    const removeTag = (tag: string) => {
        onTagsChange(tags.filter((t) => t !== tag));
    };

    return (
        <div className="space-y-2">
            <Input
                placeholder="Type something and press , or Enter"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className={cn(
                            "inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm",
                            "hover:bg-muted/80 transition-colors"
                        )}
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${tag}`}
                        >
                            <HugeiconsIcon icon={X} className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}
