import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher([
    '/',
    
])

export default clerkMiddleware((auth, req) => {
    if(protectedRoutes(req)) auth().protect();

    publicRoutes: ["/api/uploadthing"]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};