-- Create profile_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS profile_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(profile_id, visitor_id)
);

-- Add RLS policies for profile_likes
ALTER TABLE profile_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert likes
CREATE POLICY insert_profile_likes ON profile_likes
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- Allow anyone to select likes
CREATE POLICY select_profile_likes ON profile_likes
  FOR SELECT TO authenticated, anon
  USING (true);

-- Only allow the visitor to delete their own likes
CREATE POLICY delete_profile_likes ON profile_likes
  FOR DELETE TO authenticated, anon
  USING (visitor_id = current_setting('request.jwt.claims', true)::json->>'sub' OR visitor_id = current_setting('request.headers', true)::json->>'visitor-id');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profile_likes_profile_id_idx ON profile_likes(profile_id);
CREATE INDEX IF NOT EXISTS profile_likes_visitor_id_idx ON profile_likes(visitor_id);
CREATE INDEX IF NOT EXISTS profile_likes_created_date_idx ON profile_likes(created_date);
