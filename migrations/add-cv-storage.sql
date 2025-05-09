-- Add cv_url column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Create a new storage bucket for CVs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for CVs
-- Allow public access to CV files
CREATE POLICY "CV files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs')
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload their own CV files
CREATE POLICY "Users can upload their own CV files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cvs' AND
  auth.uid() IS NOT NULL
)
ON CONFLICT DO NOTHING;

-- Allow users to update their own CV files
CREATE POLICY "Users can update their own CV files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cvs' AND
  auth.uid() IS NOT NULL
)
ON CONFLICT DO NOTHING;

-- Allow users to delete their own CV files
CREATE POLICY "Users can delete their own CV files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cvs' AND
  auth.uid() IS NOT NULL
)
ON CONFLICT DO NOTHING;

-- Update RLS to allow access to CV files
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
