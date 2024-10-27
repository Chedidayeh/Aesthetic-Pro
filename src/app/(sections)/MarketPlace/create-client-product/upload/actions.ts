'use server'

import { db } from '@/db';
import { storage } from '@/firebase/firebaseConfig';
import { PreOrderPreview } from '@prisma/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import sharp from 'sharp';




// get user preOrder
export async function getUserPreOrderByUserId(userId: string): Promise<PreOrderPreview | null> {
    try {
      // Fetch the PreOrderPreview associated with the given user
      const preOrder = await db.preOrderPreview.findFirst({
        where: {
          userId: userId,
        },
      });
  
      return preOrder; // Return the found preorder or null if not found
    } catch (error) {
      console.error('Error fetching user preorder:', error);
      throw new Error('Failed to fetch user preorder');
    }
  }





// User uploaded their own front and back design
export async function savePreOrderFBClient(
    userId:string , 
    frontDesignPath : string , 
    backDesignPath : string, 
    totalPrice : number,
    productPrice : number,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontclientDesign: frontDesignPath,
                    backclientDesign : backDesignPath,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }


// User selected a seller's front and back design
export async function savePreOrderFBSeller(
    userId:string , 
    selectedFrontDesignId : string , 
    selectedBackDesignId : string, 
    totalPrice : number,
    productPrice : number,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontsellerDesignId: selectedFrontDesignId,
                    backsellerDesignId : selectedBackDesignId,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }


  
// User uploaded their own front design and selected a seller's back design
export async function savePreOrderFB1(
    userId:string , 
    frontDesignPath : string , 
    selectedBackDesignId : string, 
    totalPrice : number,
    productPrice : number ,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontclientDesign: frontDesignPath,
                    backsellerDesignId : selectedBackDesignId,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }



  // User selected a seller's front design and uploaded their own back design
export async function savePreOrderFB2(
    userId:string , 
    backDesignPath : string , 
    selectedFrontDesignId : string, 
    totalPrice : number,
    productPrice : number,
    quantity : number , 
    selectedColor : string , 
    selectedSize : string , 
    productCategory : string , 
    capturedProductPath :string[]
 ) {

  
    try {
        // Start a transaction
        const result = await db.$transaction(async (tx) => {


            // Create a new pre-order if none exists
        const preOrder =  await tx.preOrderPreview.create({
                data: {
                    userId: userId,
                    frontsellerDesignId: selectedFrontDesignId,
                    backclientDesign : backDesignPath,
                    productPrice: productPrice,
                    amount:totalPrice,
                    quantity: quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory: productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true , preOrderId :preOrder.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false ,preOrderId :null };
    }
  }



  //User uploaded their own front design or  User selected a seller's front design
  export async function savePreOrderF(
    userId: string,
    frontDesign: string,
    totalPrice: number,
    productPrice : number,
    quantity: number,
    selectedColor: string,
    selectedSize: string,
    productCategory: string,
    capturedProductPath: string[],
    value: boolean
) {
    try {
        const result = await db.$transaction(async (tx) => {
            // Determine the correct property based on 'value'
            const frontDesignProperty = value ? 'frontsellerDesignId' : 'frontclientDesign';

            // Create the pre-order
            const preOrder = await tx.preOrderPreview.create({
                data: {
                    userId,
                    [frontDesignProperty]: frontDesign,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true, preOrderId: preOrder!.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false, preOrderId: null };
    }
}



// User uploaded their own back design or User selected a seller's back design
  export async function savePreOrderB(
    userId: string,
    backDesign: string,
    totalPrice: number,
    productPrice : number,
    quantity: number,
    selectedColor: string,
    selectedSize: string,
    productCategory: string,
    capturedProductPath: string[],
    value: boolean,
) {
    try {
        const result = await db.$transaction(async (tx) => {
            // Determine the correct property based on 'value'
            const backDesignProperty = value ? 'backsellerDesignId' : 'backclientDesign';

            // Create the pre-order
            const preOrder = await tx.preOrderPreview.create({
                data: {
                    userId,
                    [backDesignProperty]: backDesign,
                    amount:totalPrice,
                    productPrice: productPrice,
                    quantity,
                    productColor: selectedColor,
                    productSize: selectedSize,
                    productCategory,
                    capturedMockup: capturedProductPath,
                },
            });

            return { success: true, preOrderId: preOrder!.id };
        });

        return result;
    } catch (error) {
        console.error('Error saving pre-order preview:', error);
        return { success: false, preOrderId: null };
    }
}

// upload captured order product to firebase

export const uploadProductToFirebase = async (dataUrl: string , userName : string ) => {
  
      // Get the file type from the URL and convert base64 to Blob
      const base64Data = dataUrl.split(',')[1];
      const blob = base64ToBlob(base64Data, 'image/png'); // Ensure base64ToBlob is defined
      const file = new File([blob], `product.png`, { type: 'image/png' });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
  
      // Optimize the image using sharp
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1000 }) // Resize to 1000px wide or adjust as needed
        .toFormat('png', { quality: 100 }) // Convert to PNG with specified quality
        .toBuffer();
  
      // Upload the optimized image
      const storageRef = ref(storage, `orders/clients orders/${userName}/clients products/${Date.now()}.png`);
      const snapshot = await uploadBytes(storageRef, optimizedBuffer);
      const downloadURL = await getDownloadURL(snapshot.ref);
  
  
    return downloadURL;
  }

// upload front design 
export const uploadDesignDataUrlToFirebase = async (dataUrl: string , userName: string) => {

    try {
      // Extract base64 data and convert it to a Blob
      const base64Data = dataUrl.split(',')[1];
      const blob = base64ToBlob(base64Data, 'image/png');
      const file = new File([blob], `product.png`, { type: 'image/png' });
      
      // Convert File to ArrayBuffer and then to Buffer
      const buffer = Buffer.from(await file.arrayBuffer());
  
      // Optimize the image using sharp
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 2000 })
        .toFormat('png', { quality: 100 })
        .toBuffer()
  
      // Create references for the optimized and original images
      const storageRef = ref(storage, `orders/clients orders/${userName}/clients designs/${Date.now()}.png`);
  
      // Upload the optimized image
      const optimizedSnapshot = await uploadBytes(storageRef, optimizedBuffer);
      const optimizedDownloadURL = await getDownloadURL(optimizedSnapshot.ref);
  
  
      return optimizedDownloadURL
      
    } catch (error) {
      console.error("Error uploading design to Firebase:", error);
      throw new Error("Failed to upload design. Please try again.");
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }









  
