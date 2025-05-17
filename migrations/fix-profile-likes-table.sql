-- Create profile_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS profile_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liker_id UUID REFERENCES users(id) ON DELETE SET NULL,
  liker_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, liker_id, liker_ip)
);

-- Create function to toggle profile like
CREATE OR REPLACE FUNCTION toggle_profile_like(
  profile_id UUID,
  liker_id UUID DEFAULT NULL,
  liker_ip TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM profile_likes
    WHERE profile_likes.profile_id = toggle_profile_like.profile_id
    AND (
      (profile_likes.liker_id = toggle_profile_like.liker_id AND liker_id IS NOT NULL)
      OR
      (profile_likes.liker_ip = toggle_profile_like.liker_ip AND liker_ip IS NOT NULL AND liker_id IS NULL)
    )
  ) INTO like_exists;

  -- If like exists, delete it
  IF like_exists THEN
    DELETE FROM profile_likes
    WHERE profile_likes.profile_id = toggle_profile_like.profile_id
    AND (
      (profile_likes.liker_id = toggle_profile_like.liker_id AND liker_id IS NOT NULL)
      OR
      (profile_likes.liker_ip = toggle_profile_like.liker_ip AND liker_ip IS NOT NULL AND liker_id IS NULL)
    );
    RETURN FALSE;
  -- If like doesn't exist, insert it
  ELSE
    INSERT INTO profile_likes (profile_id, liker_id, liker_ip)
    VALUES (profile_id, liker_id, liker_ip);
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user has liked a profile
CREATE OR REPLACE FUNCTION has_liked_profile(
  profile_id UUID,
  liker_id UUID DEFAULT NULL,
  liker_ip TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM profile_likes
    WHERE profile_likes.profile_id = has_liked_profile.profile_id
    AND (
      (profile_likes.liker_id = has_liked_profile.liker_id AND liker_id IS NOT NULL)
      OR
      (profile_likes.liker_ip = has_liked_profile.liker_ip AND liker_ip IS NOT NULL AND liker_id IS NULL)
    )
  ) INTO like_exists;

  RETURN like_exists;
END;
$$ LANGUAGE plpgsql;

-- Create function to get profile likes count
CREATE OR REPLACE FUNCTION get_profile_likes_count(
  profile_id UUID
) RETURNS INTEGER AS $$
DECLARE
  likes_count INTEGER;
BEGIN
  SELECT COUNT(*) FROM profile_likes
  WHERE profile_likes.profile_id = get_profile_likes_count.profile_id
  INTO likes_count;

  RETURN likes_count;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on profile_likes table
ALTER TABLE profile_likes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read profile_likes
CREATE POLICY profile_likes_select_policy ON profile_likes
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert their own likes
CREATE POLICY profile_likes_insert_policy ON profile_likes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Create policy to allow authenticated users to delete their own likes
CREATE POLICY profile_likes_delete_policy ON profile_likes
  FOR DELETE USING (
    liker_id = auth.uid()
  );
