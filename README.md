type InitialGroupType = {
    group: GroupWithChannel;
    subscription: Subscription | null;
    isUserOwned: boolean;
};
type GroupWithChannel = Group & {
    memberCount: number;
    isMember: boolean;
    channels: Channel[];
};
const data: {
    group: {
        id: string;
        slug: string;
        title: string;
        titleSearch: string;
        description: string | null;
        ownerId: string;
        longDescription: string | null;
        icon: string | null;
        bannerImage: string | null;
        price: number | null;
        pricingEnabledAt: Date | null;
        phoneNumber: string | null;
        category: string[] | null;
        tags: string[] | null;
        private: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        channels: {
            id: string;
            groupId: string;
            name: string;
            postPermission: "all" | "admin";
            replayPermission: "all" | "admin";
            createdAt: Date;
            updatedAt: Date;
        }[];
        isMember: boolean;
        memberCount: string;
    };
    subscription: {
        ...;
    };
    isUserOwned: boolean;
}