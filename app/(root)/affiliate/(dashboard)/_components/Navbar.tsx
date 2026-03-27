"use client"

import Link from "next/link";
import {
    Menu,
    Package2,
} from "@hugeicons/core-free-icons"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import CopyLink from "./CopyLink";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useUser } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserDropdownMenu } from "@/app/(root)/g/[groupSlug]/_components/UserDropdownMenu";
import { Skeleton } from "@/components/ui/skeleton";

const links = [
    {
        label: "Dashboard",
        href: "/affiliate/dashboard"
    },
    {
        label: "Referrals",
        href: "/affiliate/referrals"
    },
    {
        label: "Payouts",
        href: "/affiliate/payouts"
    }
]

export function AffiliateNavbar() {
    const pathname = usePathname()
    const { user, isLoaded } = useUser()

    const { data } = useQuery({
        ...orpc.affiliate.list.core.queryOptions(),
        enabled: isLoaded && !!user,
    })

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/affiliate"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <HugeiconsIcon icon={Package2} className="h-6 w-6" />
                    <span className="sr-only">Hizbhub</span>
                </Link>
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={cn("transition-colors hover:text-foreground", link.href === pathname ? "text-foreground " : "text-muted-foreground")}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <HugeiconsIcon icon={Menu} className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <HugeiconsIcon icon={Package2} className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link href="/affiliate/dashboard" className="text-foreground hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link
                            href="/affiliate/referrals"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Referrals
                        </Link>
                        <Link
                            href="/affiliate/payouts"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Payouts
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    {data?.affiliate.referralCode ? (
                        <CopyLink value={`${process.env.NEXT_PUBLIC_SITE_URL}?ref=${data?.affiliate.referralCode}`} />
                    ) : (
                        <Skeleton className="w-full h-full rounded-lg max-w-md" />
                    )}
                </form>
                <UserDropdownMenu />
            </div>
        </header>
    )
}
