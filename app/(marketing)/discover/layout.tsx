import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Discover Communities to Join | Hizbhub",
    description: "Explore and join communities on Hizbhub. Find groups, courses, and creators in Ethiopia.",
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}