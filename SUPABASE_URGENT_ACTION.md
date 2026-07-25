# 🔴 URGENT: Run This SQL in Supabase NOW

The 404 error means **the tables don't exist yet in your Supabase database**.

## ⏱️ Quick Fix (2 Minutes)

### Step 1: Open Supabase SQL Editor
Go to: https://app.supabase.com → Select your project → **SQL Editor**

### Step 2: Create New Query
Click **New Query** button in the top-right

### Step 3: Copy ALL This SQL

```sql
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;

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

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  userEmail VARCHAR(255),
  action VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teams_leader_email ON public.teams(leaderEmail);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON public.teams(createdAt);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_email ON public.activity_logs(userEmail);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(createdAt);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Allow all on activity_logs" ON public.activity_logs FOR ALL USING (true);
```

### Step 4: Click RUN
- Wait 5-10 seconds
- You should see: ✅ Success

### Step 5: Verify Tables Exist
- Go to **Table Editor** (left sidebar)
- You should see:
  - `teams` table
  - `activity_logs` table

### Step 6: Test Your App
- Go to: https://hackathon-db-six.vercel.app/
- Try registering a team
- Data should now save ✅

## ✅ Expected Result
After running this SQL:
- No more 404 errors
- Team registration will save to Supabase
- Activity logs will be recorded
- App is ready for production

## ⚠️ If Still Getting 404
1. Hard refresh your browser (Ctrl+Shift+R)
2. Check Table Editor - do both tables exist?
3. Try registering again

---

**This is the ONLY step needed to fix the 404 error.**
