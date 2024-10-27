/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'

import {
  useEffect,
  useState
} from 'react';
import {
  useRouter
} from 'next/navigation';
import {
  Loader,
  MousePointerClick,
  RocketIcon
} from 'lucide-react';
import Confetti from 'react-dom-confetti';
import {
  useToast
} from "@/components/ui/use-toast";
import {
  Checkbox
} from "@/components/ui/checkbox";
import {
  Separator
} from "@/components/ui/separator";
import {
  Button
} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  useDispatch
} from "react-redux";
import {
  saveRedirectUrl
} from "@/store/actions/action";
import React from "react";
import {
  getPlatformForTheWebsite,
  getUser
} from "@/actions/actions";
import { createAccount } from './actions';
import { User } from '@prisma/client';

const Page = () => {
  const [showConfetti, setShowConfetti] = useState < boolean > (true);
  const router = useRouter();
  const { toast } = useToast()
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>();


  useEffect(() => {
    const ShowConfetti = async () => {
      try {
        const user =await getUser()
        setUser(user!)
        setShowConfetti(true)
      } catch (error) {
        console.error("Error fetching platform data:", error);
      }
    };

    ShowConfetti();
  }, [router]); // Empty dependency array ensures this runs only once on mount


// isOpen state
const [isOpen, setIsOpen] = useState < boolean > (false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Event handler for terms checkbox change
  const handleTermsCheckboxChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const createAffiliateAccount = async () => {
    try {
      setIsOpen(true);  
      // Attempt to create an affiliate account
      const res = await createAccount(user!);
  
      if (res) {
        // Success toast message
        toast({
          title: 'Affiliate account created successfully!',
          description: 'You are now part of the affiliate program. Try to SignIn again to continue !',
          duration : 5000
        });
  
        // Redirect to the dashboard if account creation is successful
        const pathname = "/affiliateDashboard"
        dispatch(saveRedirectUrl(pathname));
        router.push("/api/auth/redirectNewSeller")
        router.refresh()
            } else {
        // Failure toast message in case of error
        toast({
          title: 'Error creating affiliate account.',
          description: 'An issue occurred while processing your request.',
          variant: 'destructive',
        });
        setIsOpen(false);

      }
    } catch (error) {
      setIsOpen(false);
      // Catch any unexpected errors and display a toast notification
      toast({
        title: 'Unexpected error.',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    }
  };
  

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent className="flex flex-col items-center">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
              Creating Your Account !
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center">
            After that try to SignIn again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Loader className="text-blue-700 h-[15%] w-[15%] animate-spin mt-3" />
        </AlertDialogContent>
      </AlertDialog>

      <div aria-hidden='true' className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
        <Confetti active={showConfetti} config={{ elementCount: 100, spread: 50 }} />
      </div>

      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-2xl'>
          <p className='text-base font-medium text-primary'>Work With Us !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Become an Affiliate !
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
            <RocketIcon className="h-4 w-4 mr-2 text-primary" />
            <p>
              Share products and earn profit.
            </p>
          </div>

          <div className="items-center justify-center flex mt-8">
            <h4 className="font-semibold ">
              Earn a commission on every sale made through your referral !
            </h4>
          </div>

          {user?.userType === "SELLER" && (
          <div className="items-center text-red-500 justify-center flex mt-8">
          <h4 className="font-medium">
            Warning ! You already created a seller account. 
            If you proceed with creating an affiliate account, your existing store will be deleted.
          </h4>
          </div>
           )}

        </div>

        <div className='mt-10 border-t col-span-2 flex flex-col border-zinc-200 text-right'>
  {/* قسم كيفية العمل */}
  <div className='mt-10 flex space-y-3 flex-col'>
    <h4 className='font-semibold'>
       كيف تعمل:
    </h4>
    <p className='text-sm text-zinc-500'>
      كمسوق تابع، ستختار منتجًا من منصتنا وتقوم بإنشاء رابط إحالة فريد لهذا المنتج. بعد ذلك يمكنك مشاركة هذا الرابط مع جمهورك عبر وسائل التواصل الاجتماعي
    </p>
    <p className='text-sm text-zinc-500'>
      عندما يستخدم شخص ما رابط الإحالة الخاص بك لإجراء طلب شراء، سيقوم النظام بتتبع الطلب، وإذا تم الدفع سيتم تخصيص عملية البيع لحسابك تلقائيًا. ستحصل على عمولة عن كل عملية بيع تتم من خلال رابط الإحالة الخاص بك
    </p>
    <p className='text-sm text-zinc-500'>
      يمكنك متابعة جميع مبيعاتك والإحالات والعمولات الخاصة بك من خلال لوحة التحكم الخاصة بالتسويق التابع في الوقت الفعلي، مما يسمح لك بتتبع أرباحك أثناء نموها
    </p>
  </div>

  {/* قسم كيفية الحصول على الأموال */}
  <div className='mt-10 flex space-y-3 flex-col'>
    <h4 className='font-semibold'>
       كيف تحصل على الأموال:
    </h4>
    <p className='text-sm text-zinc-500'>
      ستحصل على عمولة عن كل عملية بيع تتم من خلال رابط الإحالة الخاص بك. العمولة هي نسبة مئوية من إجمالي قيمة البيع، ويمكن أن تختلف هذه النسبة حسب المنتج
    </p>
    <p className='text-sm text-zinc-500'>
      تتم معالجة المدفوعات كل أسبوع، بشرط أن تكون قد وصلت إلى الحد الأدنى للدفع. يمكنك اختيار استلام أرباحك عبر التحويل البنكي أو من خلال تطبيق فلوسي 
    </p>
    <p className='text-sm text-zinc-500'>
      يمكنك تتبع العمولات المعلقة وسجل المدفوعات مباشرة من خلال لوحة التحكم الخاصة بالتسويق التابع. منصتنا تضمن لك الحصول على مستحقاتك عن كل إحالة ناجحة
    </p>
  </div>
      </div>

        <div className='mt-10 border-t col-span-2 flex flex-col border-zinc-200'>
        {/* How it works section */}
        <div className='mt-10 flex space-y-3 flex-col'>
          <h4 className='font-semibold'>
            1- How it works:
          </h4>
          <p className='text-sm text-zinc-500'>
            As an affiliate, you will choose a product from our platform and generate a unique referral link for that product. You can then share this link with your audience through social media.
          </p>
          <p className='text-sm text-zinc-500'>
            When someone uses your referral link to place an order, the system will track the order and if it is paid then automatically will assign the sale to your account. You will earn a commission for each sale made through your referral link.
          </p>
          <p className='text-sm text-zinc-500'>
            You can monitor all your sales, referrals, and commissions through your affiliate dashboard in real-time, allowing you to track your earnings as they grow.
          </p>
        </div>

          {/* How you get paid section */}
          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold'>
              2- How you get paid:
            </h4>
            <p className='text-sm text-zinc-500'>
              You will earn a commission on each sale made through your referral link. The commission is a percentage of the total sale value, and this rate can vary depending on the product.
            </p>
            <p className='text-sm text-zinc-500'>
              Payments are processed in each week, provided you have reached the minimum payout threshold. You can choose to receive your earnings via bank transfer, D17 or through Flouci App.
            </p>
            <p className='text-sm text-zinc-500'>
              You can track your pending commissions and payment history directly in your affiliate dashboard. Our platform ensures that you are paid for every successful referral.
            </p>
          </div>
        </div>






        <Separator className="my-8" />

        <div className="flex items-center justify-center mt-8 space-x-2">
          <Checkbox id="terms" onClick={handleTermsCheckboxChange} />
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I understand and I want to begin.
          </label>
        </div>

        <div className="flex justify-end items-end mt-[10%]">
          <Button disabled={!termsAccepted} onClick={createAffiliateAccount} className="w-full sm:w-[40%]">
            Create Affiliate Account Now <MousePointerClick className="ml-2" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default Page
