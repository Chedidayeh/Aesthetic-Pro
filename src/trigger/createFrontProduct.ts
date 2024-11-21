import { createNotification } from "@/app/(sections)/adminDashboard/notifications/action";
import { addProductToDbF } from "@/app/(sections)/sellerDashboard/createProduct/actions";
import { storage } from "@/firebase/firebaseConfig";
import { Collection } from "@prisma/client";
import { task } from "@trigger.dev/sdk/v3";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import sharp from "sharp";
import fs from "fs/promises";

export const createFrontProductTask = task({
  id: "create-front-product",
  retry: {
    maxAttempts: 3,
  },
  run: async ({
    payload,
  }: {
    payload: {  
        tempDir:string, 
        storeId : string ,
        storeName : string,
        tempFilesPaths : string[] ,
        productCat: string,
        checkedColors: string[],
        productTitle: string,
        productDescription: string,
        tags: string[],
        productPrice: number,
        BasePrice: number,
        sellerProfit: number,
        frontDesignName: string,
        Frontwidth: number,
        Frontheight: number,
        tempDesignFilePath: string,
        selectedCollection : Collection,
        privateProduct : boolean, };
  }) => {

    try {
        const frontDesignfileBuffer = await fs.readFile(payload.tempDesignFilePath);
        const frontdesignPath = await uploadDesignToFirebase(frontDesignfileBuffer , payload.storeName)

        const frontProductbuffers = await readFilesAsBuffers(payload.tempFilesPaths)
        const frontProductPaths = await uploadFilesToFirebase(frontProductbuffers , payload.storeName , payload.productTitle)

        const nonNullFilter = (path: string | null): path is string => path != null;

        const frontProductPathsFiltered = frontProductPaths.filter(nonNullFilter);
        const result = await addProductToDbF(
          payload.storeId,
          payload.productCat,
          payload.checkedColors,
          frontProductPathsFiltered,
          payload.productTitle,
          payload.productDescription,
          payload.tags,
          payload.productPrice,
          payload.BasePrice,
          payload.sellerProfit,
          payload.frontDesignName,
          payload.Frontwidth,
          payload.Frontheight,
          frontdesignPath,
          payload.selectedCollection,
          payload.privateProduct
      );

        if (result.success) {
            try {
              await createNotification(payload.storeId, `Your product ${payload.productTitle} is created`, "Admin");
              await deleteTempFolder(payload.tempDir);
            } catch (notifError) {
              console.error("Failed to send notification:", notifError);
              // Optionally continue with task even if notification fails
        }
    }else if (result.error) {
        try {
            await deleteTempFolder(payload.tempDir);
            await createNotification(payload.storeId, `Your product ${payload.productTitle} is failed to be created due to internet connection plesae try again later`, "Admin");
          } catch (notifError) {
            console.error("Failed to send notification:", notifError);
            // Optionally continue with task even if notification fails
      }
      throw new Error("task failed");
    } 
} catch (error) {
    console.error("Failed to run task and to add product to DB:", error);
    throw new Error("task failed");
  }
  },
});

async function readFilesAsBuffers(tempFilePaths: string[]): Promise<Buffer[]> {
    try {
      // Initialize an array to store the buffers
      const buffers: Buffer[] = [];
  
      // Iterate over each file path in the tempFilePaths array
      for (const tempFilePath of tempFilePaths) {
        const fileBuffer = await fs.readFile(tempFilePath); // Read file as Buffer
        buffers.push(fileBuffer); // Add the buffer to the array
      }
  
      return buffers;
    } catch (error) {
      console.error("Error reading files as buffers:", error);
      throw error; // Optionally handle or rethrow the error
    }
  }


async function uploadFilesToFirebase(buffers: Buffer[], storeName: string, productTitle: string) {
    const uploadPromises = buffers.map(async (buffer) => {
      try {
        const image = sharp(buffer).resize({ width: 1000 }).toFormat('png', { quality: 100 });
        const optimizedBuffer = await image.toBuffer();
        
        const storageRef = ref(storage, `sellers/stores/${storeName}/products/${productTitle}-${Date.now()}.png`);
        const snapshot = await uploadBytes(storageRef, optimizedBuffer);
        return await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error(`Error uploading file`, error);
        return null; // Skip this file on failure
      }
    });
  
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null); // Return only successful uploads
  }

  const uploadDesignToFirebase = async (designBuffer : Buffer, storeName : string) => {
    try {
        const storageRef = ref(
            storage,
            `sellers/stores/${storeName}/designs/${Date.now()}.png`
        );

        let frontdesignPath;

        // Check if the buffer size is larger than 2MB
        if (designBuffer.length >= 2 * 1024 * 1024) {
            // Optimize the image using sharp
            const image = sharp(designBuffer);
            const optimizedBuffer = await image
                .resize({ width: 1000 }) // Resize the image
                .toFormat('png', { quality: 100 }) // Convert to PNG with high quality
                .toBuffer();

            // Upload the optimized image
            const snapshot = await uploadBytes(storageRef, optimizedBuffer);
            frontdesignPath = await getDownloadURL(snapshot.ref);
        } else {
            // Upload the buffer directly if size is below 2MB
            const snapshot = await uploadBytes(storageRef, designBuffer);
            frontdesignPath = await getDownloadURL(snapshot.ref);
        }

        return frontdesignPath;

    } catch (error) {
        console.error("Error uploading design:", error);
        throw error;  // Re-throw the error if needed
    }
};

async function deleteTempFolder(tempFolderPath: string): Promise<void> {
    try {
      await fs.rm(tempFolderPath, { recursive: true, force: true });
      console.log(`Temporary folder deleted: ${tempFolderPath}`);
    } catch (error) {
      console.error("Error deleting temporary folder:", error);
      throw error; // Optionally rethrow or handle failure
    }
  }