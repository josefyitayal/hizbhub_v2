import { MembersList } from "./_components/MembersList";

export default function MembersPage() {
    return (
        <div className="px-36 py-5 flex flex-col gap-3">
            <div className="flex items-start my-3">
                <p>Members</p>
            </div>
            <MembersList />
        </div>
    )
}
