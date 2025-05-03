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

-- Create public folder in each bucket
INSERT INTO storage.objects (bucket_id, name, owner, created_at)
VALUES 
  ('profile-images', 'public/', auth.uid(), now()),
  ('banner-images', 'public/', auth.uid(), now()),
  ('project-images', 'public/', auth.uid(), now());

-- Make sure buckets are set to public
UPDATE storage.buckets
SET public = true
WHERE name IN ('profile-images', 'banner-images', 'project-images');
