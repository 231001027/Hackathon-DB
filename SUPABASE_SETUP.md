# Supabase Integration Guide

Complete setup guide for connecting the Hackathon Portal to Supabase database.

---

## Table of Contents

1. [What is Supabase](#what-is-supabase)
2. [Create Supabase Project](#create-supabase-project)
3. [Required Credentials](#required-credentials)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Integration Testing](#integration-testing)
7. [Troubleshooting](#troubleshooting)

---

## What is Supabase

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Real-time subscriptions
- Authentication
- Storage for files
- Edge Functions

Perfect for production-grade applications.

---

## Create Supabase Project

### Step 1: Sign Up

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with email or GitHub

### Step 2: Create Organization

1. Enter organization name
2. Click "Create organization"

### Step 3: Create Project

1. Click "New Project"
2. Fill in project details:
   - **Project name**: `hackathon-portal`
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
3. Click "Create new project"
4. Wait for project initialization (2-3 minutes)

---

## Required Credentials

### ✅ Credentials You'll Need

After your Supabase project is created:

1. **VITE_SUPABASE_URL**
   - Location: Project Settings → API → Project URL
   - Example: `https://your-project.supabase.co`
   - This is your Supabase project's base URL

2. **VITE_SUPABASE_ANON_KEY**
   - Location: Project Settings → API → Project API Keys → anon (public)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This is the anonymous/public key for client-side requests

3. **Database Password** (for migrations only)
   - Shown during project creation
   - Stored in Project Settings → Database → Connection pooling
   - Not needed for frontend - stored securely

---

## Database Setup

### Step 1: Create Tables

The portal requires these tables in your Supabase database:

#### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 2. teams
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  leader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  password TEXT NOT NULL,
  project_id UUID,
  project_title TEXT,
  abstract TEXT,
  status TEXT CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected')) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 3. team_members
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  role TEXT CHECK (role IN ('leader', 'core', 'extended')) DEFAULT 'core',
  enrollment_no TEXT,
  semester INTEGER,
  status TEXT CHECK (status IN ('invited', 'accepted', 'rejected')) DEFAULT 'invited',
  joined_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 4. projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  requirements TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 5. submissions
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT,
  repository_url TEXT,
  demo_url TEXT,
  status TEXT CHECK (status IN ('draft', 'submitted', 'evaluated', 'winner')) DEFAULT 'draft',
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 6. analytics
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT now(),
  metadata JSONB
);
```

### Step 2: Run SQL Queries

1. Go to Supabase Dashboard
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy and paste each CREATE TABLE statement above
5. Click "Run" for each query

### Step 3: Enable Row Level Security (RLS)

1. Go to "Authentication" → "Policies" in Supabase
2. For each table, set up policies:

**Example for teams table:**
```sql
-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow students to see own teams
CREATE POLICY "Students can view own teams" ON teams
  FOR SELECT USING (auth.uid() = leader_id);

-- Allow students to create teams
CREATE POLICY "Students can create teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = leader_id);

-- Allow students to update own teams
CREATE POLICY "Students can update own teams" ON teams
  FOR UPDATE USING (auth.uid() = leader_id);
```

---

## Environment Configuration

### Step 1: Copy Environment File

```bash
cp .env.example .env
```

### Step 2: Get Credentials from Supabase

1. Open your Supabase project dashboard
2. Click "Settings" (gear icon) → "API"
3. Copy the following:

#### Find Your URL:
- Under "Project URL"
- Looks like: `https://your-project.supabase.co`

#### Find Your Keys:
- Under "Project API Keys"
- Copy the **anon (public)** key (NOT the service_role key)

### Step 3: Update .env File

Open `.env` and fill in:

```env
# Your actual credentials from Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep other settings as default
VITE_MODE=development
VITE_API_URL=http://localhost:5174
# ... rest of settings
```

### Step 4: Verify Connection

```bash
npm run dev
```

If it starts without errors, Supabase is connected! ✅

---

## Integration Testing

### Test 1: Authentication

```typescript
import { signUp, signIn } from '@/services/supabase/auth.service';

// Test sign up
const result = await signUp({
  email: 'test@example.com',
  password: 'TestPass123!',
  fullName: 'Test User',
  role: 'student'
});

console.log(result); // Should show user object or error
```

### Test 2: Teams

```typescript
import { createTeam, getTeamById } from '@/services/supabase/teams.service';

// Test create team
const result = await createTeam({
  name: 'Test Team',
  leader_id: 'user-uuid',
  college: 'Test College',
  department: 'Computer Science',
  password: 'TeamPass123!'
});

console.log(result); // Should show team object
```

### Test 3: Members

```typescript
import { addTeamMember, getTeamMembers } from '@/services/supabase/members.service';

// Test add member
const result = await addTeamMember({
  team_id: 'team-uuid',
  full_name: 'Member Name',
  email: 'member@example.com',
  mobile: '9876543210',
  role: 'core'
});

console.log(result);
```

---

## API Reference

### Authentication Service

```typescript
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getCurrentSession,
  resetPassword,
  updatePassword,
  onAuthStateChange
} from '@/services/supabase/auth.service';
```

### Teams Service

```typescript
import {
  createTeam,
  getTeamById,
  getTeamsByLeader,
  getAllTeams,
  updateTeam,
  deleteTeam,
  selectProject,
  getTeamStats
} from '@/services/supabase/teams.service';
```

### Members Service

```typescript
import {
  addTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  removeTeamMember,
  acceptInvitation,
  rejectInvitation,
  getMemberStats
} from '@/services/supabase/members.service';
```

### Projects Service

```typescript
import {
  getAllProjects,
  getProjectById,
  getProjectsByDifficulty,
  searchProjects,
  createProject,
  getProjectsStats
} from '@/services/supabase/projects.service';
```

### Submissions Service

```typescript
import {
  createSubmission,
  getSubmissionsByTeam,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  submitSubmission,
  evaluateSubmission,
  getSubmissionStats
} from '@/services/supabase/submissions.service';
```

---

## Troubleshooting

### Error: "Missing VITE_SUPABASE_URL"

**Solution:**
```bash
# Check .env file exists and has correct format
cat .env | grep VITE_SUPABASE

# Should output:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=...
```

### Error: "Invalid credentials"

**Solution:**
1. Double-check URL format: `https://your-project.supabase.co`
2. Verify anon key is NOT the service_role key
3. Keys are case-sensitive - copy exactly
4. Project URL should have `.supabase.co` domain

### Error: "Table 'users' doesn't exist"

**Solution:**
1. Go to Supabase dashboard
2. Click "SQL Editor"
3. Run the CREATE TABLE queries above
4. Verify tables appear in "Tables" sidebar

### Connection timeout

**Solution:**
1. Check internet connection
2. Verify project is active (not paused)
3. Check if organization is on free/paid plan
4. Try different region when creating project

### Auth not working

**Solution:**
1. Enable email provider: Auth → Providers → Email
2. Set redirect URL: Auth → URL Configuration → Site URL = `http://localhost:5173`
3. Verify user created in Auth → Users

---

## Security Best Practices

### ✅ Do's

- Keep `.env` file in `.gitignore` (already done)
- Use environment variables for all secrets
- Never commit real credentials to Git
- Use RLS (Row Level Security) policies
- Rotate keys regularly in production

### ❌ Don'ts

- Don't use service_role key in frontend (use anon key)
- Don't hardcode credentials
- Don't commit `.env` file
- Don't share credentials in chat/email
- Don't allow direct database access from frontend

---

## Next Steps

1. ✅ Create Supabase account and project
2. ✅ Copy credentials to `.env` file
3. ✅ Create database tables
4. ✅ Test connection with `npm run dev`
5. ✅ Run integration tests
6. ✅ Start using services in components

---

## Helpful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Authentication Guide](https://supabase.com/docs/guides/auth)

---

**Status**: Ready for setup ✅  
**Last Updated**: July 24, 2026  
**Version**: 1.0.0
