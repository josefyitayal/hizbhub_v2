import { Suspense } from "react";
import { PostInput } from "./_components/PostInput"
import { PostSection } from "./_components/PostSection"
import ChannelClient from "./_components/ChannelClient";

type PostContainerProps = {
    params: Promise<{ channelId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChannelIdPage({ params, searchParams }: PostContainerProps) {
    const { channelId } = await params

    return (
        <ChannelClient>
            <div className="flex-1 min-w-0 h-full overflow-y-auto p-5 flex flex-col items-center gap-5 bg-background">
                <Suspense fallback={<div>Loading...</div>}>
                    <PostInput />
                </Suspense>

                <div className="flex w-full">
                    <p className="text-muted-foreground">Posts</p>
                </div>

                <PostSection channelId={channelId} />
            </div>
        </ChannelClient>
    )
}
