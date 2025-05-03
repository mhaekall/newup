-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own objects" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own objects" ON storage.objects;

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON storage.objects
  USING (bucket_id IN ('profile-images', 'banner-images', 'project-images'))
  WITH CHECK (bucket_id IN ('profile-images', 'banner-images', 'project-images'));

-- Create a policy for public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('profile-images', 'banner-images', 'project-images'));

-- Make sure buckets are set to public
UPDATE storage.buckets
SET public = true
WHERE name IN ('profile-images', 'banner-images', 'project-images');
