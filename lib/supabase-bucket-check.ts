import { supabase } from "./supabase"
import { CV_BUCKET } from "./supabase-storage"

export async function checkBucketExists(bucketName: string): Promise<boolean> {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`)
    const { data, error } = await supabase.storage.getBucket(bucketName)

    if (error) {
      console.error(`Error checking bucket ${bucketName}:`, error)
      return false
    }

    console.log(`Bucket ${bucketName} exists:`, data)
    return true
  } catch (error) {
    console.error(`Exception checking bucket ${bucketName}:`, error)
    return false
  }
}

export async function createBucketIfNotExists(bucketName: string): Promise<boolean> {
  try {
    // First check if bucket exists
    const exists = await checkBucketExists(bucketName)

    if (exists) {
      console.log(`Bucket ${bucketName} already exists`)
      return true
    }

    // Create the bucket if it doesn't exist
    console.log(`Creating bucket ${bucketName}...`)
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
    })

    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error)
      return false
    }

    console.log(`Bucket ${bucketName} created successfully`)
    return true
  } catch (error) {
    console.error(`Exception creating bucket ${bucketName}:`, error)
    return false
  }
}

// Function to ensure CV bucket exists
export async function ensureCVBucketExists(): Promise<boolean> {
  return await createBucketIfNotExists(CV_BUCKET)
}
