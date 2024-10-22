// src/app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebase/firebaseConfig';
import path from 'path';

// Define the POST method as a named export
export async function POST(req: Request) {
  const body = await req.json();
  const { file , designName , userName } = body;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Decode base64 file
  const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  try {  
    const designNameWithoutExt = path.parse(designName).name;

    // Upload the optimized image to Firebase Storage
    const storageRef = ref(storage, `orders/clients orders/${userName}/clients designs/${designNameWithoutExt}-${Date.now()}.png`);
    const snapshot = await uploadBytes(storageRef, buffer);

    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ url: downloadURL }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error processing the image' }, { status: 500 });
  }
}
