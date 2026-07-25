# Check Team Registrations

## How Many Teams Registered?

### Step 1: Go to Supabase Dashboard
https://app.supabase.com → Select project `pkfgqdhqzbihckblysed`

### Step 2: Open SQL Editor
Left sidebar → **SQL Editor** → **New Query**

### Step 3: Run This Query

Copy and paste:

```sql
SELECT 
  COUNT(*) as total_teams,
  COUNT(CASE WHEN membersComplete = true THEN 1 END) as teams_with_complete_members,
  COUNT(CASE WHEN submissionStatus = 'submitted' THEN 1 END) as teams_with_submission,
  MAX(createdAt) as latest_registration
FROM public.teams;
```

Click **RUN**

### Result
You'll see:
- `total_teams` - How many teams registered
- `teams_with_complete_members` - Teams with all members added
- `teams_with_submission` - Teams that submitted their project
- `latest_registration` - When the last team registered

---

## See All Team Details

Run this query to see all teams:

```sql
SELECT 
  teamName,
  leaderName,
  leaderEmail,
  college,
  department,
  membersComplete,
  submissionStatus,
  createdAt
FROM public.teams
ORDER BY createdAt DESC;
```

---

## Alternative: Use Table Editor

1. Go to **Table Editor** (left sidebar)
2. Click on **teams** table
3. You'll see all registered teams with a count at the top

---

**File location**: `COUNT_TEAMS.sql` has all the queries ready to run.
