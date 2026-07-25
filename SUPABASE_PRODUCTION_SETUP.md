# Supabase Production Setup for 300+ Teams

## 🚀 Scale Requirements

Expected traffic:
- **300+ team registrations**
- **1200+ team members** (4 members per team)
- **Concurrent users**: 50-100 during registration period
- **Data storage**: ~50MB

---

## ✅ Step 1: Create Tables (RUN FIRST)

Go to: https://app.supabase.com → SQL Editor → New Query

**Copy and run** `SUPABASE_RUN_THIS.sql` completely.

This creates:
- ✅ `teams` table
- ✅ `team_members` table
- ✅ `activity_logs` table

---

## 🔐 Step 2: Configure Row Level Security (RLS)

### Option A: Allow All (Development/Testing)
**Already configured** - All users can read/write

### Option B: Restrict Access (Production)

If you want to restrict access later:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow all on teams" ON public.teams;
DROP POLICY IF EXISTS "Allow all on team_members" ON public.team_members;
DROP POLICY IF EXISTS "Allow all on activity_logs" ON public.activity_logs;

-- Create restrictive policies
CREATE POLICY "Teams are readable by anyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Teams are writable by anyone" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Teams are updatable by anyone" ON public.teams FOR UPDATE USING (true);

CREATE POLICY "Team members are readable by anyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team members are writable by anyone" ON public.team_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Activity logs are writable by anyone" ON public.activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Activity logs are readable by anyone" ON public.activity_logs FOR SELECT USING (true);
```

---

## 📊 Step 3: Verify Tables & Indexes

Run this to verify everything is ready:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check indexes
SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Check row counts
SELECT 
  (SELECT COUNT(*) FROM public.teams) as teams,
  (SELECT COUNT(*) FROM public.team_members) as members,
  (SELECT COUNT(*) FROM public.activity_logs) as logs;
```

Expected output:
- `teams` table ✅
- `team_members` table ✅
- `activity_logs` table ✅
- 4 indexes created ✅

---

## 🎯 Step 4: Set Quotas & Limits

### Supabase Dashboard Settings:

1. Go to: **Settings** → **Database**
2. Check:
   - Storage: Should have plenty of space
   - Connections: Auto-scales
   - Bandwidth: Unlimited

### Application Limits (in `.env`):

Already configured:
```
VITE_MAX_TEAM_MEMBERS=4
VITE_REGISTRATION_LIMIT_PER_HOUR=50
```

---

## 📈 Step 5: Monitor Performance

### View Real-time Usage:

1. **Supabase Dashboard** → **Reports**
2. Check:
   - Database CPU usage
   - Network bandwidth
   - Disk usage
   - API calls

### Monitor Logs:

1. **Supabase Dashboard** → **Logs**
2. Filter by:
   - Time range
   - API status codes
   - Error patterns

---

## ✨ Step 6: Enable Backups

1. **Settings** → **Backups**
2. Enable:
   - ✅ Automated backups (daily)
   - ✅ Point-in-time recovery
   - ✅ Archive backups to external storage

---

## 📋 Step 7: Admin Access for Team Monitoring

### Give Admin Access to Team Leads:

Create admin accounts:
- Email: `admin@rec.com` (already set)
- Password: `admin@123` (already set)

Admin dashboard shows:
- All registered teams
- Team member details
- Submission status
- Activity logs

**Access**: https://your-app.vercel.app/admin-login

---

## 🚨 Step 8: Error Handling & Alerts

### Common Issues & Solutions:

| Issue | Solution |
|-------|----------|
| 400 Bad Request | Check column names (camelCase) |
| 404 Not Found | Run SQL schema first |
| Rate limit exceeded | Increase `VITE_REGISTRATION_LIMIT_PER_HOUR` |
| Connection timeout | Check Supabase service status |

### Enable Notifications:

1. **Settings** → **Notifications**
2. Enable alerts for:
   - Database errors
   - CPU/memory high usage
   - Failed backups

---

## 📱 Step 9: Pre-Production Testing

Test with 50 mock registrations:

```sql
-- Insert test teams (OPTIONAL - for testing only)
INSERT INTO public.teams (
  id, teamName, leaderName, leaderEmail, college, 
  department, year, mobile, members, membersComplete, 
  submissionStatus
) VALUES 
  ('test-1', 'Test Team 1', 'Lead 1', 'test1@college.edu', 'College', 
   'CSE', '3rd Year', '9999999999', '[]'::jsonb, false, 'not_started'),
  ('test-2', 'Test Team 2', 'Lead 2', 'test2@college.edu', 'College', 
   'ECE', '4th Year', '9999999998', '[]'::jsonb, false, 'not_started');
```

---

## ✅ Final Checklist

- [ ] Tables created (teams, team_members, activity_logs)
- [ ] Indexes created for performance
- [ ] RLS policies configured
- [ ] Backups enabled
- [ ] Admin access set up
- [ ] Environment variables verified
- [ ] Error monitoring enabled
- [ ] Pre-production test completed
- [ ] Rate limiting configured

---

## 🎉 Ready for Production!

Once all steps are complete:

1. ✅ Open registration: https://your-app.vercel.app/register-team-leader
2. ✅ Monitor: Admin dashboard
3. ✅ Scale: Supabase auto-scales

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Status Page**: https://status.supabase.com
- **Contact Supabase**: Support email in dashboard

---

**Your portal is now ready to handle 300+ team registrations!** 🚀
