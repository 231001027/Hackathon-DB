# Smart Ability Hackathon - Supabase Connectivity Guide

## 🎯 Overview

This guide explains how to properly set up and verify Supabase connectivity for the Smart Ability Hackathon Portal.

---

## ✅ What Was Fixed

### 1. **Database Connectivity**
- ✅ Updated AuthContext to save registration data to Supabase
- ✅ Created team, member, and submission services
- ✅ Implemented fire-and-forget pattern for data persistence
- ✅ Local UI updates immediately while data syncs to Supabase

### 2. **Activity Logging**
- ✅ New `logging.service.ts` tracks all registration, upload, and error events
- ✅ Admin Debugger page shows real-time activity logs
- ✅ Download and clear logs functionality
- ✅ Statistics dashboard (registrations, uploads, errors)

### 3. **Hero Section UI**
- ✅ Added Smart Ability logo next to "Hackathon" title
- ✅ Responsive sizing: 80px on mobile, 112px on desktop
- ✅ Drop shadow and smooth animations

---

## 🚀 Setup Instructions

### Step 1: Create Supabase Tables

Go to your Supabase dashboard:
1. Navigate to **SQL Editor**
2. Create a new query
3. Copy-paste the SQL from `SUPABASE_TABLES.sql` in the project root
4. Execute the query

**Tables created:**
- `users` - User accounts
- `teams` - Registered teams
- `team_members` - Team member details
- `projects` - Problem statements (11 predefined)
- `submissions` - Team submissions
- `activity_logs` - Debugging logs

### Step 2: Verify Environment Variables

Check `.env` file has:

```env
VITE_SUPABASE_URL=https://pkfgqdhqzbihckblysed.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**For Vercel deployment:**
1. Go to Vercel dashboard
2. Project → Settings → Environment Variables
3. Add both variables
4. Redeploy

---

## 🔍 How Data Flows

```
User Form Input
    ↓
AuthContext.registerTeam()
    ├→ Update local state (immediate UI update)
    └→ Save to Supabase (background)
         ├→ Insert into `teams` table
         └→ Log to `activity_logs` table
    ↓
Admin can view in Activity Debugger (/admin/debugger)
```

---

## 📊 Admin Debugger Usage

### Access
- URL: `https://hackathon-db-six.vercel.app/admin/debugger`
- Requires admin login

### Features
1. **Real-time Activity Feed**
   - Auto-refreshes every 5 seconds
   - Shows last 200 activities

2. **Statistics Dashboard**
   - Total registrations
   - PDF uploads
   - Error count

3. **Actions**
   - **Refresh**: Manual data refresh
   - **Download Logs**: Export as JSON
   - **Clear Logs**: Delete all logs (with confirmation)

4. **Log Details**
   - Action type (team_registered, member_added, pdf_uploaded, error, etc.)
   - Entity type and ID
   - Timestamp
   - Error messages (highlighted in red)
   - Associated details

---

## 🧪 Testing Checklist

### Test Data Flow

- [ ] **Register a team**
  1. Go to `/register-team-leader`
  2. Fill form and submit
  3. Check Supabase SQL Editor:
     ```sql
     SELECT * FROM teams WHERE name = 'your_team_name';
     ```
  4. Verify row exists with your data

- [ ] **Add team member**
  1. After registration, add a member
  2. Check Supabase:
     ```sql
     SELECT * FROM team_members WHERE team_id = 'team_uuid';
     ```

- [ ] **Check activity logs**
  1. Login as admin
  2. Go to `/admin/debugger`
  3. Verify "team_registered" and "member_added" entries appear
  4. Check timestamps are recent

- [ ] **Verify error logging**
  1. Trigger an error (e.g., invalid input)
  2. Check debugger for "error" action entries
  3. Verify error message is captured

---

## 🐛 Debugging Tips

### If Data Not Appearing in Supabase

1. **Check browser console** (F12 → Console tab)
   - Look for `✅ [AuthContext]` logs showing successful saves
   - Look for `❌ [AuthContext]` logs showing errors

2. **Check Supabase logs**
   - Go to Supabase dashboard
   - Logs tab
   - Search for authentication or database errors

3. **Verify Row Level Security (RLS)**
   - Most tables have RLS policies
   - If policies are too strict, data won't insert
   - Check: `Policies` in SQL Editor

4. **Test connection directly**
   - Open browser console (F12)
   - Run:
     ```javascript
     // Test if tables exist
     const { data, error } = await supabase
       .from('teams')
       .select('COUNT(*)')
       .single();
     console.log(data, error);
     ```

### Common Issues

| Issue | Solution |
|-------|----------|
| "relation 'teams' does not exist" | Run SUPABASE_TABLES.sql in SQL Editor |
| Data appears in UI but not in database | Check browser console for network errors |
| 404 favicon error | Already fixed ✅ (uses smartability-logo.png) |
| Admin debugger shows no logs | Ensure admin is logged in; refresh page |

---

## 📝 Database Schema

### Teams Table
```sql
id (UUID) - Primary key
name (TEXT) - Team name
leader_id (UUID) - Foreign key to users
college (TEXT) - College name
password (TEXT) - Team password
project_id (UUID) - Selected project
project_title (TEXT) - Project title
abstract (TEXT) - Project abstract
status (TEXT) - draft, submitted, rejected, selected
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Activity Logs Table
```sql
id (UUID) - Primary key
action (TEXT) - team_registered, member_added, pdf_uploaded, error, etc.
entity_type (TEXT) - team, team_member, submission
entity_id (UUID) - Reference to entity
user_id (UUID) - Reference to user
details (JSONB) - Additional data
error_message (TEXT) - Error details
created_at (TIMESTAMP)
```

---

## 🚀 Deployment Status

### Current
- ✅ **Live URL**: https://hackathon-db-six.vercel.app/
- ✅ **GitHub**: https://github.com/231001027/Hackathon-DB
- ✅ **Build Status**: Passing (1988 modules, 392KB total)
- ✅ **TypeScript**: 0 errors

### Latest Changes
- Supabase integration with activity logging
- Admin debugger page for monitoring
- Hero section with Smart Ability logo
- Favicon fixed (404 error resolved)

---

## 📞 Support

### If You Need to:

1. **Add a new database table**
   - Go to SQL Editor in Supabase
   - Create table
   - Create corresponding service in `src/services/supabase/`

2. **Track new events**
   - Import `logActivity` in component
   - Call after action completes
   - Check AdminDebugger page

3. **Reset database**
   - Go to SQL Editor
   - Run `DELETE FROM table_name;`
   - Or drop and recreate table

4. **Export activity logs**
   - Go to Admin Debugger
   - Click "Download Logs"
   - Logs exported as JSON with timestamp

---

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

**Last Updated**: July 24, 2026
**Status**: ✅ Production Ready
