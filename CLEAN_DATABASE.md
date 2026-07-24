# Clean Database - Remove All Demo Data

Complete guide to delete all demo data from Supabase database.

---

## ⚠️ WARNING

This will **DELETE ALL DATA** from your database tables. This action is **IRREVERSIBLE**.

Only proceed if you want to:
- ✅ Start fresh with empty tables
- ✅ Remove all test data
- ✅ Reset the database completely

---

## 🗑️ OPTION 1: Delete All Data (Keep Tables)

This deletes all rows from tables but keeps the table structure.

### Step 1: Go to Supabase SQL Editor

1. Open [Supabase Dashboard](https://supabase.com)
2. Select your project: `hackathon-portal`
3. Click **"SQL Editor"** in left sidebar
4. Click **"New Query"**

### Step 2: Run Delete Query

Copy and paste this query:

```sql
-- Delete all data from tables (keep table structure)
DELETE FROM submissions;
DELETE FROM team_members;
DELETE FROM teams;
DELETE FROM analytics;
DELETE FROM projects;
DELETE FROM users;

-- Verify deletion
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as team_count FROM teams;
SELECT COUNT(*) as member_count FROM team_members;
SELECT COUNT(*) as project_count FROM projects;
SELECT COUNT(*) as submission_count FROM submissions;
```

### Step 3: Click "Run"

✅ All data will be deleted  
✅ Tables remain intact  
✅ You can add new data

---

## 🗑️ OPTION 2: Delete Everything (Drop & Recreate)

This completely removes and recreates tables.

### Step 1: Drop Tables

Go to SQL Editor and run:

```sql
-- Drop all tables
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### Step 2: Recreate Tables

Then run the CREATE TABLE statements from **PRODUCTION_SETUP_GUIDE.md** (Step 1)

---

## ✅ VERIFY DELETION

After running the delete query, verify data is gone:

### Method 1: SQL Editor

Run this query:

```sql
-- Check row counts
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions;
```

Expected result: All counts should be **0**

### Method 2: Table Editor

1. Go to **"Table Editor"** in Supabase
2. Click each table (users, teams, team_members, projects, submissions)
3. ✅ Each should show "No rows"

---

## 📊 WHAT GETS DELETED

| Data | Status |
|------|--------|
| User accounts | ✅ Deleted |
| Teams | ✅ Deleted |
| Team members | ✅ Deleted |
| Projects | ✅ Deleted |
| Submissions | ✅ Deleted |
| Analytics | ✅ Deleted |

---

## 🔄 RESTORE DEMO DATA

After cleaning, you can add fresh demo data:

```sql
-- Add sample users
INSERT INTO users (email, full_name, role) VALUES
('leader@example.com', 'John Doe', 'student'),
('admin@example.com', 'Admin User', 'admin');

-- Add sample projects
INSERT INTO projects (title, abstract, problem_statement, difficulty) VALUES
('Smart City IoT', 'Build IoT solutions for smart cities', 'Create a system to monitor and manage city infrastructure', 'intermediate'),
('AI Healthcare', 'AI-powered health monitoring', 'Develop an AI system for early disease detection', 'advanced');

-- View inserted data
SELECT * FROM users;
SELECT * FROM projects;
```

---

## 🛡️ SAFETY STEPS

Before deleting:

1. ✅ **Backup data** (export if needed)
2. ✅ **Verify you want to delete**
3. ✅ **Double-check queries**
4. ✅ **Run on test database first** (if available)

---

## 📝 STEP-BY-STEP GUIDE

### For Complete Data Wipe:

1. Open Supabase Dashboard
2. Click **"SQL Editor"**
3. Click **"New Query"**
4. Copy the delete query above
5. Click **"Run"**
6. ✅ All data deleted
7. Verify with SELECT COUNT queries

### For Fresh Start:

1. Run delete query
2. Or drop and recreate tables
3. Re-add only the data you need
4. Test with new registrations

---

## ⏮️ CANNOT UNDO!

Remember:
- ❌ No undo button
- ❌ Data is permanently deleted
- ❌ Only available from backups (if you made them)

---

## 🚀 AFTER CLEANING

1. ✅ Database is empty and clean
2. ✅ Ready for fresh data
3. ✅ Test with new registrations
4. ✅ All features work as expected

---

**Status**: Ready for data deletion  
**Last Updated**: July 24, 2026  
**Version**: 1.0.0

⚠️ **Proceed only if you're certain!** ⚠️
