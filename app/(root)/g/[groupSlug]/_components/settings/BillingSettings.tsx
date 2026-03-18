"use client"

import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { intervalToDuration, formatDuration } from 'date-fns';
import { CircleDot } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

type BillingSettingsProps = {
    group: { id: string; slug: string };
}

export function BillingSettings({ group }: BillingSettingsProps) {
    const { data: billingSettingData, isLoading } = useQuery(
        orpc.settings.billingSettings.list.queryOptions({ input: { groupId: group.id } })
    );

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full">
                <p className="text-lg text-start pl-3 pb-2">Billing</p>
            </div>

            <Separator />
            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold">Current plan</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">{billingSettingData?.plan.name}</p>
                                <p className="text-muted-foreground">{billingSettingData?.plan.name} subscription plan active since {dayjs(billingSettingData?.subscription.at(-1)?.startDate).format('YYYY, D MMM')}</p>
                            </div>
                            <p className="text-2xl font-bold">{billingSettingData?.plan.price}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Plan benefits</p>
                        <ul className="mt-2 pl-3 space-y-4 text-muted-foreground tracking-wide">
                            <li className="flex items-center gap-2"><HugeiconsIcon icon={CircleDot} /> Unlimited product uploads</li>
                            <li className="flex items-center gap-2"><HugeiconsIcon icon={CircleDot} /> Customizable store theme</li>
                            <li className="flex items-center gap-2"><HugeiconsIcon icon={CircleDot} /> Analytics dashboard</li>
                            <li className="flex items-center gap-2"><HugeiconsIcon icon={CircleDot} /> 24/7 support</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Previouse invoices</p>
                        <div>
                            <Table>
                                <TableCaption>recent invoices</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Id</TableHead>
                                        <TableHead>Due date</TableHead>
                                        <TableHead>Period interval</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Invoice amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {billingSettingData?.subscription.map((subscription) => {
                                        const start = new Date(subscription.startDate)
                                        const end = new Date(subscription.endDate)
                                        const duration = intervalToDuration({ start, end });
                                        const humanReadable = formatDuration(duration);
                                        return (
                                            <TableRow key={subscription.id}>
                                                <TableCell className="font-medium">{subscription.id}</TableCell>
                                                <TableCell>{dayjs(subscription.endDate).format("MMM D, YYYY")}</TableCell>
                                                <TableCell>{humanReadable}</TableCell>
                                                <TableCell>{subscription.status}</TableCell>
                                                <TableCell className="text-right">{subscription.amount}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
