// app/api/getImage/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('imageUrl');

  if (!imageUrl || typeof imageUrl !== 'string') {
    return NextResponse.json({ error: 'Invalid URL parameter' }, { status: 400 });
  }

  // Define the path to the public folder where images are stored
  const imagePath = path.join(process.cwd(), 'public' , imageUrl);

  try {
    // Check if the image file exists
    if (fs.existsSync(imagePath)) {
      // Read the image file and set the appropriate content type
      const imageBuffer = fs.readFileSync(imagePath);
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png', // Adjust content type based on your images
        },
      });
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
