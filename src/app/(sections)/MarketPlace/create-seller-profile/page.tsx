/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, MousePointerClick, RocketIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { addStore, fetchName } from "./actions"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useDispatch } from "react-redux"
import { saveRedirectUrl } from "@/store/actions/action"
import React from "react"
import { getPlatformForTheWebsite, getUser } from "@/actions/actions"
import { User } from "@prisma/client"

const arabicInfos = [
  "جودة التصاميم: لضمان أفضل جودة للمنتجات، يجب أن تكون التصاميم المقدمة عالية الدقة. يساهم هذا في الحفاظ على وضوح التفاصيل وضمان طباعة مثالية على المنتجات",
  "حقوق الملكية الفكرية: يجب أن تكون جميع التصاميم التي تقدمها من إبداعك الخاص أو لديك الحقوق الكاملة لاستخدامها. لا يُسمح بنشر أو بيع أي تصاميم تنتهك حقوق الملكية الفكرية لأي جهة أخرى. إذا تم اكتشاف انتهاك لهذه الحقوق، سيتم إزالة التصميم فورًا، وقد يتم اتخاذ إجراءات قانونية",
  "محتوى التصاميم: نرحب بجميع الأساليب الفنية، ولكن يجب أن تكون التصاميم ملتزمة بالمعايير الأخلاقية والقانونية. لا يُسمح بنشر أي محتوى عنصري، أو جنسي، أو سياسي متطرف، أو يروج للكراهية أو العنف",
  "عملية الموافقة: سيتم مراجعة جميع التصاميم من قبل فريقنا لضمان توافقها مع سياسات المنصة. قد يستغرق ذلك بعض الوقت، وستتلقى إشعارًا بمجرد قبول التصميم أو رفضه مع توضيح الأسباب",
  "التسعير والأرباح: يمكنك تحديد سعر البيع المناسب لتصميمك، مع مراعاة أن الأسعار التنافسية تزيد من فرص البيع. ستحصل على نسبة مئوية من الأرباح عن كل عملية بيع لتصميمك، والتي سيتم تحويلها إلى حسابك بشكل دوري",
  "التحديثات والإدارة: لديك الحرية في تحديث تصاميمك أو إزالة أي تصميم من المنصة في أي وقت. كما يمكنك إدارة مجموعة تصاميمك بسهولة من خلال لوحة التحكم المخصصة لك",
  "التواصل والدعم: نحن هنا لدعمك! إذا واجهت أي مشكلة أو كان لديك استفسار، فريق الدعم لدينا متاح لمساعدتك وضمان تجربة سلسة ومربحة على منصتنا"
];

const Page = () => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const router = useRouter()
  router.forward()

  const [isClicked, setIsClicked] = useState(false);

  const { toast } = useToast()
  const MAX_FILE_SIZE = 4 * 1024 * 1024;
  const [logo, setLogo] = useState<string>("");
  const [logoFile, setlogoFile] = useState<File>();
  const [storeName, setStoreName] = useState<string>('')
  const [termsAccepted, setTermsAccepted] = useState(false);
  const dispatch = useDispatch();
  // const setuser state
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const checkPlatformStoreCreation = async () => {
      try {
        const platform = await getPlatformForTheWebsite();
        const user =await getUser()
        setUser(user!)
        if (platform?.closeStoreCreation) {
          router.push("/")
        }

        else {
          setShowConfetti(true)
        }
      } catch (error) {
        console.error("Error fetching platform data:", error);
      }
    };

    checkPlatformStoreCreation();
  }, [router]); // Empty dependency array ensures this runs only once on mount


  const{mutate : create , isPending} = useMutation({
    mutationFn:addStore,
    onSuccess:()=>{
      toast({
        title: 'Your Store is successfully created!',
        description: 'Try to SignIn again',
        variant: 'default',
      });
      const pathname = "/sellerDashboard"
      dispatch(saveRedirectUrl(pathname));
      router.push("/api/auth/redirectNewSeller")
      router.refresh()
    },
    onError:(error)=>{
      console.log(error)
      toast({
        title: 'Something went wrong',
        description: 'There was an error on our end. Please try again.',
        variant: 'destructive',
      });
      setIsClicked(false)
      return
      
    }
  })

  // iscliked state
 
  const createStore=async ()=>{
    setIsClicked(true)
      const isValid = await fetchName(storeName)
      if(!isValid) {
        toast({
          title: 'Your Store Name is already in use!',
          description: 'Please choose another store name.',
          variant: 'destructive',
        });
        setIsClicked(false)
        return 
      }



        if(!logoFile) return

        const logoPath = await uploadLogo(logoFile)
        create({storeName ,logoPath , phoneNumber});
      


  }



  // Event handler for terms checkbox change
  const handleTermsCheckboxChange = () => {
    if(!termsAccepted){
    setTermsAccepted(true);
  }
  else{
    setTermsAccepted(false);
  }
  };


                // Function to handle Front file upload
              const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files && event.target.files[0];
                if (file) {
                  if (file.size > MAX_FILE_SIZE) {
                    toast({
                      title: 'File size exceeds the limit.',
                      description: 'Please choose a file equal or smaller than 4MB.',
                      variant: 'destructive',
                    });

                  } else {
                    setlogoFile(file)

                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (e.target) { 

                        const dataUrl = e.target.result as string;
                        const image = new Image();

                        image.onload = () => {
                          setLogo(dataUrl);
                        };

                        image.src = dataUrl;
                      }
                    };
                    reader.readAsDataURL(file);

                    

                  }
                }
                
              };


              const tags = Array.from({ length: 10 }).map(
                (_, i, a) => `Bla.${a.length + i}`
              )




              const uploadLogo = (file: File): Promise<string > => {
                return new Promise((resolve, reject) => {
                  if (!file) {
                    console.log('No file selected.');
                    resolve("");
                    return;
                  }
              
                  // Read the file as a base64 string
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onloadend = async () => {
                    const base64data = reader.result?.toString().split(',')[1]; // Get the base64 string only
              
                    try {
                      const response = await fetch('/api/uploadSellerStoreImg', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ file: base64data, storeName: storeName }),
                      });
              
                      if (!response.ok) {
                        throw new Error('Failed to upload image');
                      }
              
                      const data = await response.json();
                      const path = data.url; // Get the uploaded URL
              
                      toast({
                        title: 'Design Upload Success',
                        description: 'Design image uploaded successfully!',
                      });
              
                      resolve(path); // Resolve the promise with the URL
                    } catch (error) {
                      toast({
                        title: 'Upload Error',
                        description: 'Error uploading the image!',
                        variant: 'destructive',
                      });
                      console.error(error);
                      reject(error); // Reject the promise on error
                    }
                  };
                });
              };



              // check phone number length
              const [phoneNumber, setPhoneNumber] = useState("");
              const [phoneNumberError, setPhoneNumberError] = useState('');
              const inputClassName = phoneNumberError ? 'border-red-500' : (phoneNumber ? 'border-green-500' : '');
              const handlePhoneNumberBlur = () => {
                if (phoneNumber.length !== 8) {
                  setPhoneNumberError('Phone number must be 8 digits long.');
                } else {
                  setPhoneNumberError('');
                }
              };

              const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const phoneNumberValue = event.target.value;
                  setPhoneNumber(phoneNumberValue);
              };

  return (
    <>

<AlertDialog open={isPending}>
    <AlertDialogTrigger asChild>
    </AlertDialogTrigger>
    <AlertDialogContent className="flex flex-col items-center">
      <AlertDialogHeader className="flex flex-col items-center">
        <AlertDialogTitle className="text-2xl text-blue-700 font-bold text-center">
          Creating Your Store !
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col items-center">
          After that try to SignIn again.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Loader2 className="text-blue-700 h-[15%] w-[15%] animate-spin mt-3" />
      </AlertDialogContent>
  </AlertDialog>




              <div
              aria-hidden='true'
              className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
              <Confetti
                active={showConfetti}
                config={{ elementCount: 100, spread: 50 }}
              />
            </div>

    <div className=''>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-2xl'>
          <p className='text-base font-medium text-primary'>Work With Us !</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
            Create Your Own Store!
          </h1>
          <div className='mt-2 flex items-center text-base text-zinc-500'>
              <RocketIcon className="h-4 w-4 mr-2 text-primary" />
              <p>
                Unleash your amazing ideas and turn them into reality.
              </p>
            </div>

            <div className="items-center justify-center flex mt-8">
         <h4 className="font-semibold ">
         We take care of storage, printing, shipping and customer service for you !
          </h4>
          </div>

          {user?.isAffiliate && (
          <div className="items-center text-red-500 justify-center flex mt-8">
          <h4 className="font-medium">
            Warning ! You have already created an affiliate account. 
            If you proceed with creating a store, your existing affiliate account will be deleted.
          </h4>
          </div>
           )}
           
        </div>

        <div className='mt-10 border-t col-span-2 flex flex-col border-zinc-200'>
          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              1- Choose your store Name : 
            </h4>
            <Input 
            type='text' 
            maxLength={20} 
            placeholder='Store Name must be unique !'
            className='border-gray-300 w-full sm:w-[50%]'
            onChange={(e) => {
              setStoreName(e.target.value)
            }}/>
          </div>

          <div className='mt-10 flex space-y-3 flex-col'>
            <h4 className='font-semibold '>
              2- Add your phone number : 
            </h4>
            <Input 
                id="phoneNumber" 
                type="number" 
                pattern="\d{8}"
                onBlur={handlePhoneNumberBlur}
                placeholder="99 999 999" 
                onChange={handlePhoneNumberChange}
                className={`${inputClassName} focus:ring-0  w-full sm:w-[50%] focus:border-green-500`}
                required 
              />
              {phoneNumberError && (
                <p className="text-sm text-red-500 mt-1">
                  {phoneNumberError}
                </p>
              )}
          </div>

          <div className='mt-10 flex flex-col space-y-3'>
          <div className="flex items-center">
            <h4 className="font-semibold ">
                3- Upload your store Logo:
            </h4>
          </div>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange}                
                className='border-gray-300 w-full sm:w-[50%] text-gray-500'
                />
                              <p className="ml-2 text-xs text-gray-500">Minimum Size: 200px * 200px</p>

            </div>
            <div className='flex flex-col-2 flex-row mt-4'>
            <Avatar className="w-[20%] h-[20%] rounded-full border bg-gray-100 border-black overflow-hidden">
            <AvatarImage
                src={logo ? logo : "https://github.com/shadcn.png"}                 
                alt="" />
              </Avatar>
            </div>
           </div>

        <Separator className="my-8"/>

           <div className="items-center justify-center flex">
         <h4 className="font-semibold ">
             Make Sure to Read our Selling Terms and Policy !
          </h4>
          </div>

           <div className="items-center justify-center flex">
           <ScrollArea className="h-96 w-[60%] rounded-md border mt-6">
    <div className="p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Terms</h4>
      {arabicInfos.map((info, index) => (
        <React.Fragment key={index}>
          <div className="text-sm text-right">{info}</div>
          <Separator className="my-2" />
        </React.Fragment>
      ))}
    </div>
  </ScrollArea>
</div>


           <div className="flex items-center justify-center mt-8 space-x-2">
            <Checkbox id="terms"
            onClick={handleTermsCheckboxChange}                          
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>



            <div className=" flex justify-end items-end mt-[10%]">
            <div>
            <p className="mr-3 mb-2 text-sm text-gray-500">Done ? What are waiting for !</p>
            </div>
            <Button disabled={isClicked || isPending || !logoFile || storeName==="" || !termsAccepted || phoneNumber.length != 8}
              onClick={createStore} className="w-full sm:w-[40%]">Create Store Now
              <MousePointerClick className="ml-2"/>
            </Button>
            </div>
      </div>
    </div>
    </>
  )
}

export default Page

