import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function POST(request: NextRequest) {
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
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'Categories')
  const filePath = join(uploadsDir, uniqueFileName)

=======
>>>>>>> 738e55b4fc5b4857b06db4c42cbc8ed16156e3b9
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

<<<<<<< HEAD
      const uint8Array = new Uint8Array(optimizedBuffer); // Convert to Uint8Array

    // Write the optimized file to the specified path
    await writeFile(filePath, uint8Array)
    
    // Respond with the file path if the file is stored successfully
    return NextResponse.json({ success: true, filePath: `/uploads/Categories/${uniqueFileName}` })
=======
    // Check if a file is uploaded
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' });
    }

    // Convert the uploaded file into a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optional: Check MIME type of the file for safety (e.g., image/png, image/jpeg)
    const mimeType = file.type;
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Invalid file type.' });
    }

    // Generate a unique file name using uuid
    const fileExtension = mimeType.split('/')[1]; // Extract file extension
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Optimize the image using sharp
    const image = sharp(buffer);
    const optimizedBuffer = await image
      .resize({
        width: 800, // Resize to 800px wide or adjust as needed
      })
      .toFormat('png', { // Convert to PNG (or use fileExtension)
        quality: 80, // Adjust quality as needed (lower for compression)
      })
      .toBuffer();

    // Create a Firebase Storage reference
    const storageRef = ref(storage, `uploads/category/${uniqueFileName}`);

    // Upload the optimized image buffer to Firebase Storage
    const snapshot = await uploadBytes(storageRef, optimizedBuffer);

    // Get the file's download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Respond with the download URL if the file is uploaded successfully
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
