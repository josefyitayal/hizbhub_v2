import { StopCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function UnavailableGroup() {
    return (
        <div className="flex flex-col h-full items-center justify-center py-12 px-6 text-center">
            {/* Visual Alert Icon */}
            <div className="relative mb-8">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />

                {/* Icon Shield */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-amber-500/20 bg-zinc-950 shadow-2xl">
                    <div className="absolute inset-0 bg-amber-500/5 rounded-[2rem]" />
                    <HugeiconsIcon
                        icon={StopCircleIcon}
                        className="h-12 w-12 text-amber-500"
                    />
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-sm space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Access Temporarily Suspended
                </h2>

                <p className="text-[15px] leading-relaxed text-zinc-400">
                    The trial period for this community has concluded. To restore access for all members and resume operations, the owner must <span className="text-zinc-200 font-medium">upgrade to a professional plan.</span>
                </p>
            </div>

            {/* Informational Footer (Dialog Bottom) */}
            <div className="mt-10 w-fit space-y-3">
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                    <div className="flex items-center gap-3 text-left">
                        <div className="h-2 w-2 rounded-full bg-zinc-600 animate-pulse" />
                        <p className="text-xs text-zinc-500 font-medium leading-tight">
                            All community data, courses, and member records are securely preserved and will be instantly available upon reactivation.
                        </p>
                    </div>
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
                    Awaiting Administrator Action
                </p>
            </div>
        </div>
    );
}
