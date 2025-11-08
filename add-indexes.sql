-- Performance Indexes for Private Schools Georgia Database
-- This script adds indexes to improve query performance
-- SAFE TO RUN: Only creates indexes, does not modify data

-- Check if indexes already exist before creating (prevents errors)

-- Index on SchoolData.name for faster school name searches
CREATE INDEX IF NOT EXISTS "SchoolData_name_idx" ON "SchoolData"("name");

-- Indexes on Address for faster location-based searches
CREATE INDEX IF NOT EXISTS "Address_city_idx" ON "Address"("city");
CREATE INDEX IF NOT EXISTS "Address_district_idx" ON "Address"("district");

-- Indexes on education level foreign keys (if not already unique indexes)
CREATE INDEX IF NOT EXISTS "Primary_schoolId_idx" ON "Primary"("schoolId");
CREATE INDEX IF NOT EXISTS "Basic_schoolId_idx" ON "Basic"("schoolId");
CREATE INDEX IF NOT EXISTS "Secondary_schoolId_idx" ON "Secondary"("schoolId");

-- Indexes on Media foreign keys for faster media lookups
CREATE INDEX IF NOT EXISTS "media_school_id_idx" ON "media"("school_id");
CREATE INDEX IF NOT EXISTS "media_basic_id_idx" ON "media"("basic_id");
CREATE INDEX IF NOT EXISTS "media_primary_id_idx" ON "media"("primary_id");
CREATE INDEX IF NOT EXISTS "media_secondary_id_idx" ON "media"("secondary_id");

-- Index on LevelMandatorySport for faster sport lookups
CREATE INDEX IF NOT EXISTS "LevelMandatorySport_school_id_idx" ON "LevelMandatorySport"("school_id");

-- Verify indexes were created
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND tablename IN ('SchoolData', 'Address', 'Primary', 'Basic', 'Secondary', 'media', 'LevelMandatorySport')
ORDER BY
    tablename,
    indexname;
