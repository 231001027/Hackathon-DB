-- Clear All Teams & Activity Logs from Supabase
-- WARNING: This will DELETE ALL data. Run only if you want to reset the database.

-- Step 1: Delete all activity logs first (no foreign key constraint)
DELETE FROM public.activity_logs;

-- Step 2: Delete all team members (has foreign key to teams)
DELETE FROM public.team_members;

-- Step 3: Delete all teams
DELETE FROM public.teams;

-- Verification: Check if data is cleared
SELECT COUNT(*) as teams_count FROM public.teams;
SELECT COUNT(*) as members_count FROM public.team_members;
SELECT COUNT(*) as logs_count FROM public.activity_logs;

-- If counts show 0, all data is cleared successfully ✅
