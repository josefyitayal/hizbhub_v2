"use server"

import db from "@/db/drizzle"
import { affiliates, discountCodes, linkClicks, users } from "@/db/schemas"
import { auth } from "@clerk/nextjs/server"
import { and, eq, gt } from "drizzle-orm"
import { cookies, headers } from "next/headers"
import { userAgent } from "next/server"

export const registerAffiliate = async (ref: string) => {
    // 1. Basic Validation
    if (!ref) return { success: false, message: "there is not ref passed" };


    // 2. Fetch the affiliate and their owner ID
    const dbAffiliate = await db.query.affiliates.findFirst({
        where: eq(affiliates.referralCode, ref),
        with: {
            discountCodes: {
                where: eq(discountCodes.active, true)
            }
        }
    });

    if (!dbAffiliate) return { success: false, message: "No affiliate found" };

    const activeDiscount = dbAffiliate.discountCodes;

    // 3. SELF-REFERRAL PREVENTION
    // Get the currently logged-in user
    const { userId: currentClerkId } = await auth();

    // If the user is logged in, check if they are the owner of this affiliate link
    if (currentClerkId) {
        const currentUser = await db.query.users.findFirst({
            where: eq(users.clerkId, currentClerkId)
        });

        // If the logged-in user IS the affiliate, stop here.
        if (currentUser && currentUser.id === dbAffiliate.userId) {
            return { success: false, message: "You cannot use your own referral link" };
        }
    }

    // 4. BOT & SPAM FILTERING
    const headerStore = await headers();
    const userAgentString = headerStore.get('user-agent') || '';
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgentString);

    if (isBot) return { success: false, message: "Bot click ignored" };

    // 5. SET THE COOKIE (Last-Click Wins)
    const cookieStore = await cookies();
    cookieStore.set("hizb_affiliate", JSON.stringify({
        slug: dbAffiliate.referralCode,
        id: dbAffiliate.id,
        ownerId: dbAffiliate.userId,
        autoCode: activeDiscount[0]?.code ?? null
    }), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    // 6. LOG THE CLICK
    const { device, browser, os } = userAgent({ headers: headerStore });
    const ip = headerStore.get('x-forwarded-for')?.split(',')[0] || 'Unknown';

    // Inside registerAffiliate
    const [recentClick] = await db.select()
        .from(linkClicks)
        .where(
            and(
                eq(linkClicks.ipAddress, ip),
                eq(linkClicks.affiliateId, dbAffiliate.id),
                gt(linkClicks.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24h
            )
        );

    if (!recentClick) {
        // Log the click...
        await db.insert(linkClicks).values({
            affiliateId: dbAffiliate.id,
            ipAddress: ip,
            userAgent: JSON.stringify({ device, browser, os }),
            referralCode: dbAffiliate.referralCode,
        });
    }

    return { success: true, message: "Affiliate register successfully" };
}
