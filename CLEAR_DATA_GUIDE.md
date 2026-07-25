# Clear All Registered Teams

## ⚠️ WARNING
This will **DELETE ALL teams and activity logs** from Supabase. This action **CANNOT BE UNDONE**.

## Steps to Clear Data

### Step 1: Go to Supabase Dashboard
https://app.supabase.com

### Step 2: Select Your Project
Click on: `pkfgqdhqzbihckblysed`

### Step 3: Open SQL Editor
- Left sidebar → **SQL Editor**
- Click **New Query** button

### Step 4: Copy the SQL
Copy ALL code from `CLEAR_ALL_DATA.sql`:

```sql
DELETE FROM public.activity_logs;
DELETE FROM public.team_members;
DELETE FROM public.teams;

SELECT COUNT(*) as teams_count FROM public.teams;
SELECT COUNT(*) as members_count FROM public.team_members;
SELECT COUNT(*) as logs_count FROM public.activity_logs;
```

### Step 5: Run the Query
- Paste into SQL Editor
- Click **RUN** button
- Wait for completion

### Step 6: Verify
You should see:
```
teams_count: 0
members_count: 0
logs_count: 0
```

✅ All data cleared!

## Result

After running this:
- ❌ All teams deleted
- ❌ All team members deleted
- ❌ All activity logs deleted
- ✅ Tables remain (structure intact)
- ✅ Ready for fresh registrations

## Rollback

**This action cannot be undone!**

If you deleted accidentally:
1. Contact Supabase support
2. Or restore from a backup (if available)

---

**Ready to clear? Run `CLEAR_ALL_DATA.sql` in Supabase SQL Editor now.**
