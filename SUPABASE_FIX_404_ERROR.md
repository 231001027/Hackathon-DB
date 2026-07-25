# Fix Supabase 404 Error - Missing Tables

## 🔴 Problem
You're seeing these errors:
```
❌ Failed to log activity: Object
Failed to load resource: the server responded with a status of 404 ()
```

This means the Supabase tables don't exist yet.

## ✅ Solution

### Step 1: Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Select your project: `pkfgqdhqzbihckblysed`
3. Go to **SQL Editor** (left sidebar)

### Step 2: Create New Query
1. Click **New Query** button
2. Delete any default code
3. Copy ALL the SQL from `SUPABASE_SETUP.sql` file in your project
4. Paste it into the SQL Editor

### Step 3: Run the SQL
1. Click **Run** button (or press Ctrl+Enter)
2. Wait for completion (usually 5-10 seconds)
3. You should see: ✅ Success

### Step 4: Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `teams`
   - `team_members`
   - `activity_logs`
   - `projects`
   - `submissions`

### Step 5: Test the App
1. Go back to your app: https://hackathon-db-six.vercel.app/
2. Try registering a team
3. Data should now save to Supabase
4. No more 404 errors

## 📋 What Was Created

| Table | Purpose |
|-------|---------|
| `teams` | Store team registrations |
| `team_members` | Store team member details |
| `activity_logs` | Log all user activities |
| `projects` | Store project information |
| `submissions` | Track file submissions |

## 🔒 Security Notes

- Row Level Security (RLS) is **enabled**
- All policies allow access for now (you can restrict later)
- Indexes created for performance

## ❓ Troubleshooting

### Still getting 404 error?
1. Check all 5 tables exist in Table Editor
2. Hard refresh the app (Ctrl+Shift+R)
3. Try registering again

### Tables created but data not saving?
1. Check Supabase project credentials in `.env`
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
3. Check Supabase console for any error logs

### How to view the SQL?
- File location: `SUPABASE_SETUP.sql` in project root
- Or copy from below (Full SQL Schema)

## 📚 Full SQL Schema

```sql
[See SUPABASE_SETUP.sql file for complete SQL]
```

---

**After running this setup, your Supabase database will be ready for production use!**
