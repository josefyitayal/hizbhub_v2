import React from "react";
import ChannelList from "./_components/ChannelList";

type ChannelIdLayout = {
    children: React.ReactNode,
    params: Promise<{ channelId: string }>
}

export default async function ChannelIdLayout({ children, params }: ChannelIdLayout) {
    const { channelId } = await params

    return (
        <div className="flex h-full w-full min-h-0">
            <ChannelList />
            {children}
        </div>
    )
}
