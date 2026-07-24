# Production Setup Guide - Step by Step

Complete guide to set up database, enable auth, test features, and deploy.

---

## TABLE OF CONTENTS

1. [Step 1: Create Database Tables](#step-1-create-database-tables) ← START HERE
2. [Step 2: Enable Authentication](#step-2-enable-authentication)
3. [Step 3: Test All Features](#step-3-test-all-features)
4. [Step 4: Deploy to Production](#step-4-deploy-to-production)

---

## STEP 1: CREATE DATABASE TABLES

### Time Required: 5 minutes

### What You'll Do:
- Log into Supabase dashboard
- Create 6 database tables using SQL
- Set up Row Level Security (RLS)

---

### 1.1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com)
2. Log in with your credentials
3. Select your project: `hackathon-portal`
4. Click **"SQL Editor"** in left sidebar
5. Click **"New Query"** (top button)

---

### 1.2: Create Users Table

Copy and paste this SQL query in the editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Anyone can create users (for registration)
CREATE POLICY "Anyone can create users" ON users
  FOR INSERT WITH CHECK (true);
```

**Click "Run"** ✅

---

### 1.3: Create Teams Table

Click **"New Query"** again, paste:

```sql
-- Teams table
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

-- Add indexes
CREATE INDEX idx_teams_leader ON teams(leader_id);
CREATE INDEX idx_teams_status ON teams(status);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policy: Team leader can view their team
CREATE POLICY "Leaders can view their team" ON teams
  FOR SELECT USING (auth.uid() = leader_id);

-- Policy: Team leader can update their team
CREATE POLICY "Leaders can update their team" ON teams
  FOR UPDATE USING (auth.uid() = leader_id);

-- Policy: Anyone can create team
CREATE POLICY "Anyone can create team" ON teams
  FOR INSERT WITH CHECK (true);
```

**Click "Run"** ✅

---

### 1.4: Create Team Members Table

Click **"New Query"**, paste:

```sql
-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
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

-- Add indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_status ON team_members(status);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view members of their team
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT USING (
    team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
    OR user_id = auth.uid()
  );

-- Policy: Team leader can manage members
CREATE POLICY "Leaders can manage members" ON team_members
  FOR ALL USING (
    team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
  );
```

**Click "Run"** ✅

---

### 1.5: Create Projects Table

Click **"New Query"**, paste:

```sql
-- Projects table
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

-- Add indexes
CREATE INDEX idx_projects_difficulty ON projects(difficulty);
CREATE INDEX idx_projects_title ON projects(title);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Policy: Only admins can create/update projects
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

**Click "Run"** ✅

---

### 1.6: Create Submissions Table

Click **"New Query"**, paste:

```sql
-- Submissions table
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

-- Add indexes
CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_submissions_project ON submissions(project_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Team leader can view their submissions
CREATE POLICY "Leaders can view submissions" ON submissions
  FOR SELECT USING (
    team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
  );

-- Policy: Team leader can create submission
CREATE POLICY "Leaders can create submission" ON submissions
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE leader_id = auth.uid())
  );

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all submissions" ON submissions
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

**Click "Run"** ✅

---

### 1.7: Create Analytics Table

Click **"New Query"**, paste:

```sql
-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT now(),
  metadata JSONB
);

-- Add indexes
CREATE INDEX idx_analytics_metric ON analytics(metric_name);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view analytics
CREATE POLICY "Admins can view analytics" ON analytics
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Anyone can insert analytics
CREATE POLICY "Anyone can create analytics" ON analytics
  FOR INSERT WITH CHECK (true);
```

**Click "Run"** ✅

---

### 1.8: Verify Tables Created

In Supabase dashboard, click **"Table Editor"** in left sidebar.

You should see all 6 tables:
- ✅ users
- ✅ teams
- ✅ team_members
- ✅ projects
- ✅ submissions
- ✅ analytics

---

## STEP 2: ENABLE AUTHENTICATION

### Time Required: 3 minutes

### What You'll Do:
- Enable email authentication
- Configure redirect URLs
- Test auth endpoints

---

### 2.1: Enable Email Provider

1. In Supabase dashboard, click **"Authentication"** in left sidebar
2. Click **"Providers"** tab
3. Find **"Email"** provider
4. Toggle it **"ON"** (enable it)
5. Click **"Save"**

---

### 2.2: Configure Redirect URLs

1. In Authentication, click **"URL Configuration"** tab
2. Under **"Site URL"**, add:
   ```
   http://localhost:5173
   ```
3. Under **"Redirect URLs"**, add:
   ```
   http://localhost:5173/student-login
   http://localhost:5173/admin-login
   http://localhost:5173/student/dashboard
   http://localhost:5173/admin/dashboard
   ```
4. Click **"Save"**

---

### 2.3: Configure SMTP (Email)

For sending verification emails (optional for development):

1. Click **"Emails"** tab
2. Under **"Custom SMTP"**, you can configure email service
3. For now, you can skip (Supabase has built-in testing)

---

### 2.4: Verify Auth is Working

Go to your running app: http://localhost:5173

Try:
1. ✅ Click **"Register"** button
2. ✅ Fill in email and password
3. ✅ Submit form
4. ✅ Check **"Authentication"** → **"Users"** in Supabase
5. ✅ Your user should appear in the list

---

## STEP 3: TEST ALL FEATURES

### Time Required: 15 minutes

### What You'll Test:
- Registration flow
- Login flow
- Team creation
- Member management
- Project selection
- Dashboard access

---

### 3.1: Test Student Registration

1. Open http://localhost:5173
2. Click **"Register"** → **"Team Leader"**
3. Fill in:
   - Team Name: `Test Team Alpha`
   - Leader Email: `leader@example.com`
   - Leader Name: `John Doe`
   - Password: `TestPass123!`
   - College: `MIT`
   - Department: `Computer Science`
   - Team Password: `TeamPass123!`
4. Click **"Register Team"**
5. ✅ Should see success message
6. ✅ Check Supabase **"Table Editor"** → **"teams"** table
7. ✅ Your team should be listed

---

### 3.2: Test Student Login

1. Click **"Login"** → **"Student Login"**
2. Email: `leader@example.com`
3. Password: `TestPass123!`
4. Click **"Sign In"**
5. ✅ Should redirect to **Student Dashboard**
6. ✅ Should see your team information

---

### 3.3: Test Member Invitation

1. On Student Dashboard, click **"Setup Team Members"**
2. Add a member:
   - Name: `Jane Smith`
   - Email: `jane@example.com`
   - Mobile: `9876543210`
   - Role: `Core Member`
3. Click **"Add Member"**
4. ✅ Member should appear in list
5. ✅ Check Supabase **"team_members"** table
6. ✅ Member record should be created

---

### 3.4: Test Project Selection

1. Still on Student Dashboard, click **"Select Project"**
2. Browse the 11 problem statements
3. Click **"Select"** on any project
4. Fill in submission details (optional)
5. Click **"Confirm"**
6. ✅ Project should be selected
7. ✅ Check **"teams"** table in Supabase
8. ✅ `project_id` and `project_title` should be filled

---

### 3.5: Test Admin Login

1. Click **"Logout"** (top right)
2. Click **"Login"** → **"Admin Login"**
3. Email: `admin@example.com` (use any email for testing)
4. Password: `AdminPass123!`
5. Click **"Sign In"**
6. ✅ Should see Admin Dashboard
7. ✅ Should see team analytics, teams list, submissions

---

### 3.6: Verify All Data in Supabase

Go to Supabase **"Table Editor"** and verify:

| Table | Expected Data |
|-------|---|
| users | Your student + admin account |
| teams | Your test team |
| team_members | Jane Smith (invited) |
| projects | 11 problem statements |
| submissions | Any submissions created |

---

## STEP 4: DEPLOY TO PRODUCTION

### Time Required: 10-20 minutes

### Choose Your Platform:
- **Option A:** Vercel (Recommended - easiest)
- **Option B:** Netlify (Easy)
- **Option C:** Traditional Server (Advanced)

---

## OPTION A: DEPLOY TO VERCEL (RECOMMENDED)

### 4A.1: Install Vercel CLI

```bash
npm i -g vercel
```

### 4A.2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 4A.3: Deploy

```bash
vercel --prod
```

Follow the setup prompts:
- **Project name**: `hackathon-portal`
- **Framework**: Choose **Vite**
- **Build command**: `npm run build`
- **Output directory**: `dist`

### 4A.4: Set Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project: `hackathon-portal`
3. Click **"Settings"** → **"Environment Variables"**
4. Add two variables:

```
VITE_SUPABASE_URL = https://pkfgqdhqzbihckblysed.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Click **"Save"**

### 4A.5: Update Supabase Redirect URLs

1. Go to Supabase dashboard
2. **Authentication** → **URL Configuration**
3. Under **"Site URL"**, update to your Vercel domain:
   ```
   https://your-project-name.vercel.app
   ```
4. Add **"Redirect URLs"**:
   ```
   https://your-project-name.vercel.app/student-login
   https://your-project-name.vercel.app/admin-login
   https://your-project-name.vercel.app/student/dashboard
   https://your-project-name.vercel.app/admin/dashboard
   ```
5. Click **"Save"**

### 4A.6: Verify Deployment

1. Wait for Vercel to build and deploy (usually 2-3 minutes)
2. Click the deployment link in Vercel dashboard
3. ✅ App should load
4. ✅ Try registering a user
5. ✅ Try logging in
6. ✅ Check Supabase dashboard for new data

---

## OPTION B: DEPLOY TO NETLIFY

### 4B.1: Install Netlify CLI

```bash
npm i -g netlify-cli
```

### 4B.2: Login to Netlify

```bash
netlify login
```

Follow the prompts to authenticate.

### 4B.3: Connect GitHub (Recommended)

```bash
netlify init
```

Or connect manually at [Netlify Dashboard](https://netlify.com)

### 4B.4: Set Environment Variables

1. Go to [Netlify Dashboard](https://netlify.com)
2. Select your site
3. **Settings** → **Build & deploy** → **Environment**
4. Add variables:

```
VITE_SUPABASE_URL = https://pkfgqdhqzbihckblysed.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Click **"Save"**

### 4B.5: Deploy

```bash
netlify deploy --prod --dir=dist
```

### 4B.6: Update Supabase URLs

Same as Vercel (Step 4A.5)

---

## OPTION C: DEPLOY TO TRADITIONAL SERVER

### 4C.1: Build the Project

```bash
npm run build
```

This creates a `dist/` folder with production files.

### 4C.2: Upload to Server

```bash
# Via SCP
scp -r dist/* user@your-server.com:/var/www/hackathon-portal/

# Or via FTP/SFTP using your favorite client
```

### 4C.3: Configure Web Server (Nginx)

Create `/etc/nginx/sites-available/hackathon-portal`:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/hackathon-portal;
    index index.html;
    
    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### 4C.4: Enable HTTPS (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.com
```

### 4C.5: Restart Nginx

```bash
sudo systemctl restart nginx
```

### 4C.6: Update Supabase URLs

Same as Vercel (Step 4A.5) with your domain

---

## POST-DEPLOYMENT CHECKLIST

After deploying, verify everything works:

- [ ] **App loads** without errors
- [ ] **Registration works** - create new account
- [ ] **Login works** - login with created account
- [ ] **Data saves** - check Supabase tables for new data
- [ ] **Dashboard works** - see team information
- [ ] **Project selection** - can select projects
- [ ] **Mobile responsive** - works on phone/tablet
- [ ] **HTTPS working** - URL shows 🔒 lock
- [ ] **Performance** - page loads in < 3 seconds
- [ ] **No console errors** - F12 shows no errors

---

## PRODUCTION MONITORING

### Monitor Your App:

1. **Error Tracking**: Use Sentry (https://sentry.io)
2. **Performance**: Use Lighthouse
3. **Uptime**: Use UptimeRobot
4. **Analytics**: Use Google Analytics
5. **Logs**: Check provider logs (Vercel, Netlify, server logs)

---

## FINAL SUMMARY

✅ **Step 1**: Database tables created  
✅ **Step 2**: Authentication enabled  
✅ **Step 3**: Features tested  
✅ **Step 4**: Deployed to production  

---

## TROUBLESHOOTING

### "Database connection failed"
- Check `.env` file has correct URL and key
- Verify Supabase project is active
- Check internet connection

### "Authentication not working"
- Verify email provider is enabled
- Check redirect URLs match your domain
- Clear browser cache

### "Deployment failed"
- Check build logs in provider dashboard
- Ensure all environment variables set
- Verify Node version compatibility

### "Data not saving to Supabase"
- Check RLS policies are correct
- Verify user is authenticated
- Check Supabase logs for errors

---

**Status**: ✅ Ready for Production  
**Last Updated**: July 24, 2026  
**Version**: 1.0.0

**Next**: Follow the steps above in order! 🚀
