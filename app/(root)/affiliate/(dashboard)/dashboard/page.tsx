"use client";

import { JSX, useMemo } from "react";
import dynamic from "next/dynamic";
import { Activity, ArrowUpRight, CreditCard, DollarSign, Users } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { buildTimeSeries } from "@/lib/chartDateHelper";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { maskEmail } from "@/lib/maskEmail";
// import AffiliateAreaChart from "../_components/AffiliateAreaChart";

// --- LAZY LOAD HEAVY CHART ---
const AffiliateAreaChart = dynamic(() => import("../_components/AffiliateAreaChart"), {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full mt-4" />,
});

export default function AffiliateDashboardPage() {
    const { data, isLoading } = useQuery(orpc.affiliate.list.core.queryOptions());

    const stats = data?.stats
    const affiliate = data?.affiliate
    const discountCode = data?.discountCode

    const realChartData = affiliate?.commissions.map((c) => ({
        date: c.createdAt,
        value: c.commissionAmount // Replace with your actual amount field name
    })) || [];

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Earned" value={stats?.totalEarned} suffix=" ETB" icon={CreditCard} subText="+19% from last month" />

                    <StatCard title="Total Sales" value={stats?.totalSale} icon={DollarSign} subText="Awaiting clearance" />
                    <StatCard title="Total Clicks" value={stats?.totalClicks} icon={Activity} subText="+20.1% from last month" />
                    <StatCard title="Total Signups" value={stats?.totalSignups} prefix="+" icon={Users} subText="+180.1% from last month" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Chart Section */}
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Earning Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AffiliateAreaChart data={realChartData} />
                        </CardContent>
                    </Card>

                    {/* Table Section */}
                    <div className="flex flex-col gap-4 h-full">
                        <Card >
                            <CardHeader >
                                <CardTitle>Discount Code</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p>Code: {affiliate?.referralCode}</p>
                                <p>Audience Discount: {affiliate?.discountRate}%</p>
                                <p>Your commission: {affiliate?.commissionRate}%</p>
                            </CardContent>
                        </Card>

                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center">
                                <div className="grid gap-1">
                                    <CardTitle>Recent Referrals</CardTitle>
                                    <CardDescription>Recent signups from your links.</CardDescription>
                                </div>
                                <Button asChild size="sm" className="ml-auto gap-1">
                                    <Link href="/affiliate/referrals">
                                        View All <HugeiconsIcon icon={ArrowUpRight} className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="border-border">
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead className="text-right">Commission</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {affiliate?.commissions?.map((referral) => (
                                            <TableRow key={referral.id}>
                                                <TableCell>
                                                    <div className="font-medium">{maskEmail(referral.buyerUser.email)}</div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">{referral.commissionAmount} ETB</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

type StatCardType = {
    title: string,
    value: number | undefined,
    icon: IconSvgElement,
    className?: string | undefined
    subText: string,
    prefix?: string,
    suffix?: string,
}
// Reusable Stat Card to keep code clean
function StatCard({ title, value, icon, subText, prefix = "", suffix = "" }: StatCardType) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <HugeiconsIcon icon={icon} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{prefix}{value ?? 0}{suffix}</div>
                <p className="text-xs text-muted-foreground">{subText}</p>
            </CardContent>
        </Card>
    );
}

// Loading Skeleton to prevent layout shift
function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
                <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
                <Skeleton className="h-[400px] rounded-xl" />
            </div>
        </div>
    );
}
