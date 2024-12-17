'use server'

import * as z from "zod"
import { LoginSchema } from "../schemas"
import {signIn} from "@/auth"
import { AuthError } from "next-auth"
import { db } from "@/db"
import { checkGoogleLoggedInUser, comparePassword, getUserByEmail } from "@/userData/user"
import { User } from "@prisma/client"
import crypto from 'crypto';
import { sendResetPassEmail } from "@/lib/mailer"



export const login = async (values: z.infer<typeof LoginSchema>) => {
    // Validate the fields using Zod schema
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!", success : "" };
    }

    // Destructure email and password from validated data if data is defined
        const { email, password } = validatedFields.data;

        try {
            // Fetch the user by email
            const user = await getUserByEmail(email)
            const isGoogleLoggedInUser = await checkGoogleLoggedInUser(email)
        
            if (!user) {
                return { error: "No account found !", success: "" };
            }

            if(isGoogleLoggedInUser){
                return { error: "Try to Sign In with Google !", success: "" };
            }


            // Check if the user's email is verified
            if (!user.emailVerified) {
                return { error: "Email not verified!", success: "" };
            }

            const isPasswordMatch = await comparePassword(email , password)

            if (!isPasswordMatch) {
                return { error: "Wrong Password!", success: "" };
            }
            
            // check if the user is banned 
            if (user.isUserBanned) {
                return { error: "You've been banned from the platform !", success: "" };
            }

            // Attempt to sign in with credentials
            await signIn("credentials", {
                email: email,
                password: password,
                redirect : false
            });



            // Return success if signIn doesn't throw an error
            return { success: "Login successful!", error : ""};
        } catch (error) {
            // Handle authentication errors
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return { error: "No account found !" ,
                            success : ""
                        };
                    default:
                        return { error: "Unknown error!",  success : "" };
                }
            }
            // Throw other errors
            throw error;
        }

      
};

export const resetPassword = async (user: User) => {
    try {
        const resetPassToken = crypto.randomBytes(32).toString('hex');

        await db.user.update({
            where: { id: user.id },
            data: {
                resetPassToken,
            },
        });

        // Send verification token email
        await sendResetPassEmail(user.email, user.name!, resetPassToken);
        return true;
    } catch (error) {
        console.error("Error resetting password:", error);
        return false;
    }
};


export const GoogleLogin = async (redirectUrl : any) => {
    await signIn("google", { redirectTo: redirectUrl ? redirectUrl : "/" });
}



