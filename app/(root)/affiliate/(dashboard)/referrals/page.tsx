"use client";

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { maskEmail } from "@/lib/maskEmail";
import { orpc } from "@/lib/orpc";
import { skipToken, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton"

export function TableLoadingSkeleton() {
    return (
        <>
            {/* Generate 5 skeleton rows */}
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[60px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[50px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[50px]" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export default function AffiliateReferralsPage() {
    const { data } = useSuspenseQuery(orpc.affiliate.list.core.queryOptions());

    const affiliateId = data?.affiliate?.id

    const { data: commissions } = useQuery(
        orpc.commission.list.byAffiliateId.queryOptions({
            input: affiliateId
                ? { affiliateId }
                : skipToken, // ✅ THIS is the missing piece
        })
    )

    if (!data?.affiliate) {
        return <div>No affiliate data</div>
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Referrals</CardTitle>
                            <CardDescription>
                                Here are all the users you&apos;ve referred.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="flex-1">User</TableHead>
                                    <TableHead>Group</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Paid</TableHead>
                                    <TableHead className="">Commission</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* 1. LOADING STATE */}
                                {commissions === undefined ? (
                                    <TableLoadingSkeleton />
                                ) : /* 2. EMPTY STATE */
                                    commissions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                No commissions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        /* 3. DATA STATE */
                                        commissions.map((comm) => (
                                            <TableRow key={comm.id}>
                                                <TableCell className="font-medium">{maskEmail(comm.buyerUser?.email!)}</TableCell>
                                                <TableCell>{comm.group.title}</TableCell>
                                                <TableCell>{comm.billingCycle}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{comm.status}</Badge>
                                                </TableCell>
                                                <TableCell>{comm.finalPaidAmount}</TableCell>
                                                <TableCell>{comm.commissionAmount}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
