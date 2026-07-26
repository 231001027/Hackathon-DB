# Connect to New Supabase Database

## Step 1: Create New Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name:** Smart Ability Innovation Portal
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to you
4. Click "Create New Project"
5. Wait for setup (5-10 minutes)

---

## Step 2: Get Credentials

1. Once created, go to **Settings → API**
2. Find and copy:
   - **Project URL** (Example: `https://xyzabc.supabase.co`)
   - **anon (public) key** (Long key starting with `eyJ...`)

---

## Step 3: Update .env File

Replace these values in `.env`:

```bash
# OLD (delete these):
VITE_SUPABASE_URL=https://pkfgqdhqzbihckblysed.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NEW (add these):
VITE_SUPABASE_URL=https://YOUR-NEW-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"+ New Query"**
3. Copy the entire content from `SUPABASE_SETUP.sql`
4. Paste into the query editor
5. Click **"Run"**

This creates:
- ✅ `teams` table
- ✅ `team_members` table
- ✅ `activity_logs` table
- ✅ Indexes for performance
- ✅ RLS policies

---

## Step 5: Test Connection

1. Go to local project folder
2. Run: `npm run dev`
3. Try registering a team
4. Check Supabase dashboard → teams table
5. Verify data appears

---

## Step 6: Deploy to Production

Once tested locally:

```bash
git add .env
git commit -m "chore: update Supabase credentials for new project"
git push origin main
```

Vercel will auto-deploy with new credentials!

---

## Verification Checklist

After setup, verify:
- ✅ Teams can register
- ✅ Members can be added
- ✅ PDFs can be uploaded (500KB limit)
- ✅ Admin dashboard loads
- ✅ Activity logs appear
- ✅ Dark mode works
- ✅ Multi-login works

---

## Important Files

| File | Purpose |
|------|---------|
| `.env` | Database credentials (NOT in git) |
| `SUPABASE_SETUP.sql` | Create all tables + indexes |
| `DELETE_ALL_DATA.sql` | Clear all records (keep structure) |
| `src/config/supabase.ts` | Connection config |
| `src/context/AuthContext.tsx` | Team registration logic |

---

## Support

If you encounter errors:

1. **400 Error on POST /teams**
   - Check VITE_SUPABASE_URL format
   - Verify anon key is correct

2. **Connection timeout**
   - Ensure RLS policies allow public access
   - Check firewall/network settings

3. **"teams" table not found**
   - Run SUPABASE_SETUP.sql again
   - Verify project has tables

---

## Ready to Go! 🚀

Once .env is updated with new credentials, everything else is automatic!
