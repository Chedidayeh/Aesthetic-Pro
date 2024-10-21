// src/app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebase/firebaseConfig';

// Define the POST method as a named export
export async function POST(req: Request) {
  const body = await req.json();
  const { file , category } = body;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Decode base64 file
  const buffer = Buffer.from(file, 'base64');

  try {
    // Optimize the image using sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1000 })
      .toFormat('png', { quality: 100 })
      .toBuffer();

    // Upload the optimized image to Firebase Storage
    const storageRef = ref(storage, `categories/${category}/${Date.now()}.png`);
    const snapshot = await uploadBytes(storageRef, optimizedBuffer);

    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ url: downloadURL }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error processing the image' }, { status: 500 });
  }
}
