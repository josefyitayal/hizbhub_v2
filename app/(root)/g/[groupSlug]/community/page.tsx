import { redirect } from "next/navigation"
import { orpc } from "@/lib/orpc"
import { getQueryClient } from "@/lib/get-query-client";

export default async function CommunityPage({ params }: { params: Promise<{ groupSlug: string }> }) {
    const { groupSlug } = await params;
    const queryClient = getQueryClient();

    const { group } = await queryClient.fetchQuery(
        orpc.group.list.slug.queryOptions({ input: { groupSlug } })
    );

    const firstChannelId = group.channels[0].id

    if (firstChannelId) {
        return redirect(`/g/${groupSlug}/community/${firstChannelId}`);
    }

    return <div>No channels found.</div>;
}
