import { ScrollArea } from "@/components/ui/scroll-area";
import { LongDescription } from "./_components/LongDescription";
import { ShortDescription } from "./_components/ShortDescription";

export default function GroupAboutPage() {
    return (
        <ScrollArea className="flex-1 overflow-y-auto h-full">
            <div className="w-full flex flex-col lg:flex-row p-5 gap-5">
                <LongDescription />
                <ShortDescription />
            </div>
        </ScrollArea>
    )
}
