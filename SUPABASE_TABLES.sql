-- ============================================================
-- Smart Ability Hackathon Portal - Database Schema
-- Run this SQL in Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 2. TEAMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  leader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college TEXT,
  password TEXT NOT NULL,
  project_id UUID,
  project_title TEXT,
  abstract TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'rejected', 'selected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_teams_leader_id ON teams(leader_id);
CREATE INDEX idx_teams_status ON teams(status);

-- ============================================================
-- 3. TEAM MEMBERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_email ON team_members(email);

-- ============================================================
-- 4. PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  abstract TEXT,
  problem_statement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- 5. SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  pdf_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_submissions_team_id ON submissions(team_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================================
-- 6. ACTIVITY LOGS TABLE (for debugging)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  details JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public to view projects
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);

-- Allow users to view their own teams
CREATE POLICY "Users can view their own teams" ON teams FOR SELECT 
  USING (leader_id = auth.uid() OR auth.role() = 'admin');

-- Allow team leaders to update their teams
CREATE POLICY "Team leaders can update their teams" ON teams FOR UPDATE 
  USING (leader_id = auth.uid() OR auth.role() = 'admin');

-- Allow users to view their team members
CREATE POLICY "Users can view their team members" ON team_members FOR SELECT 
  USING (team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid()) OR auth.role() = 'admin');

-- Allow everyone to insert activity logs
CREATE POLICY "Anyone can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Allow public to insert teams (registration)
CREATE POLICY "Anyone can insert teams" ON teams FOR INSERT WITH CHECK (true);

-- Allow everyone to view activity logs (for now - restrict in production)
CREATE POLICY "Activity logs are viewable by everyone" ON activity_logs FOR SELECT USING (true);

-- ============================================================
-- 8. VERIFY TABLES CREATED
-- ============================================================
-- Run this to verify all tables exist:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('users', 'teams', 'team_members', 'projects', 'submissions', 'activity_logs');
