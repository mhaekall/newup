import { supabase } from "./supabase"

// Function to set up Supabase storage buckets and policies
export async function setupSupabaseStorage() {
  try {
    console.log("Setting up Supabase storage...")

    // Define bucket names
    const buckets = ["profile-images", "banner-images", "project-images"]

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

    console.log("Supabase storage setup completed")
    return true
  } catch (error) {
    console.error("Error setting up Supabase storage:", error)
    return false
  }
}

// Function to create SQL for RLS policies (run this in Supabase SQL editor)
export function getRLSPoliciesSQL() {
  return `
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to all buckets
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('profile-images', 'banner-images', 'project-images'));

-- Policy for authenticated users to insert into buckets
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('profile-images', 'banner-images', 'project-images')
  );

-- Policy for users to update their own objects
CREATE POLICY "Users can update own objects" ON storage.objects
  FOR UPDATE USING (
    auth.uid() = owner AND
    bucket_id IN ('profile-images', 'banner-images', 'project-images')
  );

-- Policy for users to delete their own objects
CREATE POLICY "Users can delete own objects" ON storage.objects
  FOR DELETE USING (
    auth.uid() = owner AND
    bucket_id IN ('profile-images', 'banner-images', 'project-images')
  );
  `
}
