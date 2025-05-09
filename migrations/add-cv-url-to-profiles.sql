-- Add cv_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Create a new storage bucket for CVs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for CVs
CREATE POLICY "CV files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs');

CREATE POLICY "Users can upload their own CV files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cvs' AND
  auth.uid() = (SELECT user_id FROM profiles WHERE id::text = SPLIT_PART(name, '/', 1))
);

CREATE POLICY "Users can update their own CV files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cvs' AND
  auth.uid() = (SELECT user_id FROM profiles WHERE id::text = SPLIT_PART(name, '/', 1))
);

CREATE POLICY "Users can delete their own CV files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cvs' AND
  auth.uid() = (SELECT user_id FROM profiles WHERE id::text = SPLIT_PART(name, '/', 1))
);
