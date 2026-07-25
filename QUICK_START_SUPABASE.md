# Quick Start - Supabase Setup (5 Minutes)

## 🚀 In 3 Steps

### Step 1: Create Database Tables (2 min)
1. Open [Supabase Dashboard](https://supabase.com) → Your Project
2. Go to **SQL Editor** → Click **New Query**
3. Copy-paste content from `SUPABASE_TABLES.sql` in project root
4. Click **Execute** → Done ✅

### Step 2: Update Vercel Environment (1 min)
1. Go to [Vercel Dashboard](https://vercel.com) → Projects → Smart Ability
2. Click **Settings** → **Environment Variables**
3. Add these (keep existing):
   - `VITE_SUPABASE_URL` = `https://pkfgqdhqzbihckblysed.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (copy from `.env` file)
4. Click **Save** → Redeploy
5. Done ✅

### Step 3: Test (2 min)
1. Go to https://hackathon-db-six.vercel.app/
2. Click **Register Team** → Fill form → Submit
3. Check Supabase SQL Editor:
   ```sql
   SELECT * FROM teams ORDER BY created_at DESC LIMIT 1;
   ```
4. Should see your team data ✅

---

## ✅ What Happens Now

| User Action | Result |
|-------------|--------|
| **Register Team** | Data saved to `teams` table |
| **Add Members** | Data saved to `team_members` table |
| **Upload PDF** | Logged to `activity_logs` table |

---

## 🔍 View Data

### In Supabase SQL Editor
```sql
-- See all teams
SELECT * FROM teams;

-- See all members
SELECT * FROM team_members;

-- See recent activity
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50;

-- Get count
SELECT COUNT(*) as registrations FROM teams;
```

### In Admin Debugger
- URL: https://hackathon-db-six.vercel.app/admin/debugger
- Login: admin@smartability.com / Admin@123
- See activity logs with refresh, download, and clear

---

## 🐛 If It Doesn't Work

| Issue | Fix |
|-------|-----|
| "relation 'teams' does not exist" | Run SQL from Step 1 again |
| Data not appearing | Check browser console for errors (F12) |
| 404 favicon | Hard refresh (Ctrl+Shift+R) |
| Debugger shows no logs | Login to admin first |

---

## 📞 Need Help?

- See full guide: `SUPABASE_CONNECTIVITY_GUIDE.md`
- See setup schema: `SUPABASE_TABLES.sql`
- Live site: https://hackathon-db-six.vercel.app/
- GitHub: https://github.com/231001027/Hackathon-DB

---

**That's it!** 🎉 Your Supabase connection is ready.
