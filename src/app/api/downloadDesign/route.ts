import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

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

    // Optional: Check MIME type of the file for safety (e.g., image/png, image/jpeg)
    const mimeType = file.type;
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Invalid file type.' });
    }

    // Optimize the image using sharp
    const image = sharp(buffer);
    const optimizedBuffer = await image
      .resize({
        width: 3000, // Resize to 800px wide or adjust as needed
      })
      .toFormat('png', { // Convert to PNG (or use fileExtension)
        quality: 100, // Adjust quality as needed (lower for compression)
      })
      .toBuffer();



    // Respond with the download URL if the file is uploaded successfully
    return NextResponse.json({ success: true, optimizedBuffer: optimizedBuffer.toString('base64') });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during the file upload.',
    });
  }
}
