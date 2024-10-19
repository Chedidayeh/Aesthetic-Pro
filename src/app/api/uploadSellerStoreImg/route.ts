import { writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
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

  // Define the path where you want to store the file
  const uploadsDir = join(process.cwd(), 'public', 'uploads' , 'seller store imgs')
  const filePath = join(uploadsDir, uniqueFileName)

  try {

     // Optimize the image using sharp
     const image = sharp(buffer)
     const optimizedBuffer = await image
       .resize({ // optional: resize the image
         width: 800 // or any other width you prefer
       })
       .toFormat('png', { // convert to PNG and apply compression
        quality: 100 // adjust quality as needed
      })
       .toBuffer()

      const uint8Array = new Uint8Array(optimizedBuffer); // Convert to Uint8Array

    // Write the file to the specified path
    await writeFile(filePath, uint8Array)
    // Respond with the file path if the file is stored successfully
    return NextResponse.json({ success: true, filePath: `/uploads/seller store imgs/${uniqueFileName}` })
  } catch (error) {
    // If there's an error during file writing, respond with error message
    return NextResponse.json({ success: false })
  }
}
