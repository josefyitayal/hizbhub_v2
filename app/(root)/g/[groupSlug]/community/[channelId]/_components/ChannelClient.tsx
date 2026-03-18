"use client";

import { useSearchParams } from "next/navigation";
import { PostDialog } from "./PostDialog";

export default function ChannelClient({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const activePostId = searchParams.get("p");

    return (
        <>
            {children}
            {activePostId && <PostDialog postId={activePostId} />}
        </>
    );
}
