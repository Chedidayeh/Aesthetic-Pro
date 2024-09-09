'use server'

import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
DEFAULT_LOGIN_REDIRECT,
adminAuthRoutes,
apiAuthPrefix,
authRoutes,
createSstoreRoute,
factoryAuthRoutes,
privateRoutes,
sellerAuthRoutes,
sellerSignOutRoute,
signOutRoute,
alreadyVerifiedUser,
alreadyResetPassword,
googleAuthRoute
}from "@/routes"

import { auth as a } from '@/auth'
const {auth} = NextAuth(authConfig);
export default auth (async (req) => {

    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    const session = await a()
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isAlreadyVerifiedUserRoute = nextUrl.pathname.startsWith(alreadyVerifiedUser)
    const isAlreadyResetPasswordRoute = nextUrl.pathname.startsWith(alreadyResetPassword)
    const isSellerRoute = nextUrl.pathname.startsWith(sellerAuthRoutes);
    const isAdminRoute = nextUrl.pathname.startsWith(adminAuthRoutes);
    const isFactoryRoute = nextUrl.pathname.startsWith(factoryAuthRoutes);
    const isLogOutRoute = signOutRoute.includes(nextUrl.pathname)
    const issellerLogOutRoute = sellerSignOutRoute.includes(nextUrl.pathname)
    const isGoogleAuthRoute = googleAuthRoute.startsWith(nextUrl.pathname)
    const isCreateStoreRoute = nextUrl.pathname.startsWith(createSstoreRoute);


    // block if the user try to access to api routes 
    // if (isApiAuthRoute){
    //     if(isLogOutRoute || issellerLogOutRoute || isGoogleAuthRoute  ){
    //         return
    //     }
    //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
    // }

    // block if a already logged in user try to access to auth routes 
    if(isAuthRoute || isAlreadyVerifiedUserRoute || isAlreadyResetPasswordRoute){
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return;
    }

        // block if a not logged in user try to access these routes 
    if(isPrivateRoute){
        if (!isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return  ;
    }



    // only simple user can get to this route:
    if(isCreateStoreRoute){
        if(isLoggedIn){
            if(session?.user.role !== "USER"){
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
            return
        }
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    // Detect seller 
    if (isSellerRoute) {
        if (!isLoggedIn) {
            // Redirect to login if the user is not logged in
            return Response.redirect(new URL("/auth/sign-in", nextUrl));
        }
        if (session?.user.role !== "SELLER") {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return
    }



     // Detect admin 
     if (isAdminRoute) {
        if (!isLoggedIn) {
            // Redirect to login if the user is not logged in
            return Response.redirect(new URL("/auth/sign-in", nextUrl));
        }
        if (session?.user.role !== "ADMIN") {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); 
        }
        return
    }

    // Detect factory admin 
    if (isFactoryRoute) {
            if (!isLoggedIn) {
                // Redirect to login if the user is not logged in
                return Response.redirect(new URL("/auth/sign-in", nextUrl));
            }
            if (session?.user.role !== "FACTORY") {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); 
            }
            return
        }




    return ;
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };