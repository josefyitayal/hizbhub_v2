"use client";

import {
    DollarSign,
} from "@hugeicons/core-free-icons"
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
import { orpc } from "@/lib/orpc";
import { useUser } from "@clerk/nextjs";
import { skipToken, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { HugeiconsIcon } from "@hugeicons/react";

export default function AffiliatePayoutsPage() {
    const { isLoaded, user } = useUser()

    const clerkId = isLoaded ? user?.id ?? null : null

    const { data, isLoading } = useSuspenseQuery(orpc.affiliate.list.core.queryOptions());

    const affiliateId = data?.affiliate?.id

    const { data: commissions } = useQuery(
        orpc.commission.list.byAffiliateId.queryOptions({
            input: affiliateId
                ? { affiliateId }
                : skipToken, // ✅ THIS is the missing piece
        })
    )

    if (!isLoaded) {
        return <div>Loading</div>
    }

    if (!data?.affiliate) {
        return <div>No affiliate data</div>
    }

    const money = {
        pending: 0,   // Status: PENDING
        alreadyPaid: 0, // Status: PAID
    };

    commissions?.forEach((row) => {
        const amount = Number(row?.commissionAmount) || 0;

        if (row.status === "PENDING") {
            money.pending = amount;
        } else if (row.status === "PAID") {
            money.alreadyPaid += amount;
        }
    });

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Payouts
                            </CardTitle>
                            <HugeiconsIcon icon={DollarSign} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{money.alreadyPaid}</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Payouts
                            </CardTitle>
                            <HugeiconsIcon icon={DollarSign} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{money.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting clearance
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Payouts</CardTitle>
                            <CardDescription>
                                Here are all your payouts.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {commissions?.map((comm) => (
                                    <TableRow key={comm.id}>
                                        <TableCell>
                                            <div className="font-medium">{dayjs(comm?.createdAt).format('MMMM D, YYYY')}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{comm.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{comm.commissionAmount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
