import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getGroupColor } from "@/lib/generateGroupColor";
import { Group } from "@/db/schemas";


export function GroupItem({ group, groupSlug }: { group: Group, groupSlug: string }) {
    const isActive = groupSlug === group.slug;

    return (
        <Tooltip key={group.id}>
            <TooltipTrigger asChild>
                <Link
                    href={`/g/${group.slug}`}
                    className={cn(
                        "relative flex items-center justify-center size-10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        group.icon ? "bg-transparent" : getGroupColor(group.id), // Apply the background color
                        isActive ? "rounded-lg" : "rounded-xl hover:rounded-lg",

                        // --- ADDED STYLES FOR ACTIVE STATE ---
                        isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background", // Adds a floating border
                        isActive && "shadow-lg scale-105", // Optional: subtle scale up and shadow for "floating" effect
                    )}
                >
                    {group.icon ? (
                        <Image
                            src={group.icon}
                            alt="group-icon"
                            // Updated width/height to match size-10 (40px)
                            width={100}
                            height={100}
                            className={`object-cover size-full hover:rounded-lg ${isActive ? "rounded-lg" : "rounded-xl"}`}
                        />
                    ) : (
                        <span className="text-sm font-semibold text-white">
                            {group.title.charAt(0)}
                        </span>
                    )}
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{group.title} {isActive && "(current)"}</p>
            </TooltipContent>
        </Tooltip>
    );
}
