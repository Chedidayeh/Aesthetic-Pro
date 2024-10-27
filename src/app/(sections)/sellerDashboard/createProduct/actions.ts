
'use server'

import { auth } from '@/auth';
import { db } from '@/db';
import { storage } from '@/firebase/firebaseConfig';
import { Collection } from '@prisma/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import sharp from 'sharp';



    export const addProductToDb = async (
      productCat: string,
      checkedColors: string[],
      frontPaths: string[],
      backPaths: string[],
      productTitle: string,
      productDescription: string,
      tags: string[],
      productPrice: number,
      BasePrice: number,
      sellerProfit: number,
      frontDesignName: string,
      Frontwidth: number,
      Frontheight: number,
      frontdesignPath: string,
      backDesignName: string,
      Backwidth: number,
      Backheight: number,
      backdesignPath: string,
      selectedCollection : Collection,
      privateProduct : boolean
    ): Promise<{ success: boolean; productId: string | null; error: boolean }> => {
      try {
        // Fetch user session
        const session = await auth();
        if (!session) {
          return { success: false, productId: null, error: true };
        }
    
        // Fetch store associated with the user
        const store = await db.store.findUnique({ where: { userId: session.user.id } });
        if (!store) {
          return { success: false, productId: null, error: true };
        }
    
        // Begin the transaction
        const productId = await db.$transaction(async (transaction) => {
          // Create a new Front design and get the id
          const frontDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: frontDesignName,
              width: Frontwidth,
              height: Frontheight,
              imageUrl: frontdesignPath,
            },
          });
    
          // Create a new Back design and get the id
          const backDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: backDesignName,
              width: Backwidth,
              height: Backheight,
              imageUrl: backdesignPath,
            },
          });
    
          // Create the product and add store id
          const product = await transaction.product.create({
            data: {
              storeId: store.id,
              category: productCat,
              colors: checkedColors,
              croppedFrontProduct: frontPaths,
              croppedBackProduct: backPaths,
              title: productTitle,
              description: productDescription,
              tags: tags,
              price: productPrice,
              basePrice: BasePrice,
              sellerProfit: sellerProfit,
              frontDesignId: frontDesign.id,
              backDesignId: backDesign.id,
              collection : selectedCollection,
              privateProduct : privateProduct

            },
          });
    
          return product.id;
        });
    
        // If everything went well, resolve the promise with the ID of the created product
        return { success: true, productId: productId, error: false };
      } catch (error) {
        // If there was an error, log it and return an error object
        console.error('Error Adding Product in database:', error);
        return { success: false, productId: null, error: true };
      }
    };
    
    


    export const addProductToDbF = async (
      productCat: string,
      checkedColors: string[],
      Paths: string[],
      productTitle: string,
      productDescription: string,
      tags: string[],
      productPrice: number,
      BasePrice: number,
      sellerProfit: number,
      DesignName: string,
      Frontwidth: number,
      Frontheight: number,
      frontdesignPath: string,
      selectedCollection : Collection,
      privateProduct : boolean,

    ): Promise<{ success: boolean; productId: string | null; error: boolean }> => {
      try {
        // Fetch user session
        const session = await auth();
        if (!session) {
          return { success: false, productId: null, error: true };
        }
    
        // Fetch store associated with the user
        const store = await db.store.findUnique({ where: { userId: session.user.id } });
        if (!store) {
          return { success: false, productId: null, error: true };
        }
    
        // Begin the transaction
        const productId = await db.$transaction(async (transaction) => {
          // Create a new Front design and get the id
          const frontDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: DesignName,
              width: Frontwidth,
              height: Frontheight,
              imageUrl: frontdesignPath,
            },
          });
    
          // Create the product and add store id
          const product = await transaction.product.create({
            data: {
              storeId: store.id,
              category: productCat,
              colors: checkedColors,
              croppedFrontProduct: Paths,
              title: productTitle,
              description: productDescription,
              tags: tags,
              price: productPrice,
              basePrice: BasePrice,
              sellerProfit: sellerProfit,
              frontDesignId: frontDesign.id,
              collection : selectedCollection,
              privateProduct : privateProduct


            },
          });
    
          return product.id;
        });
    
        // If everything went well, resolve the promise with the ID of the created product
        return { success: true, productId: productId, error: false };
      } catch (error) {
        // If there was an error, log it and return an error object
        console.error('Error Adding Product in database:', error);
        return { success: false, productId: null, error: true };
      }
    };
    
    

    export const addProductToDbB = async (
      productCat: string,
      checkedColors: string[],
      Paths: string[],
      productTitle: string,
      productDescription: string,
      tags: string[],
      productPrice: number,
      BasePrice: number,
      sellerProfit: number,
      DesignName: string,
      Backwidth: number,
      Backheight: number,
      backdesignPath: string,
      selectedCollection : Collection,
      privateProduct : boolean,


    ): Promise<{ success: boolean; productId: string | null; error: boolean }> => {
      try {
        // Fetch user session
        const session = await auth();
        if (!session) {
          return { success: false, productId: null, error: true };
        }
    
        // Fetch store associated with the user
        const store = await db.store.findUnique({ where: { userId: session.user.id } });
        if (!store) {
          return { success: false, productId: null, error: true };
        }
    
        // Begin the transaction
        const productId = await db.$transaction(async (transaction) => {
          // Create a new Back design and get the id
          const backDesign = await transaction.sellerDesign.create({
            data: {
              storeId: store.id,
              name: DesignName,
              width: Backwidth,
              height: Backheight,
              imageUrl: backdesignPath,
            },
          });
    
          // Create the product and add store id
          const product = await transaction.product.create({
            data: {
              storeId: store.id,
              category: productCat,
              colors: checkedColors,
              croppedBackProduct: Paths,
              title: productTitle,
              description: productDescription,
              tags: tags,
              price: productPrice,
              basePrice: BasePrice,
              sellerProfit: sellerProfit,
              backDesignId: backDesign.id,
              collection : selectedCollection,
              privateProduct : privateProduct

            },
          });
    
          return product.id;
        });
    
        // If everything went well, resolve the promise with the ID of the created product
        return { success: true, productId: productId, error: false };
      } catch (error) {
        // If there was an error, log it and return an error object
        console.error('Error Adding Product in database:', error);
        return { success: false, productId: null, error: true };
      }
    };

    export const uploadProductToFirebase = async (dataUrls: string[] , storeName : string , productTitle :string ) => {
      const urls: string[] = []; // Array to store all the captured product paths
    
      for (const dataUrl of dataUrls) { // Use 'for...of' instead of 'for...in'
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
        const storageRef = ref(storage, `sellers/stores/${storeName}/products/${productTitle}-${Date.now()}.png`);
        const snapshot = await uploadBytes(storageRef, optimizedBuffer);
        const downloadURL = await getDownloadURL(snapshot.ref);
    
        if (downloadURL) {
          urls.push(downloadURL);
        }
      }
    
      return urls;
    }

    export const uploadDesignDataUrlToFirebase = async (dataUrl: string, storeName: string) => {
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
        const optimizedStorageRef = ref(storage, `sellers/stores/${storeName}/designs/design-optimized-${Date.now()}.png`);
    
        // Upload the optimized image
        const optimizedSnapshot = await uploadBytes(optimizedStorageRef, optimizedBuffer);
        const optimizedDownloadURL = await getDownloadURL(optimizedSnapshot.ref);
    
    
        return optimizedDownloadURL
        
      } catch (error) {
        console.error("Error uploading design to Firebase:", error);
        throw new Error("Failed to upload design. Please try again.");
      }
    };
      

    function base64ToBlob(base64: string, mimeType: string) {
      const byteCharacters = atob(base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type: mimeType })
    }



  