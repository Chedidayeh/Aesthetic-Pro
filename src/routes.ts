// array of routes that accessible to only logged in users
// these routes require Auth
// type : string

export const privateRoutes = [
    "/PodProducts/create-client-product/upload",
    "/PodProducts/create-client-product/preview",
]




// array of routes that accessible to not logged in users
// these routes don't require Auth
// type : string

export const createSstoreRoute = "/PodProducts/create-seller-profile"


// array of routes that accessible to all not logged in users
// these routes require Auth
// type : string
export const authRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
]


// the prefix for api auth routes
// routes that starts with this prefix are used for api auth
// type : string
export const apiAuthPrefix = '/api/auth'

// google route
export const googleAuthRoute = "/api/auth"

//signOutRoute : 
export const signOutRoute = '/api/auth/logout'

//New Seller signOutRoute : 
export const sellerSignOutRoute = ['/api/auth/redirectNewSeller','/api/auth/redirectDeletedSeller']

// the prefix for sellers auth routes
// routes that starts with this prefix are used for seller Dashboard navigation
// type : string
export const sellerAuthRoutes = '/sellerDashboard'


// the prefix for admin auth routes
// routes that starts with this prefix are used for admin Dashboard navigation
// type : string
export const adminAuthRoutes = '/adminDashboard'


// the prefix for factory auth routes
// routes that starts with this prefix are used for factory Dashboard navigation
// type : string
export const factoryAuthRoutes = '/factoryDashboard'


export const enableDeletedUser = '/api/auth/redirectDeletedSeller'

export const alreadyVerifiedUser = '/auth/verify-email'

export const alreadyResetPassword = '/auth/reset-password'

export const DEFAULT_LOGIN_REDIRECT = "/"

