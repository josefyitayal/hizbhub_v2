"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, UserPlus, BookOpen } from "@hugeicons/core-free-icons";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend,
    CartesianGrid,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type AnalyzeSettingsProps = {
    groupId: string;
}

export function AnalyzeSettings({ groupId }: AnalyzeSettingsProps) {
    const { data, isLoading } = useQuery(
        orpc.settings.analyzeSettings.list.queryOptions({
            input: { groupId },
        })
    );

    if (isLoading || !data) {
        return (
            <div className="w-full flex items-center justify-center">
                <Spinner />
            </div>
        )
    }

    const {
        totalMembers,
        totalRevenue,
        newMembers,
        courseSales,
        revenueOverTime,
        revenueBreakdown,
    } = data;


    const areaChartConfig = {
        revenue: {
            label: "Revenue",
            color: "var(--chart-1)", // Uses the blue/primary color from your theme
        },
    } satisfies ChartConfig;

    // 1. Transform your dynamic data into the format the chart expects
    const pieChartData = revenueBreakdown.map((item, index) => ({
        name: item.name,
        value: item.value,
        // This uses the CSS variables defined in your global CSS (--chart-1, etc.)
        fill: `var(--chart-${(index % 5) + 1})`,
    }));

    // 2. Build the config object dynamically based on your data names
    const chartConfig = {
        value: {
            label: "Revenue",
        },
        ...Object.fromEntries(
            revenueBreakdown.map((item, index) => [
                item.name,
                {
                    label: item.name,
                    color: `var(--chart-${(index % 5) + 1})`,
                },
            ])
        ),
    } satisfies ChartConfig;

    const kpis = [
        {
            title: "Total Members",
            value: totalMembers,
            icon: Users,
        },
        {
            title: "Total Revenue",
            value: `ETB ${totalRevenue}`,
            icon: DollarSign,
        },
        {
            title: "New Members (30 days)",
            value: `+${newMembers}`,
            icon: UserPlus,
        },
        {
            title: "Course Sales",
            value: `ETB ${courseSales}`,
            icon: BookOpen,
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full">
                <p className="text-lg text-start pl-3 pb-2">Analyze</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((kpi) => (
                        <Card key={kpi.title} className="rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {kpi.title}
                                </CardTitle>
                                <HugeiconsIcon icon={kpi.icon} className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Over Time */}
                    <Card className="lg:col-span-2 rounded-2xl">
                        <CardHeader>
                            <CardTitle>Revenue Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={revenueOverTime} // Your dynamic data
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        // Formats "January" -> "Jan"
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Area
                                        dataKey="revenue" // Matches your 'revenue' property
                                        type="monotone"
                                        fill="var(--chart-1)" // Note: Shadcn uses var(--color-[key])
                                        fillOpacity={0.4}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue Breakdown */}
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Revenue Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto aspect-square h-full w-full"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={pieChartData}
                                        dataKey="value"  // Matches your property 'value'
                                        nameKey="name"   // Matches your property 'name'
                                        innerRadius={60}
                                        strokeWidth={5}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div >
        </div >
    );
}
