import { writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {

  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Remove the file extension while preserving the file type
  const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.')

  // Generate a unique identifier for the file name
  const uniqueFileName = `${uuidv4()}_${fileNameWithoutExtension}${extname(file.name)}`

 // Create a Firebase Storage reference
 const storageRef = ref(storage, `uploads/clientDesigns/${uniqueFileName}`);

 // Upload the optimized image buffer to Firebase Storage
 const snapshot = await uploadBytes(storageRef, buffer);

 // Get the file's download URL
 const downloadURL = await getDownloadURL(snapshot.ref);
    // Respond with the file path if the file is stored successfully
    return NextResponse.json({ success: true, downloadURL });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during the file upload.',
    });
  }
}
