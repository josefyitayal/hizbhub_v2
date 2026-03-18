"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import clsx from "clsx"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { z } from "zod"
import { useCurrentGroupQuery } from "../hooks/useCurrentGroupQuery"
import { GeneralSetting } from "./tabs/general"
import { PaymentSettings } from "./PaymentSettings"
import { SubscriptionSettings } from "./SubscriptionSettings"
import { InviteSettings } from "./InviteSettings"
import { PrivateSettings } from "./PrivateSettings"
import { ChannelsSettings } from "./ChannelsSettings"
import { BillingSettings } from "./BillingSettings"
import { AnalyzeSettings } from "./AnalyzeSettings"
import { ChartArea, CreditCardIcon, Invoice01Icon, LicenseIcon, MegaphoneIcon, Settings02Icon, StarsIcon, UserPlus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ScrollArea } from "@/components/ui/scroll-area"

export const TABS = [
    {
        icon: Settings02Icon,
        label: "General"
    },
    {
        icon: StarsIcon,
        label: "Subscription"
    },
    {
        icon: CreditCardIcon,
        label: "Payment"
    },
    {
        icon: UserPlus,
        label: "Invite"
    },
    {
        icon: LicenseIcon,
        label: "Private"
    },
    {
        icon: MegaphoneIcon,
        label: "Channels"
    },
    {
        icon: Invoice01Icon,
        label: "Billing"
    },
    {
        icon: ChartArea,
        label: "Analyze"
    }
];

type SettingsProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tab: string;
    setTab: React.Dispatch<React.SetStateAction<string>>;
}

export function Settings({ isOpen, setIsOpen, tab, setTab }: SettingsProps) {

    const { data: { group } } = useCurrentGroupQuery()

    // Update hash on tab change
    const updateHash = (t: string) => {
        window.location.hash = `settings/${t}`
        setTab(t.toLowerCase())
    }

    return (
        <>
            <div className="flex h-full w-full overflow-hidden">
                {/* Sidebar */}
                <div
                    className="w-56 h-full border-r border-border bg-sidebar p-3 flex flex-col gap-1 sticky left-0 top-0"
                >
                    <p className="text-lg font-semibold text-center my-3">Settings</p>
                    {TABS.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => updateHash(item.label)}
                            className={clsx(
                                "text-left px-3 py-2 flex items-center gap-3 rounded-md transition-all",
                                tab === item.label.toLowerCase()
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-muted"
                            )}
                        >
                            <HugeiconsIcon icon={item.icon} size={20} />
                            {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="flex-1 h-full min-h-0 p-6 bg-background">
                        {tab === "general" && <GeneralSetting groupId={group.id} />}
                        {tab === "payment" && <PaymentSettings groupId={group.id} />}
                        {tab === "subscription" && <SubscriptionSettings groupId={group.id} phoneNumber={group.phoneNumber} memberCount={group.memberCount} />}
                        {tab === "invite" && <InviteSettings groupSlug={group.slug} />}
                        {tab === "private" && <PrivateSettings groupId={group.id} />}
                        {tab === "channels" && <ChannelsSettings group={{ id: group.id, slug: group.slug }} />}
                        {tab === "billing" && <BillingSettings group={{ id: group.id, slug: group.slug }} />}
                        {tab === "analyze" && <AnalyzeSettings groupId={group.id} />}
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}

