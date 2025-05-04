-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Allow all operations for all users" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own objects" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own objects" ON storage.objects;

-- Make sure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create more granular policies for storage.objects
-- Public read access for specific buckets
CREATE POLICY "Public read access for profile images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('profile-images', 'banner-images', 'project-images'));

-- Authenticated users can upload to specific buckets
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('profile-images', 'banner-images', 'project-images')
  );

-- Users can update their own objects
CREATE POLICY "Users can update own objects" ON storage.objects
  FOR UPDATE USING (
    auth.uid() = owner AND
    bucket_id IN ('profile-images', 'banner-images', 'project-images')
  );

-- Users can delete their own objects
CREATE POLICY "Users can delete own objects" ON storage.objects
  FOR DELETE USING (
    auth.uid() = owner AND
    bucket_id IN ('profile-images', 'banner-images', 'project-images')
  );

-- Make sure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on profiles if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create more granular policies for profiles table
-- Anyone can view profiles (they're public)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Only authenticated users can create their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Make sure buckets are set to public
UPDATE storage.buckets
SET public = true
WHERE name IN ('profile-images', 'banner-images', 'project-images');
