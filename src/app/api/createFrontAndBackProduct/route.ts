import os from 'os';
import fs from "fs/promises";
import { createNotification } from '@/app/(sections)/adminDashboard/notifications/action';
import { storage } from '@/firebase/firebaseConfig';
import { Collection } from '@prisma/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { addProductToDb, addProductToDbB } from '@/app/(sections)/sellerDashboard/createProduct/actions';


export async function POST(req: NextRequest) {
  const data = await req.formData(); // Get FormData from the request

  // Retrieve individual fields
  const storeId = data.get('storeId') as string;
  const storeName = data.get('storeName') as string;
  const productCat = data.get('productCat') as string;
  const checkedColors = data.get('checkedColors') ? JSON.parse(data.get('checkedColors') as string) : []; // Parse if JSON string
  const frontFiles = data.getAll('frontFiles[]') as File[];
  const backFiles = data.getAll('backFiles[]') as File[];
  const frontDesignFile = data.get('frontDesignFile') as File;
  const backDesignFile = data.get('backDesignFile') as File;
  const productTitle = data.get('productTitle') as string;
  const productDescription = data.get('productDescription') as string;
  const tags = data.get('tags') ? JSON.parse(data.get('tags') as string) : []; // Parse if JSON string
  const productPrice = data.get('productPrice') ? JSON.parse(data.get('productPrice') as string) : ''; // Parse if JSON string
  const BasePrice = data.get('BasePrice') ? JSON.parse(data.get('BasePrice') as string) : ''; // Parse if JSON string
  const sellerProfit = data.get('sellerProfit') ? JSON.parse(data.get('sellerProfit') as string) : ''; // Parse if JSON string
  const frontDesignName = data.get('frontDesignName') as string;
  const backDesignName = data.get('backDesignName') as string;
  const Frontwidth = data.get('Frontwidth') ? JSON.parse(data.get('Frontwidth') as string) : ''; // Parse if JSON string
  const Frontheight = data.get('Frontheight') ? JSON.parse(data.get('Frontheight') as string) : ''; // Parse if JSON string
  const Backwidth = data.get('Backwidth') ? JSON.parse(data.get('Backwidth') as string) : ''; // Parse if JSON string
  const Backheight = data.get('Backheight') ? JSON.parse(data.get('Backheight') as string) : ''; // Parse if JSON string
  const selectedCollection = data.get('selectedCollection') as Collection;
  const privateProduct = data.get('privateProduct') ? JSON.parse(data.get('privateProduct') as string) : false; // Parse if JSON string
  
  try {

    const frontProductPaths = await uploadFilesToFirebase(frontFiles,storeName,productTitle)
    const frontDesignPath = await uploadDesignToFirebase(frontDesignFile,storeName)
    const nonNullFilter = (path: string | null): path is string => path != null;
    const frontProductPathsFiltered = frontProductPaths.filter(nonNullFilter);

    const backProductPaths = await uploadFilesToFirebase(backFiles,storeName,productTitle)
    const backDesignPath = await uploadDesignToFirebase(backDesignFile,storeName)
    const backProductPathsFiltered = backProductPaths.filter(nonNullFilter);

    const result = await addProductToDb(
      storeId,
      productCat,
      checkedColors,
      frontProductPathsFiltered,
      backProductPathsFiltered,
      productTitle,
      productDescription,
      tags,
      productPrice,
      BasePrice,
      sellerProfit,
      frontDesignName,
      Frontwidth,
      Frontheight,
      frontDesignPath!,
      backDesignName,
      Backwidth,
      Backheight,
      backDesignPath!, 
      selectedCollection , 
      privateProduct)

      if (result.success) {
            await createNotification(storeId, `Your product ${productTitle} is created`, "Admin");
            return new Response(JSON.stringify({ message: 'Product Created successfully!' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              });

        }else if (result.error) {
                return new Response(JSON.stringify({ message: 'Faild to create Product!' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                  });
         } 

  } catch (error) {
    console.error('Error triggering task:', error);
    return new Response(JSON.stringify({ message: 'Failed to create Product!.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


async function uploadFilesToFirebase(productFiles: File[], storeName: string, productTitle: string) {
    const uploadPromises = productFiles.map(async (file) => {
      try {

        if(!file) {
            return null
        }

        const mimeType = file.type;
        if (!mimeType.startsWith('image/')) {
            return null
      }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const image = sharp(buffer).resize({ width: 1000 }).toFormat('png', { quality: 100 });
        const optimizedBuffer = await image.toBuffer();
        const uniqueName = crypto.randomUUID();
        const storageRef = ref(storage, `sellers/stores/${storeName}/products/${productTitle}-${uniqueName}--${Date.now()}.png`);
        const snapshot = await uploadBytes(storageRef, optimizedBuffer);
        return await getDownloadURL(snapshot.ref);

      } catch (error) {
        console.error(`Error uploading file`, error);
        return null; // Skip this file on failure
      }
    });
  
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null); // Return only successful uploads
  }


const uploadDesignToFirebase = async (designFile : File, storeName : string) => {
    try {
        if(!designFile) {
            return null   
             }

        const mimeType = designFile.type;
        if (!mimeType.startsWith('image/')) {
            return null      
        }

        const uniqueName = crypto.randomUUID();


        const storageRef = ref(
            storage,
            `sellers/stores/${storeName}/designs/${uniqueName}-${Date.now()}.png`
        );

        let frontdesignPath;

        // Check if the buffer size is larger than 2MB
        if (designFile.size >= 2 * 1024 * 1024) {

            const bytes = await designFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Optimize the image using sharp
            const image = sharp(buffer);
            const optimizedBuffer = await image
                .resize({ width: 1000 }) // Resize the image
                .toFormat('png', { quality: 100 }) // Convert to PNG with high quality
                .toBuffer();

            // Upload the optimized image
            const snapshot = await uploadBytes(storageRef, optimizedBuffer);
            frontdesignPath = await getDownloadURL(snapshot.ref);
        } else {
            // Upload the buffer directly if size is below 2MB
            const snapshot = await uploadBytes(storageRef, designFile);
            frontdesignPath = await getDownloadURL(snapshot.ref);
        }

        return frontdesignPath;

    } catch (error) {
        console.error("Error uploading design:", error);
        return null  // Re-throw the error if needed
    }
};