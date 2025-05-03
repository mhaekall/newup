import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Define bucket names
export const PROFILE_BUCKET = "profile-images"
export const BANNER_BUCKET = "banner-images"
export const PROJECT_BUCKET = "project-images"

// Create buckets if they don't exist
export async function ensureBucketsExist() {
  const buckets = [PROFILE_BUCKET, BANNER_BUCKET, PROJECT_BUCKET]

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.getBucket(bucket)

    if (error && error.message.includes("does not exist")) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      })

      if (createError) {
        console.error(`Error creating bucket ${bucket}:`, createError)
      } else {
        console.log(`Created bucket: ${bucket}`)
      }
    }
  }
}

// Upload an image to Supabase Storage
export async function uploadImage(file: File, type: "profile" | "banner" | "project") {
  try {
    // Select the appropriate bucket based on the type
    const bucket = type === "profile" ? PROFILE_BUCKET : type === "banner" ? BANNER_BUCKET : PROJECT_BUCKET

    // Create a unique file name to avoid collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw error
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Delete an image from Supabase Storage
export async function deleteImage(url: string) {
  try {
    // Extract the bucket and file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // Find the bucket name in the path
    let bucket = ""
    if (url.includes(PROFILE_BUCKET)) bucket = PROFILE_BUCKET
    else if (url.includes(BANNER_BUCKET)) bucket = BANNER_BUCKET
    else if (url.includes(PROJECT_BUCKET)) bucket = PROJECT_BUCKET
    else return false // Unknown bucket

    // Get the file name (last part of the path)
    const fileName = pathParts[pathParts.length - 1]

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
