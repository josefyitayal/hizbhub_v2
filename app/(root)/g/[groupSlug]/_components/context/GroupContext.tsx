"use client";

import { Channel, Group, Subscription } from "@/db/schemas";
import React, { createContext, useContext, useMemo, useState } from "react";

// 1. Define your composite types
type GroupWithChannel = Group & {
    memberCount: string;
    isMember: boolean;
    channels: Channel[];
};

type InitialGroupType = {
    group: GroupWithChannel;
    subscription: Subscription | null;
    isUserOwned: boolean;
};

interface GroupProviderProps {
    children: React.ReactNode;
    initialGroup: InitialGroupType;
}
type GroupContextType = InitialGroupType & {
    currentChannel: Channel | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<Channel | null>>;
};

// 2. Create the context using the flat type
const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children, initialGroup }: GroupProviderProps) {
    // We initialize state with the data passed from the Server Component
    const [groupData] = useState<InitialGroupType>(initialGroup);
    const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

    const providerValue = useMemo(() => ({
        ...groupData,
        currentChannel,
        setCurrentChannel
    }), [groupData, currentChannel]);

    return (
        // Pass the object directly (no extra wrapping)
        <GroupContext.Provider
            value={providerValue}
        >
            {children}
        </GroupContext.Provider>
    );
}

// 3. Simple hook for usage
export function useGroup() {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error("useGroup must be used within a GroupProvider");
    }
    return context;
}
