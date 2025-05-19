-- Create profile_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON public.profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_visitor_id ON public.profile_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON public.profile_views(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_date ON public.profile_views(created_date);

-- Add RLS policies
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a profile view
CREATE POLICY insert_profile_views ON public.profile_views
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- Allow profile owners to view their profile views
CREATE POLICY select_profile_views ON public.profile_views
  FOR SELECT TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow service role to do anything
CREATE POLICY service_role_policy ON public.profile_views
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT ON public.profile_views TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.profile_views_id_seq TO anon, authenticated, service_role;
