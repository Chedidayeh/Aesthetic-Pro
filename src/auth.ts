import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "@/db"
import { getUserById } from "./userData/user"
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserType } from "@prisma/client"
import authConfig from "./auth.config"
// Extend the `Session` interface to include `role` and `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserType
      isBanned : Boolean
    } & DefaultSession["user"];
  }
}

 
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserType
    isBanned : Boolean
  }
}




export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token,session }) {
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(token.role && session.user){

        session.user.role = token.role
        session.user.isBanned = token.isBanned
      }


      return session
    },
    async jwt ({token}) {
      if(!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if(!existingUser) return token
      token.role = existingUser.userType
      token.isBanned = existingUser.isUserBanned

      return token
    },
  },
  adapter : PrismaAdapter(db),
  session : {strategy : "jwt"},
  ...authConfig,
})