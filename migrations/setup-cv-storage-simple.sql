-- First, check if the 'cvs' bucket exists, and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'cvs'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('cvs', 'cvs', true);
    END IF;
END $$;

-- Remove any existing RLS policies on the bucket to start fresh
DROP POLICY IF EXISTS "Allow all bucket access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to CVs" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to access own CVs" ON storage.objects;

-- Create a simple policy that allows any authenticated user to do anything with CVs
CREATE POLICY "Allow authenticated users full access to CVs" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'cvs')
WITH CHECK (bucket_id = 'cvs');

-- Allow public read access to all CVs
CREATE POLICY "Allow public access to read CVs" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'cvs');

-- Enable RLS on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
