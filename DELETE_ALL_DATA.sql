-- ============================================================
-- DELETE ALL DATA FROM SUPABASE TABLES
-- WARNING: This will permanently delete all records!
-- Run this in Supabase Dashboard: SQL Editor → New Query
-- ============================================================

-- Disable foreign key constraints temporarily
SET session_replication_role = replica;

-- Delete all records from tables (order matters due to FKs)
DELETE FROM public.activity_logs;
DELETE FROM public.team_members;
DELETE FROM public.teams;

-- Re-enable foreign key constraints
SET session_replication_role = default;

-- Verify deletion
SELECT 'Teams' as table_name, COUNT(*) as record_count FROM public.teams
UNION ALL
SELECT 'Team Members', COUNT(*) FROM public.team_members
UNION ALL
SELECT 'Activity Logs', COUNT(*) FROM public.activity_logs;

-- ============================================================
-- All data deleted successfully!
-- Tables are now empty and ready for new registrations.
-- ============================================================
