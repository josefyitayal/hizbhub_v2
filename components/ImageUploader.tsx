"use client";

import { Dropzone } from "@/components/ui/dropzone";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { compressImage } from "@/lib/compressImage";

type Props = {
    value: string | null;
    onChange: (val: string | null) => void;
    minWidth?: number;
    minHeight?: number;
    maxSizeMB?: number;
    className?: string;
};

export function ImageUploader({
    value,
    onChange,
    minWidth = 200,
    minHeight = 200,
    maxSizeMB = 1,
    className
}: Props) {

    const [uploading, setUploading] = useState(false);

    const handleDrop = useCallback(async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        const img = new window.Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            if (img.width < minWidth || img.height < minHeight) {
                toast.error(`Image must be >= ${minWidth}x${minHeight}px`);
                return;
            }

            try {
                setUploading(true);

                const compressed = await compressImage(file, maxSizeMB)
                const fd = new FormData();
                fd.append("file", compressed);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Upload failed");

                onChange(data.url);
            } catch {
                toast.error("Upload failed");
            } finally {
                setUploading(false);
            }
        };
    }, [onChange, minWidth, minHeight, maxSizeMB]);

    return (
        <Dropzone
            accept={{ "image/*": [] }}
            maxFiles={1}
            onDrop={handleDrop}
            className={cn("relative flex h-[150px] w-full items-center justify-center overflow-hidden rounded-md border border-dashed", className)}
        >
            {/* LOADING */}
            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    Uploading...
                </div>
            )}

            {/* PREVIEW */}
            {!uploading && value && (
                <div className="absolute inset-0">
                    <Image
                        src={value}
                        alt="preview"
                        className="h-full w-auto object-contain mx-auto"
                        width={500}
                        height={500}
                    />

                    <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(null);
                        }}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white cursor-pointer"
                    >
                        <HugeiconsIcon icon={X} size={14} />
                    </div>
                </div>
            )}

            {/* EMPTY STATE */}
            {!uploading && !value && (
                <div className="text-center text-sm text-muted-foreground">
                    Drag & drop or click to upload
                </div>
            )}
        </Dropzone>
    );
}
