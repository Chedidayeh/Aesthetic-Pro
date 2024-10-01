import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { extname } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    // Check if a file is uploaded
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' });
    }

    // Convert the uploaded file into a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract the file name without extension
    const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        // Generate a unique file name
    const uniqueFileName = `${uuidv4()}_${fileNameWithoutExtension}${extname(file.name)}`;

    // // Optimize the image using sharp
    // const image = sharp(buffer);
    // const optimizedBuffer = await image
    //   .resize({
    //     width: 800, // Resize to 800px wide or adjust as needed
    //   })
    //   .toFormat('png', { // Convert to PNG (or use fileExtension)
    //     quality: 80, // Adjust quality as needed (lower for compression)
    //   })
    //   .toBuffer();

    // Create a Firebase Storage reference
    const storageRef = ref(storage, `uploads/sellerProducts/${uniqueFileName}`);

    // Upload the optimized image buffer to Firebase Storage
    const snapshot = await uploadBytes(storageRef, buffer);

    // Get the file's download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Respond with the download URL if the file is uploaded successfully
    return NextResponse.json({ success: true, downloadURL });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during the file upload.',
    });
  }
}
