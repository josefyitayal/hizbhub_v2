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
import { useUser } from "@clerk/nextjs";
import { skipToken, useQuery, useSuspenseQuery } from "@tanstack/react-query";

export default function AffiliateReferralsPage() {
    const { isLoaded, user } = useUser()

    const clerkId = isLoaded ? user?.id ?? null : null

    const { data } = useSuspenseQuery(orpc.affiliate.list.core.queryOptions());

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
                                {commissions?.map((comm) => (
                                    <TableRow key={comm.id}>
                                        <TableCell className="flex-1">
                                            <div className="font-medium">{maskEmail(comm.buyerUser?.email!)}</div>
                                        </TableCell>
                                        <TableCell className="">{comm.group.title}</TableCell>
                                        <TableCell className="">{comm.billingCycle}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{comm.status}</Badge>
                                        </TableCell>
                                        <TableCell className="">{comm.finalPaidAmount}</TableCell>
                                        <TableCell className="">{comm.commissionAmount}</TableCell>
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
