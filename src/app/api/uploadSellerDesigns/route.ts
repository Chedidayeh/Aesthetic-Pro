import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = new Uint8Array (Buffer.from(bytes))


  // Remove the file extension while preserving the file type
  const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.')

  // Generate a unique identifier for the file name
  const uniqueFileName = `${uuidv4()}_${fileNameWithoutExtension}${extname(file.name)}`

  // Define the path where you want to store the file
  const uploadsDir = join(process.cwd(), 'public', 'uploads' , 'sellers designs')
  const filePath = join(uploadsDir, uniqueFileName)


    // Write the file to the specified path
    await writeFile(filePath, buffer)
    // Respond with the file path if the file is stored successfully
    return NextResponse.json({ success: true, filePath: `/uploads/sellers designs/${uniqueFileName}` })
=======
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract the file name without extension
    const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

    // Generate a unique file name
    const uniqueFileName = `${uuidv4()}_${fileNameWithoutExtension}${extname(file.name)}`;

    // Create a Firebase Storage reference for the `uploads/sellerProducts` directory
    const storageRef = ref(storage, `uploads/sellerDesigns/${uniqueFileName}`);

    // Upload the file buffer to Firebase Storage
    const snapshot = await uploadBytes(storageRef, buffer);

    // Get the file's download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Respond with the download URL if the upload was successful
    return NextResponse.json({ success: true, downloadURL });
>>>>>>> 738e55b4fc5b4857b06db4c42cbc8ed16156e3b9
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during the file upload.',
    });
  }
}
