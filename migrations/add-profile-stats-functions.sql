-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(profile_id_param UUID)
RETURNS void AS $$
BEGIN
  -- Try to update existing record
  UPDATE profile_stats
  SET view_count = view_count + 1
  WHERE profile_id = profile_id_param;
  
  -- If no record exists, insert one
  IF NOT FOUND THEN
    INSERT INTO profile_stats (profile_id, view_count, like_count)
    VALUES (profile_id_param, 1, 0);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to increment profile likes
CREATE OR REPLACE FUNCTION increment_profile_likes(profile_id_param UUID)
RETURNS void AS $$
BEGIN
  -- Try to update existing record
  UPDATE profile_stats
  SET like_count = like_count + 1
  WHERE profile_id = profile_id_param;
  
  -- If no record exists, insert one
  IF NOT FOUND THEN
    INSERT INTO profile_stats (profile_id, view_count, like_count)
    VALUES (profile_id_param, 0, 1);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement profile likes
CREATE OR REPLACE FUNCTION decrement_profile_likes(profile_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE profile_stats
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE profile_id = profile_id_param;
END;
$$ LANGUAGE plpgsql;
