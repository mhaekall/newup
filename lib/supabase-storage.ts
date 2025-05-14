import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"
import imageCompression from "browser-image-compression" // Tambahkan package ini

// Define bucket names
export const PROFILE_BUCKET = "profile-images"
export const BANNER_BUCKET = "banner-images"
export const PROJECT_BUCKET = "project-images"
export const CV_BUCKET = "cvs" // Match the exact bucket name in Supabase

// Function to ensure that the required storage buckets exist
export async function ensureBucketsExist() {
  try {
    console.log("Ensuring storage buckets exist...")

    const buckets = [PROFILE_BUCKET, BANNER_BUCKET, PROJECT_BUCKET, CV_BUCKET]

    for (const bucketName of buckets) {
      // Check if bucket exists
      const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket(bucketName)

      // Create bucket if it doesn't exist
      if (getBucketError && getBucketError.message.includes("does not exist")) {
        console.log(`Creating bucket: ${bucketName}`)
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
        })

        if (error) {
          console.error(`Error creating bucket ${bucketName}:`, error)
          continue
        }

        console.log(`Bucket ${bucketName} created successfully`)
      } else {
        console.log(`Bucket ${bucketName} already exists`)
      }

      // Update bucket to be public
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      })

      if (updateError) {
        console.error(`Error updating bucket ${bucketName}:`, updateError)
      } else {
        console.log(`Bucket ${bucketName} updated to be public`)
      }
    }

    console.log("Storage buckets ensured")
    return true
  } catch (error) {
    console.error("Error ensuring storage buckets:", error)
    return false
  }
}

// Compress image before upload
async function compressImage(file: File): Promise<File> {
  // Skip compression for small images or non-jpeg/png
  if (file.size < 500 * 1024 || !['image/jpeg', 'image/png'].includes(file.type)) {
    return file;
  }
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // Return original file if compression fails
  }
}

// Upload a CV to Supabase Storage
export async function uploadCV(file: File, userId: string) {
  try {
    if (!file) {
      throw new Error("No file provided")
    }

    if (!userId) {
      throw new Error("User ID is required")
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit")
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed")
    }

    // Create a unique file name that includes the original filename for better user experience
    const fileExt = file.name.split(".").pop()
    const originalName = file.name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_")
    const fileName = `${userId}/${originalName}_${uuidv4().substring(0, 8)}.${fileExt}`

    console.log(`Uploading CV to bucket: ${CV_BUCKET}, path: ${fileName}`)

    // Upload the file to Supabase Storage with public access
    const { data, error } = await supabase.storage.from(CV_BUCKET).upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type, // Set the correct content type for proper download
    })

    if (error) {
      console.error("CV upload error:", error)
      throw new Error(`Failed to upload CV: ${error.message}`)
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(CV_BUCKET).getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded CV")
    }

    console.log("CV upload successful, URL:", urlData.publicUrl)
    return {
      url: urlData.publicUrl,
      filename: file.name,
    }
  } catch (error) {
    console.error("Error uploading CV:", error)
    throw error
  }
}

// Delete a CV from Supabase Storage
export async function deleteCV(url: string) {
  try {
    if (!url) return true // No CV to delete

    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // Find the index of the bucket name in the path
    const bucketIndex = pathParts.findIndex((part) => part === CV_BUCKET)
    if (bucketIndex === -1) {
      throw new Error("Invalid CV URL format")
    }

    // Get the file path after the bucket name
    const filePath = pathParts.slice(bucketIndex + 1).join("/")

    console.log(`Deleting CV from path: ${filePath}`)

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from(CV_BUCKET).remove([filePath])

    if (error) {
      console.error("Error deleting CV:", error)
      throw new Error(`Failed to delete CV: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting CV:", error)
    return false
  }
}

// Upload an image to Supabase Storage
export async function uploadImage(file: File, type: "profile" | "banner" | "project") {
  try {
    if (!file) {
      throw new Error("No file provided")
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit")
    }

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validImageTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed")
    }

    // Compress image before upload (for jpeg and png)
    const compressedFile = await compressImage(file);

    // Select the appropriate bucket based on the type
    const bucket = type === "profile" ? PROFILE_BUCKET : type === "banner" ? BANNER_BUCKET : PROJECT_BUCKET

    // Create a unique file name to avoid collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`

    console.log(`Uploading to bucket: ${bucket}, path: ${fileName}`)

    // Upload the file to Supabase Storage with public access
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, compressedFile, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Upload error:", error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file")
    }

    console.log("Upload successful, URL:", urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Delete an image from Supabase Storage
export async function deleteImage(url: string) {
  try {
    if (!url) {
      return true // No image to delete
    }

    // Extract the bucket and file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // Find the bucket name in the path
    let bucket = ""
    if (url.includes(PROFILE_BUCKET)) bucket = PROFILE_BUCKET
    else if (url.includes(BANNER_BUCKET)) bucket = BANNER_BUCKET
    else if (url.includes(PROJECT_BUCKET)) bucket = PROJECT_BUCKET
    else if (url.includes(CV_BUCKET)) bucket = CV_BUCKET
    else return false // Unknown bucket

    // Get the file name (last part of the path)
    const fileName = pathParts[pathParts.length - 1]

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      console.error("Error deleting file:", error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
