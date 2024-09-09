'use server'

import * as z from "zod"
import { RegisterSchema } from "../schemas"
import { db } from '@/db';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from "@/userData/user";
import crypto from 'crypto';
import { sendVerificationEmail } from "@/lib/mailer";


export const register = async(values : z.infer<typeof RegisterSchema> ) => {

    const validatedFileds = RegisterSchema.safeParse(values)

    if(!validatedFileds.success){
        return{error : "Invalid fileds !"}
    }

    const {email,password,userName} = validatedFileds.data
    const hash = bcrypt.hashSync(password);

    const existingUser = await getUserByEmail(email)

    if(existingUser){
        return {error : "Email already in use !"}
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');



    await db.user.create({
        data : {
            email,
            password : hash,
            username:userName,
            verificationToken,
            emailVerified : false
        }
    })

     // Send verification token email
    await sendVerificationEmail(email, userName, verificationToken);

    // send verification token email
    return {success : "An Email Verfication was sent to you !"}


}