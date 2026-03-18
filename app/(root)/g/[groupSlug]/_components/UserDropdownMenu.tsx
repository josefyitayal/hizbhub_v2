"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getAvatar } from "@/lib/get-avatar"
import { orpc } from "@/lib/orpc"
import { useUser } from "@clerk/nextjs"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"

export function UserDropdownMenu() {
    const router = useRouter()
    const pathname = usePathname()

    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

    const { data: affiliate, isLoading: isAffiliateLoading } = useQuery({
        ...orpc.affiliate.isUserJoinAffiliate.queryOptions(),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: isClerkLoaded && !!clerkUser,
    });

    if (!isClerkLoaded || isAffiliateLoading) {
        return <Skeleton className="rounded-full size-11" />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <img src={getAvatar(clerkUser?.imageUrl ?? "", clerkUser?.emailAddresses[0].emailAddress ?? "")} alt="user" width={24} height={24} className="rounded-full size-9 object-cover" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side={pathname.startsWith("/affiliate") ? "bottom" : "right"} sideOffset={8} className="w-[200px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => router.push(`/user`)}
                    >
                        {clerkUser?.emailAddresses[0].emailAddress}
                    </Button>
                </DropdownMenuItem>
                {affiliate && (
                    <DropdownMenuItem asChild>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => router.push(`${pathname.startsWith('/affiliate') ? '/discover' : '/affiliate/dashboard'}`)}
                        >
                            {pathname.startsWith("/affiliate") ? (
                                "discover"
                            ) : (
                                "Affiliate"
                            )}
                        </Button>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="w-full">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => window.location.href = "/logout"}
                    >
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
