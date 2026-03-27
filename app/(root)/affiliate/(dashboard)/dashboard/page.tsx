"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, ArrowUpRight, CreditCard, DollarSign, Users } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { maskEmail } from "@/lib/maskEmail";
import { toast } from "sonner";

// --- LAZY LOAD HEAVY CHART ---
const AffiliateAreaChart = dynamic(() => import("../_components/AffiliateAreaChart"), {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full mt-4" />,
});

type ChartDataItem = {
    date: Date;
    value: number;
};

export default function AffiliateDashboardPage() {
    const { data, isLoading } = useQuery(orpc.affiliate.list.core.queryOptions());
    const [copied, setCopied] = useState(false);

    const stats = data?.stats
    const affiliate = data?.affiliate

    const chartData = useMemo<ChartDataItem[]>(() => {
        const commissions = affiliate?.commissions ?? [];
        if (!commissions.length) return [];

        // Aggregate by calendar day so the area chart has clean, stable points.
        const byDay = new Map<string, ChartDataItem>();

        for (const c of commissions) {
            const d = new Date(c.createdAt);
            if (Number.isNaN(d.getTime())) continue;

            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            const value = Number(c.commissionAmount) || 0;

            const existing = byDay.get(key);
            if (existing) {
                existing.value += value;
            } else {
                byDay.set(key, {
                    date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
                    value,
                });
            }
        }

        return Array.from(byDay.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [affiliate?.commissions]);

    const dummyData: { date: Date; value: number }[] = [
        { date: new Date("2024-01-01"), value: 500 },
        { date: new Date("2024-01-08"), value: 550 },
        { date: new Date("2024-01-15"), value: 490 },
        { date: new Date("2024-01-22"), value: 610 },
        { date: new Date("2024-01-29"), value: 780 },
        { date: new Date("2024-02-05"), value: 920 },
        { date: new Date("2024-02-07"), value: 92 },
        { date: new Date("2024-02-12"), value: 1150 },
        { date: new Date("2024-02-19"), value: 1080 },
        { date: new Date("2024-02-26"), value: 1300 },
        { date: new Date("2024-03-04"), value: 1540 },
        { date: new Date("2024-03-11"), value: 1890 },
        { date: new Date("2024-03-18"), value: 1720 },
        { date: new Date("2024-03-25"), value: 2100 },
        { date: new Date("2024-04-01"), value: 2350 },
        { date: new Date("2024-04-08"), value: 2200 },
        { date: new Date("2024-04-15"), value: 2680 },
        { date: new Date("2024-04-22"), value: 2900 },
        { date: new Date("2024-04-29"), value: 3150 },
        { date: new Date("2024-05-06"), value: 3000 },
        { date: new Date("2024-05-13"), value: 3450 },
    ];


    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="flex min-h-screen w-full flex-col gap-4 p-4 md:gap-8 md:p-8">

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Earned" value={stats?.totalEarned} suffix=" ETB" icon={CreditCard} subText="+19% from last month" />

                <StatCard title="Total Sales" value={stats?.totalSale} icon={DollarSign} subText="Awaiting clearance" />
                <StatCard title="Total Clicks" value={stats?.totalClicks} icon={Activity} subText="+20.1% from last month" />
                <StatCard title="Total Signups" value={stats?.totalSignups} prefix="+" icon={Users} subText="+180.1% from last month" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 flex-1">
                {/* Chart Section */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Earning Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AffiliateAreaChart data={chartData} />
                    </CardContent>
                </Card>

                {/* Table Section */}
                <div className="flex flex-col gap-4 h-full">
                    <Card >
                        <CardHeader >
                            <CardTitle>Discount Code</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <p>Code: {affiliate?.referralCode}</p>
                            <p>Audience Discount: {affiliate?.discountRate}%</p>
                            <p>Your commission: {affiliate?.commissionRate}%</p>
                        </CardContent>
                        <CardFooter className="border border-border">
                            <Button
                                disabled={copied}
                                onClick={async () => {
                                    if (affiliate?.referralCode) {
                                        try {
                                            await navigator.clipboard.writeText(affiliate?.referralCode);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        } catch (err) {
                                            toast.error("Faild to copy");
                                        }
                                    }
                                }}
                            >
                                {copied ? (
                                    "Code Copied"
                                ) : (
                                    "Copy Discount Code"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="flex-1">
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
