-- Add cv_url column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'cv_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN cv_url TEXT;
    END IF;
END $$;

-- Create a function to handle CV uploads
CREATE OR REPLACE FUNCTION handle_cv_upload()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate CV URL if provided
    IF NEW.cv_url IS NOT NULL THEN
        -- Check if URL is valid
        IF NEW.cv_url !~ '^https?://cvs/' THEN
            RAISE EXCEPTION 'Invalid CV URL format: %', NEW.cv_url;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate CV uploads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'validate_cv_upload'
    ) THEN
        CREATE TRIGGER validate_cv_upload
        BEFORE INSERT OR UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION handle_cv_upload();
    END IF;
END $$;

-- Create RLS policies for CV access
-- Allow users to update their own CV
CREATE POLICY update_own_cv ON profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow anyone to view CVs (they are public)
CREATE POLICY read_any_cv ON profiles
    FOR SELECT
    USING (true);

-- Log that migration completed successfully
DO $$
BEGIN
    RAISE NOTICE 'CV storage migration completed successfully';
END $$;
