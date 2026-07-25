-- Smart Ability Innovation Portal - Supabase Database Setup
-- Run this SQL in your Supabase dashboard: SQL Editor → New Query → Paste & Run

-- ============================================================
-- DROP EXISTING TABLES (if they exist with wrong schema)
-- ============================================================
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;

-- ============================================================
-- 1. TEAMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY,
  teamName VARCHAR(255) NOT NULL,
  leaderName VARCHAR(255) NOT NULL,
  leaderEmail VARCHAR(255) NOT NULL UNIQUE,
  college VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  year VARCHAR(50) NOT NULL,
  mobile VARCHAR(20),
  members JSONB DEFAULT '[]',
  membersComplete BOOLEAN DEFAULT FALSE,
  pdfName VARCHAR(255),
  submissionStatus VARCHAR(50) DEFAULT 'not_started',
  submissionDate TIMESTAMP WITH TIME ZONE,
  selectedProjectId VARCHAR(255),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. ACTIVITY_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  userEmail VARCHAR(255),
  action VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_teams_leader_email ON public.teams(leaderEmail);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON public.teams(createdAt);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_email ON public.activity_logs(userEmail);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(createdAt);

-- ============================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. CREATE RLS POLICIES (Allow all for now - restrict later)
-- ============================================================
CREATE POLICY "Allow all on teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Allow all on activity_logs" ON public.activity_logs FOR ALL USING (true);

-- ============================================================
-- EXECUTION COMPLETE
-- ============================================================
-- All tables created successfully!
-- Data storage is now ready for the Smart Ability Innovation Portal.
