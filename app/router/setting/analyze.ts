import z from "zod";
import db from "@/db/drizzle";
import { courseSubscriptions, groupSubscriptions, members } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, eq, gte, sql } from "drizzle-orm";

const listAnalyzeSettingsOutput = z.object({
    totalMembers: z.number(),
    totalRevenue: z.number(),
    newMembers: z.number(),
    courseSales: z.number(),
    revenueOverTime: z.array(
        z.object({
            month: z.string(),
            revenue: z.number(),
        })
    ),
    revenueBreakdown: z.array(
        z.object({
            name: z.string(),
            value: z.number(),
        })
    ),
});

export const listAnalyzeSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/analyze",
        method: "GET",
        summary: "get analyze settings",
        tags: ["analyzeSetting"],
    })
    .input(z.object({ groupId: z.string() }))
    .output(listAnalyzeSettingsOutput)
    .handler(async ({ input }) => {
        const { groupId } = input;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        /**
         * 1. Members
         */
        const [totalMembers, newMembers] = await Promise.all([
            db.$count(members, eq(members.groupId, groupId)),
            db.$count(
                members,
                and(eq(members.groupId, groupId), gte(members.createdAt, thirtyDaysAgo))
            ),
        ]);

        /**
         * 2. Revenue totals (DB aggregation)
         */
        const [groupRevenue, courseRevenue] = await Promise.all([
            db
                .select({
                    total: sql<number>`COALESCE(SUM(${groupSubscriptions.paidAmount}), 0)`,
                })
                .from(groupSubscriptions)
                .where(eq(groupSubscriptions.groupId, groupId)),

            db
                .select({
                    total: sql<number>`COALESCE(SUM(${courseSubscriptions.paidAmount}), 0)`,
                })
                .from(courseSubscriptions)
                .where(eq(courseSubscriptions.groupId, groupId)),
        ]);

        const membershipRevenue = groupRevenue[0].total;
        const courseSales = courseRevenue[0].total;
        const totalRevenue = membershipRevenue + courseSales;

        /**
         * 3. Monthly revenue (grouped in DB)
         */
        const monthlyGroupRevenue = await db
            .select({
                month: sql<number>`EXTRACT(MONTH FROM ${groupSubscriptions.createdAt})`,
                revenue: sql<number>`SUM(${groupSubscriptions.paidAmount})`,
            })
            .from(groupSubscriptions)
            .where(eq(groupSubscriptions.groupId, groupId))
            .groupBy(sql`EXTRACT(MONTH FROM ${groupSubscriptions.createdAt})`);

        const monthlyCourseRevenue = await db
            .select({
                month: sql<number>`EXTRACT(MONTH FROM ${courseSubscriptions.createdAt})`,
                revenue: sql<number>`SUM(${courseSubscriptions.paidAmount})`,
            })
            .from(courseSubscriptions)
            .where(eq(courseSubscriptions.groupId, groupId))
            .groupBy(sql`EXTRACT(MONTH FROM ${courseSubscriptions.createdAt})`);

        /**
         * 4. Merge monthly data (cheap in JS)
         */
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // 1. Initialize with an object structure for easier mapping
        const revenueMap = monthNames.map((name) => ({
            month: name,
            revenue: 0,
        }));

        // 2. Use a single loop style for all sources
        [...monthlyGroupRevenue, ...monthlyCourseRevenue].forEach(row => {
            const monthIndex = row.month - 1;
            if (revenueMap[monthIndex]) {
                revenueMap[monthIndex].revenue += row.revenue;
            }
        });

        const revenueOverTime = revenueMap;

        /**
         * 5. Revenue breakdown
         */
        const revenueBreakdown = [
            { name: "Membership Fees", value: membershipRevenue },
            { name: "Courses", value: courseSales },
        ];

        return {
            totalMembers,
            totalRevenue,
            newMembers,
            courseSales,
            revenueOverTime,
            revenueBreakdown,
        };
    });
