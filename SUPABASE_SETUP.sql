-- ==========================================================
-- SMART ABILITY HACKATHON DATABASE
-- PART 1 - DATABASE TABLES
-- ==========================================================

-- Remove old tables (safe for fresh setup)

DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-------------------------------------------------------------
-- TEAMS TABLE
-------------------------------------------------------------

CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    teamName TEXT NOT NULL UNIQUE,
    leaderName TEXT NOT NULL,
    leaderEmail TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    mobile TEXT,
    members JSONB DEFAULT '[]',
    membersComplete BOOLEAN DEFAULT FALSE,
    selectedProjectId TEXT,
    pdfName TEXT,
    submissionStatus TEXT DEFAULT 'not_started',
    submissionDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------------------
-- TEAM MEMBERS TABLE
-------------------------------------------------------------

CREATE TABLE team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    joined_at TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_team_member
    FOREIGN KEY(team_id)
    REFERENCES teams(id)
    ON DELETE CASCADE
);

-------------------------------------------------------------
-- INDEXES FOR TEAMS & MEMBERS
-------------------------------------------------------------

CREATE INDEX idx_team_email ON teams(leaderEmail);
CREATE INDEX idx_team_name ON teams(teamName);
CREATE INDEX idx_member_team ON team_members(team_id);
CREATE INDEX idx_member_email ON team_members(email);

-- ==========================================================
-- PART 2 - PROJECTS & SUBMISSIONS
-- ==========================================================

-------------------------------------------------------------
-- PROJECTS TABLE
-------------------------------------------------------------

CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    problem_statement TEXT,
    difficulty TEXT DEFAULT 'beginner',
    domain TEXT,
    technology TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------------------
-- SUBMISSIONS TABLE
-------------------------------------------------------------

CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    project_id TEXT,
    pdfName TEXT,
    fileUrl TEXT,
    status TEXT DEFAULT 'draft',
    score NUMERIC(5,2),
    feedback TEXT,
    submittedAt TIMESTAMP,
    evaluatedAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_submission_team
        FOREIGN KEY(team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_submission_project
        FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL
);

-------------------------------------------------------------
-- LINK TEAM → PROJECT
-------------------------------------------------------------

ALTER TABLE teams
ADD CONSTRAINT fk_selected_project
FOREIGN KEY(selectedProjectId)
REFERENCES projects(id)
ON DELETE SET NULL;

-------------------------------------------------------------
-- INDEXES FOR PROJECTS & SUBMISSIONS
-------------------------------------------------------------

CREATE INDEX idx_project_title ON projects(title);
CREATE INDEX idx_project_difficulty ON projects(difficulty);
CREATE INDEX idx_submission_team ON submissions(team_id);
CREATE INDEX idx_submission_project ON submissions(project_id);
CREATE INDEX idx_submission_status ON submissions(status);

-- ==========================================================
-- PART 3 - ACTIVITY LOGS & TRIGGERS
-- ==========================================================

-------------------------------------------------------------
-- ACTIVITY LOGS
-------------------------------------------------------------

CREATE TABLE activity_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    createdAt TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------------------
-- INDEXES FOR ACTIVITY LOGS
-------------------------------------------------------------

CREATE INDEX idx_activity_action ON activity_logs(action);
CREATE INDEX idx_activity_created ON activity_logs(createdAt);

-------------------------------------------------------------
-- AUTOMATIC updatedAt TRIGGER
-------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-------------------------------------------------------------
-- TEAMS TRIGGER
-------------------------------------------------------------

CREATE TRIGGER trigger_update_teams
BEFORE UPDATE
ON teams
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-------------------------------------------------------------
-- PROJECTS TRIGGER
-------------------------------------------------------------

CREATE TRIGGER trigger_update_projects
BEFORE UPDATE
ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-------------------------------------------------------------
-- SUBMISSIONS TRIGGER
-------------------------------------------------------------

CREATE TRIGGER trigger_update_submissions
BEFORE UPDATE
ON submissions
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- ==========================================================
-- PART 4 - RLS & POLICIES
-- ==========================================================

-------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-------------------------------------------------------------

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------
-- DROP OLD POLICIES (SAFE TO RE-RUN)
-------------------------------------------------------------

DROP POLICY IF EXISTS "Allow all teams" ON teams;
DROP POLICY IF EXISTS "Allow all members" ON team_members;
DROP POLICY IF EXISTS "Allow all projects" ON projects;
DROP POLICY IF EXISTS "Allow all submissions" ON submissions;
DROP POLICY IF EXISTS "Allow all activity_logs" ON activity_logs;

-------------------------------------------------------------
-- DEVELOPMENT POLICIES
-------------------------------------------------------------

CREATE POLICY "Allow all teams"
ON teams
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all members"
ON team_members
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all projects"
ON projects
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all submissions"
ON submissions
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all activity_logs"
ON activity_logs
FOR ALL
USING (true)
WITH CHECK (true);

-- ==========================================================
-- PART 5 - SAMPLE PROJECTS (OPTIONAL)
-- ==========================================================

INSERT INTO projects
(id, title, abstract, problem_statement, difficulty, domain, technology)
VALUES
(
    'P001',
    'Smart Wheelchair',
    'AI powered wheelchair navigation',
    'Assist physically challenged people',
    'beginner',
    'Healthcare',
    'React, Python'
),
(
    'P002',
    'Sign Language Translator',
    'Convert sign language into text and speech',
    'Assist hearing impaired people',
    'intermediate',
    'AI',
    'Python, OpenCV'
),
(
    'P003',
    'Smart Classroom',
    'AI classroom assistant for disabled students',
    'Inclusive education',
    'advanced',
    'Education',
    'React, TensorFlow'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- DATABASE SETUP COMPLETE
-- ==========================================================

-- Summary:
-- ✅ 5 Tables Created (teams, team_members, projects, submissions, activity_logs)
-- ✅ Foreign Keys Configured
-- ✅ Indexes Created for Performance
-- ✅ Triggers Setup for updatedAt
-- ✅ RLS Policies Enabled
-- ✅ Sample Projects Inserted
