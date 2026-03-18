import { StopCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function UnavailableGroup() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
            <p className="text-3xl text-center">This group is not available</p>
            <p className="text-muted-foreground text-center">trial has ended. The owner needs to upgrade before members can continue</p>
            <HugeiconsIcon icon={StopCircleIcon} className="size-32" />
        </div>
    )
}
