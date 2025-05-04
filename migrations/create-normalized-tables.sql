-- Buat tabel users jika belum ada
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel profiles jika belum ada
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  template_id TEXT NOT NULL DEFAULT 'template1',
  profile_image TEXT,
  banner_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel links
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel education
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 3,
  category TEXT NOT NULL DEFAULT 'Technical',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel project_technologies untuk relasi many-to-many
CREATE TABLE IF NOT EXISTS project_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel contact_info
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  telegram TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tambahkan trigger untuk update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tambahkan trigger untuk setiap tabel
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_links_timestamp
BEFORE UPDATE ON links
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_education_timestamp
BEFORE UPDATE ON education
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_experience_timestamp
BEFORE UPDATE ON experience
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_skills_timestamp
BEFORE UPDATE ON skills
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contact_info_timestamp
BEFORE UPDATE ON contact_info
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Tambahkan RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Policies untuk profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies untuk links
CREATE POLICY "Public links are viewable by everyone" ON links
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own links" ON links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = links.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = links.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = links.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Policies untuk education (sama dengan links)
CREATE POLICY "Public education is viewable by everyone" ON education
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own education" ON education
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = education.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own education" ON education
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = education.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own education" ON education
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = education.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Policies untuk experience (sama dengan links)
CREATE POLICY "Public experience is viewable by everyone" ON experience
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own experience" ON experience
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = experience.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own experience" ON experience
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = experience.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own experience" ON experience
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = experience.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Policies untuk skills (sama dengan links)
CREATE POLICY "Public skills are viewable by everyone" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own skills" ON skills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = skills.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own skills" ON skills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = skills.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = skills.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Policies untuk projects (sama dengan links)
CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Policies untuk project_technologies
CREATE POLICY "Public project technologies are viewable by everyone" ON project_technologies
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own project technologies" ON project_technologies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      JOIN profiles ON projects.profile_id = profiles.id
      WHERE projects.id = project_technologies.project_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own project technologies" ON project_technologies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN profiles ON projects.profile_id = profiles.id
      WHERE projects.id = project_technologies.project_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Policies untuk contact_info
CREATE POLICY "Public contact info is viewable by everyone" ON contact_info
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own contact info" ON contact_info
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = contact_info.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own contact info" ON contact_info
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = contact_info.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own contact info" ON contact_info
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = contact_info.profile_id
      AND profiles.user_id = auth.uid()
    )
  );
