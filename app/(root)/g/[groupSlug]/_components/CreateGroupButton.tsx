"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export function CreateGroupButton() {
    const router = useRouter()

    return (
        <>
            <Button variant="ghost" onClick={() => router.push("/create-group")} className="bg-sidebar-accent relative flex items-center justify-center size-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <HugeiconsIcon icon={Plus} />
            </Button>
        </>
    )
}
