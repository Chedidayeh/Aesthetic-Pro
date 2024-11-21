import os from 'os';
import fs from "fs/promises";
import { createNotification } from '@/app/(sections)/adminDashboard/notifications/action';
import { storage } from '@/firebase/firebaseConfig';
import { createFrontProductTask } from '@/trigger/createFrontProduct';
import { Collection } from '@prisma/client';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';


export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData(); // Get FormData from the request

  // Retrieve individual fields
  const storeId = data.get('storeId') as string;
  const storeName = data.get('storeName') as string;
  const productCat = data.get('productCat') as string;
  const checkedColors = data.get('checkedColors') ? JSON.parse(data.get('checkedColors') as string) : []; // Parse if JSON string
  const files = data.getAll('files[]') as File[];
  const frontDesignFile = data.get('frontDesignFile') as File;
  const productTitle = data.get('productTitle') as string;
  const productDescription = data.get('productDescription') as string;
  const tags = data.get('tags') ? JSON.parse(data.get('tags') as string) : []; // Parse if JSON string
  const productPrice = data.get('productPrice') ? JSON.parse(data.get('productPrice') as string) : ''; // Parse if JSON string
  const BasePrice = data.get('BasePrice') ? JSON.parse(data.get('BasePrice') as string) : ''; // Parse if JSON string
  const sellerProfit = data.get('sellerProfit') ? JSON.parse(data.get('sellerProfit') as string) : ''; // Parse if JSON string
  const frontDesignName = data.get('frontDesignName') as string;
  const Frontwidth = data.get('Frontwidth') ? JSON.parse(data.get('Frontwidth') as string) : ''; // Parse if JSON string
  const Frontheight = data.get('Frontheight') ? JSON.parse(data.get('Frontheight') as string) : ''; // Parse if JSON string
  const selectedCollection = data.get('selectedCollection') as Collection;
  const privateProduct = data.get('privateProduct') ? JSON.parse(data.get('privateProduct') as string) : false; // Parse if JSON string
  
//   run task
  try {

    // Initialize an array to store paths of the uploaded files

    const tempDir = path.join(os.tmpdir(), `temp`);
    await fs.mkdir(tempDir, { recursive: true });
    const tempDesignFilePath = path.join(tempDir, `${Date.now()}-${frontDesignFile.name}`);
    await fs.writeFile(tempDesignFilePath, new Uint8Array(await frontDesignFile.arrayBuffer()));

    const tempFilesPaths: string[] = [];

    // Loop through each file, save it to a temporary location, and push the path
    for (const file of files) {
      const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
      await fs.writeFile(tempFilePath, new Uint8Array(await file.arrayBuffer()));
      tempFilesPaths.push(tempFilePath);
    }

    await createFrontProductTask.trigger({
      payload: {
        tempDir,
        storeId,
        storeName,
        tempFilesPaths,
        productCat,
        checkedColors, // Already parsed or default empty array
        productTitle,
        productDescription,
        tags, // Already parsed or default empty array
        productPrice, // Already parsed or default empty string
        BasePrice, // Already parsed or default empty string
        sellerProfit, // Already parsed or default empty string
        frontDesignName,
        Frontwidth, // Already parsed or default empty string
        Frontheight, // Already parsed or default empty string
        tempDesignFilePath, // Already parsed or default empty string
        selectedCollection, // Already parsed or default as Collection type
        privateProduct, // Already parsed or default false
      },
    });

    return new Response(JSON.stringify({ message: 'Task triggered successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error triggering task:', error);
    return new Response(JSON.stringify({ message: 'Failed to trigger task.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
