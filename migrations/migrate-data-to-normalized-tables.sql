-- Migrasi data dari format lama (JSON) ke format baru (tabel terpisah)

-- Fungsi untuk migrasi data
CREATE OR REPLACE FUNCTION migrate_profile_data()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    link_record RECORD;
    education_record RECORD;
    experience_record RECORD;
    skill_record RECORD;
    project_record RECORD;
    technology TEXT;
    project_id UUID;
BEGIN
    -- Loop melalui semua profil
    FOR profile_record IN SELECT * FROM profiles LOOP
        -- Migrasi links
        IF profile_record.links IS NOT NULL AND jsonb_array_length(profile_record.links) > 0 THEN
            FOR link_record IN SELECT * FROM jsonb_to_recordset(profile_record.links) AS x(label text, url text, icon text) LOOP
                INSERT INTO links (profile_id, label, url, icon)
                VALUES (profile_record.id, link_record.label, link_record.url, link_record.icon);
            END LOOP;
        END IF;

        -- Migrasi education
        IF profile_record.education IS NOT NULL AND jsonb_array_length(profile_record.education) > 0 THEN
            FOR education_record IN SELECT * FROM jsonb_to_recordset(profile_record.education) 
                AS x(institution text, degree text, field text, "startDate" text, "endDate" text, description text) LOOP
                INSERT INTO education (profile_id, institution, degree, field, start_date, end_date, description)
                VALUES (
                    profile_record.id, 
                    education_record.institution, 
                    education_record.degree, 
                    education_record.field, 
                    education_record."startDate", 
                    education_record."endDate", 
                    education_record.description
                );
            END LOOP;
        END IF;

        -- Migrasi experience
        IF profile_record.experience IS NOT NULL AND jsonb_array_length(profile_record.experience) > 0 THEN
            FOR experience_record IN SELECT * FROM jsonb_to_recordset(profile_record.experience) 
                AS x(company text, position text, "startDate" text, "endDate" text, description text, location text) LOOP
                INSERT INTO experience (profile_id, company, position, start_date, end_date, description, location)
                VALUES (
                    profile_record.id, 
                    experience_record.company, 
                    experience_record.position, 
                    experience_record."startDate", 
                    experience_record."endDate", 
                    experience_record.description,
                    experience_record.location
                );
            END LOOP;
        END IF;

        -- Migrasi skills
        IF profile_record.skills IS NOT NULL AND jsonb_array_length(profile_record.skills) > 0 THEN
            FOR skill_record IN SELECT * FROM jsonb_to_recordset(profile_record.skills) 
                AS x(name text, level int, category text) LOOP
                INSERT INTO skills (profile_id, name, level, category)
                VALUES (
                    profile_record.id, 
                    skill_record.name, 
                    skill_record.level, 
                    skill_record.category
                );
            END LOOP;
        END IF;

        -- Migrasi projects
        IF profile_record.projects IS NOT NULL AND jsonb_array_length(profile_record.projects) > 0 THEN
            FOR project_record IN SELECT * FROM jsonb_to_recordset(profile_record.projects) 
                AS x(title text, description text, technologies jsonb, url text, image text) LOOP
                
                -- Insert project
                INSERT INTO projects (profile_id, title, description, url, image)
                VALUES (
                    profile_record.id, 
                    project_record.title, 
                    project_record.description, 
                    project_record.url, 
                    project_record.image
                )
                RETURNING id INTO project_id;
                
                -- Insert technologies
                IF project_record.technologies IS NOT NULL AND jsonb_array_length(project_record.technologies) > 0 THEN
                    FOR technology IN SELECT * FROM jsonb_array_elements_text(project_record.technologies) LOOP
                        INSERT INTO project_technologies (project_id, technology)
                        VALUES (project_id, technology);
                    END LOOP;
                END IF;
            END LOOP;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Jalankan fungsi migrasi
SELECT migrate_profile_data();

-- Hapus fungsi setelah digunakan
DROP FUNCTION migrate_profile_data();
