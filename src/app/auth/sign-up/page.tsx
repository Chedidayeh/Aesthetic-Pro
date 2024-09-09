/* eslint-disable @next/next/no-img-element */
'use client'

import * as React from "react"
import Link from 'next/link'

import { Button, buttonVariants } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RegisterSchema } from "../schemas"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { register } from "./actions"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
const Page = () => {
  
  const [error , setError] = useState<string | undefined>("")
  const [success , setSuccess] = useState<string |undefined>("")

  const [isPending , stratTranstion ] = useTransition()

  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      userName:"",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setError("")
    setSuccess("")
    stratTranstion(()=> {
      register(values)
      .then((data)=>{
        setError(data.error)
        setSuccess(data.success)

      })
    })
  }
  return (
    <>
      <div className='container relative flex pt-8 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <img src="/signUp.png" className="w-[30%] h-[30%] " alt="" />
          <h1 className='text-2xl font-semibold tracking-tight'>
              Create an account
            </h1>

            <Link
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5',
              })}
              href='/auth/sign-in'>
              Already have an account? Sign-in
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid gap-6'>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className='grid gap-2 space-y-2' >
          <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserName</FormLabel>
              <FormControl>
                <Input disabled={isPending}
                placeholder="username" 
                {...field} 
                type="text" 
                className=""/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled={isPending}
                placeholder="example@gmail.com" 
                {...field} 
                type="email" 
                className=""/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
              <div className="relative w-full">
                <Input disabled={isPending}
                placeholder="********" 
                {...field} 
                type={showPassword ? "text" : "password"} // Toggle input type
                className="pr-10"/>
                <button
                type="button"
                onClick={togglePasswordVisibility}
                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                       >
              {showPassword ? (
                 <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                 <Eye className="h-5 w-5 text-gray-500" />
                )}
                </button>
                </div>
              
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                
              <FormError message={error}  />
              <FormSuccess message={success}  />
              <Button 
              disabled={isPending}
              loadingText="Creating" 
              isLoading={isPending}
              className="w-full" 
              type="submit">Create</Button>
              </div>
            </form>
            </Form>
            <div className='relative'>
              <div
                aria-hidden='true'
                className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  or
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Page