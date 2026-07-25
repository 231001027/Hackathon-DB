-- Smart Ability Innovation Portal - Supabase Database Setup
-- Run this SQL in your Supabase dashboard: SQL Editor → New Query → Paste & Run

-- ============================================================
-- 1. TEAMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  leader_name VARCHAR(255) NOT NULL,
  leader_email VARCHAR(255) NOT NULL UNIQUE,
  college VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  year VARCHAR(50) NOT NULL,
  mobile VARCHAR(20),
  members JSONB DEFAULT '[]',
  members_complete BOOLEAN DEFAULT FALSE,
  pdf_name VARCHAR(255),
  submission_status VARCHAR(50) DEFAULT 'not_started',
  submission_date TIMESTAMP WITH TIME ZONE,
  selected_project_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. TEAM_MEMBERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  year VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. ACTIVITY_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  user_email VARCHAR(255),
  action VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  project_number INTEGER,
  title VARCHAR(255) NOT NULL,
  abstract TEXT,
  track VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  pdf_url VARCHAR(255),
  pdf_name VARCHAR(255),
  submission_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_teams_leader_email ON public.teams(leader_email);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON public.teams(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_email ON public.activity_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON public.projects(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team_id ON public.submissions(team_id);

-- ============================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. CREATE RLS POLICIES (Allow all for now - restrict later)
-- ============================================================
CREATE POLICY "Allow all on teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Allow all on team_members" ON public.team_members FOR ALL USING (true);
CREATE POLICY "Allow all on activity_logs" ON public.activity_logs FOR ALL USING (true);
CREATE POLICY "Allow all on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow all on submissions" ON public.submissions FOR ALL USING (true);

-- ============================================================
-- EXECUTION COMPLETE
-- ============================================================
-- All tables created successfully!
-- Data storage is now ready for the Smart Ability Innovation Portal.
