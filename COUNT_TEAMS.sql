-- Count registered teams in Supabase
-- Run this in Supabase SQL Editor to see how many teams are registered

SELECT 
  COUNT(*) as total_teams,
  COUNT(CASE WHEN membersComplete = true THEN 1 END) as teams_with_complete_members,
  COUNT(CASE WHEN submissionStatus = 'submitted' THEN 1 END) as teams_with_submission,
  MAX(createdAt) as latest_registration
FROM public.teams;

-- List all teams
SELECT 
  teamName,
  leaderName,
  leaderEmail,
  college,
  department,
  membersComplete,
  submissionStatus,
  createdAt
FROM public.teams
ORDER BY createdAt DESC;

-- Count team members
SELECT COUNT(*) as total_team_members FROM public.team_members;

-- Count activity logs
SELECT COUNT(*) as total_activity_logs FROM public.activity_logs;
