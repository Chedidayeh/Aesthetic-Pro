import sharp from 'sharp';
import { NextResponse } from 'next/server';

export async function POST(req : Request) {
  const formData = await req.formData(); // Use formData instead of json
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  try {
    // Read the file as a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize the image using sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1000 })
      .toFormat('png', { quality: 100 })
      .toBuffer();

    const base64Image = optimizedBuffer.toString('base64');
    return NextResponse.json({ optimizedBuffer: base64Image }, { status: 200 });
  } catch (error) {
    console.error('Error optimizing the file:', error);
    return NextResponse.json({ message: 'Error optimizing the file' }, { status: 500 });
  }
}
