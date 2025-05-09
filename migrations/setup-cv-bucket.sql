-- Create a policy to allow authenticated users to upload CVs
CREATE POLICY "Allow authenticated users to upload CVs" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy to allow users to update their own CVs
CREATE POLICY "Allow users to update their own CVs" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy to allow users to delete their own CVs
CREATE POLICY "Allow users to delete their own CVs" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy to allow public access to read CVs
CREATE POLICY "Allow public access to read CVs" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'cvs');
