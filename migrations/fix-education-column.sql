-- Periksa apakah kolom education sudah ada di tabel profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'education'
  ) THEN
    -- Tambahkan kolom education jika belum ada
    ALTER TABLE profiles ADD COLUMN education JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Pastikan kolom education tidak NULL
UPDATE profiles SET education = '[]'::jsonb WHERE education IS NULL;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
