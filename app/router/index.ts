import { createAffilate, getCurrentUserAffiliateData, isUserJoinAffiliate } from "./affiliate";
import { getCommissionByAffiliateId } from "./affiliateCommission";
import { createChannel, deleteChannel, getChannelById } from "./channel";
import { createComment, getCommentsByPostId } from "./comment";
import { createCourse, deleteCourse, getCourseById, listCourses, updateCourse } from "./course";
import { checkCreatorCode } from "./createCode";
import { verifyDiscount } from "./discount";
import { addFolder, deleteFolder, renameFolder } from "./folder";
import { getGroupWithSlug, joinGroup, leaveGroup, listGroupInDiscover, userGroupInfo } from "./group";
import { createLike, deleteLike } from "./like";
import { listAllMembers } from "./member";
import { addPage, completePage, deletePage, renamePage, savePage } from "./pages";
import { creatingGroupPayment, payForCourse, payForJoiningGroup, startTrial } from "./payment";
import { listPlans } from "./plan";
import { createPost, deletePost, getPostByChannelId, pinPost } from "./post";
import { listGeneralSettings, updateGeneralSettings } from "./setting";
import { listAnalyzeSettings } from "./setting/analyze";
import { listBillingSettings } from "./setting/bill";
import { listChannelSettings, updateChannelSettings } from "./setting/channel";
import { listPaymentSettings, updatePaymentSettings } from "./setting/payment";
import { listPrivateSettings, updatePrivateSettings } from "./setting/private";
import { listSubscriptionSettings, updateSubscriptionSettings } from "./setting/subscription";
import { activateFullAccess } from "./subscription";
import { createUser } from "./user";

export const router = {
    user: {
        create: createUser
    },
    group: {
        list: {
            slug: getGroupWithSlug,
            userGroupInfo,
            discover: listGroupInDiscover,
        },
        joinGroup: joinGroup,
        leaveGroup: leaveGroup,
    },
    channel: {
        list: {
            byId: getChannelById,
        },
        create: createChannel,
        delete: deleteChannel,
    },
    post: {
        create: createPost,
        list: {
            byChannelId: getPostByChannelId,
        },
        delete: deletePost,
        pinPost: pinPost,
    },
    comment: {
        list: getCommentsByPostId,
        create: createComment,
    },
    like: {
        create: createLike,
        delete: deleteLike,
    },
    course: {
        list: {
            byGroupSlug: listCourses,
            byId: getCourseById,
        },
        create: createCourse,
        update: updateCourse,
        delete: deleteCourse,
        folder: { // Grouping folder actions
            add: addFolder,
            delete: deleteFolder,
            rename: renameFolder,
        },
        page: { // Grouping page actions
            add: addPage,
            delete: deletePage,
            rename: renamePage,
            complele: completePage,
            save: savePage,
        },
    },
    member: {
        list: {
            byGroupSlug: listAllMembers,
        }
    },
    settings: {
        generalSettings: {
            list: listGeneralSettings,
            update: updateGeneralSettings,
        },
        paymentSettings: {
            list: listPaymentSettings,
            update: updatePaymentSettings,
        },
        subscriptionSettings: {
            list: listSubscriptionSettings,
            update: updateSubscriptionSettings,
        },
        privateSettings: {
            list: listPrivateSettings,
            update: updatePrivateSettings,
        },
        channelSettings: {
            list: listChannelSettings,
            update: updateChannelSettings,
        },
        billingSettings: {
            list: listBillingSettings
        },
        analyzeSettings: {
            list: listAnalyzeSettings,
        }
    },
    plan: {
        list: listPlans
    },
    subscription: {
        activateFullAccess: activateFullAccess,
    },
    affiliate: {
        create: createAffilate,
        list: {
            core: getCurrentUserAffiliateData,
        },
        isUserJoinAffiliate: isUserJoinAffiliate,
    },
    commission: {
        list: {
            byAffiliateId: getCommissionByAffiliateId,
        }
    },
    creatorCode: {
        check: checkCreatorCode
    },
    payment: {
        creatingGroup: creatingGroupPayment,
        startTrial,
        joiningGroup: payForJoiningGroup,
        course: payForCourse,
    },
    discount: {
        verify: verifyDiscount,
    },
}
