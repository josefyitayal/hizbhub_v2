"use client"

import { updateProfilePicture } from "@/actions/updateProfilePicture";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import db from "@/db/drizzle";
import { users } from "@/db/schemas";
import { compressImage } from "@/lib/compressImage";
import { useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
    value: string;
    setValue: Dispatch<SetStateAction<string | null>>;
    id?: string;
}

export const ProfilePictureUpload = ({ value, setValue, id }: ProfilePictureUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const { user, isLoaded } = useUser();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()

        const file = event.target.files?.[0];
        if (!file || !isLoaded || !user) return;

        const minWidth = 400
        const minHeight = 400
        const maxSizeMB = 1

        // 1. Quick Dimension Check (Smart way: wrap in a promise)
        const isValidDimension = await new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const valid = img.width >= minWidth && img.height >= minHeight;
                URL.revokeObjectURL(img.src); // Cleanup memory!
                resolve(valid);
            };
        });

        if (!isValidDimension) {
            toast.error(`Image must be at least ${minWidth}x${minHeight}px`);
            return;
        }

        try {
            setUploading(true);

            // 2. Fast Compression
            const compressedBlob = await compressImage(file, maxSizeMB);

            // 3. Smartest Way: Update Clerk directly from Client
            // This is faster because it's one less hop to your server
            const result = await user.setProfileImage({
                file: compressedBlob
            });

            // 4. Update your local DB via an API or Server Action
            // Clerk returns the new URL in result.publicUserData.imageUrl
            const newUrl = result.publicUrl;

            await updateProfilePicture(user.id, newUrl);

            setValue(newUrl);
            toast.success("Profile picture updated!");
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                const clerkError = error.errors[0];

                // we throw Unsupported image is the error is related to clerk
                // TODO: we need to handle this error
                toast.error("Unsupported Image Type.");
                return;
            }

            // 2. Generic fallback only if it's NOT a handled Clerk error
            toast.error("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        }
    };

    return (
        <div className='flex items-center gap-3'>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <Avatar size='lg' className={uploading ? "opacity-50 animate-pulse" : ""}>
                <AvatarImage src={value} />
                <AvatarFallback>P.P</AvatarFallback>
            </Avatar>
            <Button
                variant="secondary"
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading ? "Uploading..." : "Upload"}
            </Button>
        </div>
    )
}
