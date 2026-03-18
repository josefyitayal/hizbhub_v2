"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
    value: {
        label: "Count",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

type ChartDataItem = {
    date: Date;
    value: number;
};

type AffiliateAreaChartProps = {
    data: ChartDataItem[];
};

export default function AffiliateAreaChart({ data }: AffiliateAreaChartProps) {
    return (
        <ChartContainer config={chartConfig}>
            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })
                    }
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            indicator="dot"
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                        />
                    }
                />
                <Area
                    dataKey="value"
                    type="monotone"
                    dot
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.35}
                />
            </AreaChart>
        </ChartContainer>
    );
}
