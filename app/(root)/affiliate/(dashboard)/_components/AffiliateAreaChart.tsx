"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import * as React from "react";
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
    value: {
        label: "Commission",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

type ChartDataItem = {
    date: Date;
    value: number;
};

function formatShortDate(value: unknown) {
    const d = value instanceof Date ? value : new Date(value as any);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLongDate(value: unknown) {
    const d = value instanceof Date ? value : new Date(value as any);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatETB(value: number) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
    }).format(value);
}

type AffiliateAreaChartProps = {
    data: ChartDataItem[];
};

export default function AffiliateAreaChart({ data }: AffiliateAreaChartProps) {
    const gradientId = React.useId().replace(/:/g, "");

    return (
        <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <defs>
                    <linearGradient
                        id={`affiliate-earnings-gradient-${gradientId}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
                    </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => formatShortDate(value)}
                />

                <YAxis
                    dataKey="value"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={70}
                    tickFormatter={(value) => `${formatETB(Number(value))}`}
                />

                <Tooltip
                    cursor={false}
                    content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;

                        const commission = Number(payload[0]?.value ?? 0);

                        return (
                            <div className="border-border/50 bg-background gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl grid min-w-36 items-start">
                                <div className="font-medium">{formatLongDate(label)}</div>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-[2px]"
                                            style={{ backgroundColor: "var(--color-value)" }}
                                        />
                                        <span className="text-muted-foreground">Commission</span>
                                    </div>
                                    <div className="text-foreground font-mono font-medium tabular-nums">
                                        {formatETB(commission)} ETB
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                />

                <Area
                    dataKey="value"
                    name="Commission"
                    type="monotone"
                    stroke="var(--color-value)"
                    fill={`url(#affiliate-earnings-gradient-${gradientId})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "var(--color-value)", stroke: "var(--color-value)" }}
                />
            </AreaChart>
        </ChartContainer>
    );
}
