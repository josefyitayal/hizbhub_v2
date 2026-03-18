export const dynamic = "force-dynamic";
import { GroupProvider } from "./_components/context/GroupContext";
import { GroupListSidebar } from "./_components/GroupListSidebar";
import { GroupHeader } from "./_components/GroupHeader";
import { getQueryClient } from "@/lib/get-query-client";
import { orpc } from "@/lib/orpc";
import { HydrateClient } from "@/lib/query/hydration";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { TrialEndDialog } from "./_components/TrialEndDialog";
import { TrialBanner } from "./_components/TrialBanner";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface GroupLayoutProps {
    children: React.ReactNode,
    params: Promise<{ groupSlug: string }>;
}

export default async function GroupLayout({ children, params }: GroupLayoutProps) {
    const { groupSlug } = await params;
    const queryClient = getQueryClient();
    const headerList = await headers();
    const pathname = headerList.get("x-current-path");

    // 1. Declare variables outside the try block so they are accessible below
    let data;
    let trialEnded = false;
    let subscriptionEnded = false;
    let daysLeft = 0;
    let progress = 0;

    try {
        data = await queryClient.fetchQuery(
            orpc.group.list.slug.queryOptions({ input: { groupSlug } })
        );

        const isAboutPage = `/g/${groupSlug}` === pathname;

        if (!data.group.isMember && !isAboutPage) {
            redirect(`/g/${groupSlug}/`);
        }

        const now = new Date();
        const start = new Date(data.subscription.startDate);
        const end = new Date(data.subscription.endDate);

        const totalDuration = end.getTime() - start.getTime();
        const remainingTime = Math.max(0, end.getTime() - now.getTime());
        daysLeft = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        progress = Math.max(0, Math.min(100, (remainingTime / totalDuration) * 100));

        if (data.subscription.status === "trial" && now >= end) {
            trialEnded = true;
        } else if (data.subscription.status === "active" && now >= end) {
            subscriptionEnded = true;
        }

    } catch (err) {
        if (isRedirectError(err)) throw err;

        redirect(notFound());
    }

    console.log(data.group.isMember, "asdddddd")

    // 4. Now 'data' and other flags are accessible here
    return (
        <GroupProvider initialGroup={data}>
            <HydrateClient client={queryClient}>
                <div className="flex h-screen w-full overflow-hidden bg-background">
                    <aside className="shrink-0 bg-sidebar border-r border-border flex-col items-center py-3 px-2 ">
                        <GroupListSidebar groupSlug={groupSlug} />
                    </aside>

                    <main className="flex flex-1 flex-col min-w-0 min-h-0">
                        {trialEnded || subscriptionEnded ? (
                            <TrialEndDialog
                                open={true}
                                purpose={data.isUserOwned ? "owner" : "member"}
                                subscriptionType={subscriptionEnded ? 'subscription' : 'trial'}
                            />
                        ) : (
                            <>
                                <header className="flex items-center shrink-0">
                                    <GroupHeader />
                                </header>
                                <div className="flex-1 w-full min-h-0 overflow-hidden">
                                    {children}
                                </div>
                            </>
                        )}
                    </main>

                    {data.isUserOwned && (
                        (data.subscription.status === "trial" && !trialEnded) ||
                        (data.subscription.status === "active" && daysLeft <= 3)
                    ) && (
                            <TrialBanner
                                subscriptionType={data.subscription.status === "active" ? "subscription" : "trial"}
                                daysLeft={daysLeft}
                                progress={progress}
                            />
                        )}
                </div>
            </HydrateClient>
        </GroupProvider>
    );
}
