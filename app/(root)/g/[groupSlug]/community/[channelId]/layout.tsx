import React from "react";
import ChannelList from "./_components/ChannelList";

type ChannelIdLayout = {
    children: React.ReactNode,
}

export default async function ChannelIdLayout({ children }: ChannelIdLayout) {
    return (
        <div className="flex h-full w-full min-h-0">
            <ChannelList />
            {children}
        </div>
    )
}
