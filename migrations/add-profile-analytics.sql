-- Create profile_views table
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL REFERENCES profiles(username) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, visitor_id, created_at)
);

-- Create profile_likes table
CREATE TABLE IF NOT EXISTS profile_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL REFERENCES profiles(username) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, visitor_id)
);

-- Create profile_stats table for aggregated stats
CREATE TABLE IF NOT EXISTS profile_stats (
  username TEXT PRIMARY KEY REFERENCES profiles(username) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_profile_stats_updated_at
BEFORE UPDATE ON profile_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_stats ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile stats
CREATE POLICY profile_views_select ON profile_views
  FOR SELECT USING (
    username IN (
      SELECT username FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY profile_likes_select ON profile_likes
  FOR SELECT USING (
    username IN (
      SELECT username FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY profile_stats_select ON profile_stats
  FOR SELECT USING (
    username IN (
      SELECT username FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to view public profile stats
CREATE POLICY profile_stats_select_public ON profile_stats
  FOR SELECT USING (true);

-- Allow service role to manage all tables
CREATE POLICY profile_views_service_role ON profile_views
  USING (auth.role() = 'service_role');

CREATE POLICY profile_likes_service_role ON profile_likes
  USING (auth.role() = 'service_role');

CREATE POLICY profile_stats_service_role ON profile_stats
  USING (auth.role() = 'service_role');
