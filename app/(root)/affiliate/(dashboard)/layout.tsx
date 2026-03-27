import db from "@/db/drizzle";
import { AffiliateNavbar } from "./_components/Navbar";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { affiliates, users } from "@/db/schemas";
import { redirect } from "next/navigation";

export default async function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-up")
    }
    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
    })
    if (!dbUser) {
        redirect("/sign-up")
    }
    const dbAffiliate = await db.query.affiliates.findFirst({
        where: eq(affiliates.userId, dbUser.id)
    })
    if (!dbAffiliate) {
        redirect("/discover")
    }
    return (
        <div>
            <AffiliateNavbar />
            {children}
        </div>
    )
}
