import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isRpcUserCreate = createRouteMatcher(["/rpc/user/create", "/rpc/group/list/discover"]);
const isRpcOrApi = createRouteMatcher(["/rpc(.*)", "/api(.*)", "/trpc(.*)"]);
const isPublicPage = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/logout(.*)",
    "/",
    "/discover",
    "/onboarding(.*)",
    "/blog(.*)",
    "/affiliate",
]);

export default clerkMiddleware(async (auth, req) => {
    const { pathname, search } = req.nextUrl;
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    // 1. Immediate Allow: Public RPC calls
    if (isRpcUserCreate(req)) return NextResponse.next();

    // 2. Auth Protection: RPC/API routes (excluding those in step 1)
    if (isRpcOrApi(req)) {
        await auth.protect();
        return NextResponse.next();
    }

    // 3. Immediate Allow: Public Page routes
    if (isPublicPage(req)) return NextResponse.next();

    // 4. Authenticated Logic: Handle users not logged in
    if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url });
    }

    // 5. Onboarding Check: Preserve original destination
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;

    if (!onboardingComplete && pathname !== "/onboarding") {
        const onboardingUrl = new URL("/onboarding", req.url);
        // This preserves the page they were TRYING to go to
        onboardingUrl.searchParams.set("redirect_url", pathname + search);
        return NextResponse.redirect(onboardingUrl);
    }

    // 6. Final Pass: Inject path header for authenticated protected pages
    const headers = new Headers(req.headers);
    headers.set("x-current-path", pathname);

    return NextResponse.next({
        request: { headers },
    });
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
