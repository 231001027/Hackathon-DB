# Vercel Environment Variables Setup

## 🔴 Error: Missing VITE_SUPABASE_URL

This error occurs because Vercel doesn't have access to your `.env` file. You need to manually configure the environment variables in Vercel's dashboard.

## ✅ Solution

### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project: **Hackathon-DB** (or hackathon-db-six)

### Step 2: Navigate to Environment Variables
1. Click **Settings** (top navigation)
2. Click **Environment Variables** (left sidebar)

### Step 3: Add Environment Variables

Add the following variables:

#### **Required Variables:**

| Variable Name | Value | Source |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://pkfgqdhqzbihckblysed.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmdxZGhxemJpaGNrYmx5c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY2MDEsImV4cCI6MjEwMDQ0MjYwMX0.Nmy-5fpTTxJJSQECT-u1Bb7aEJKYTpf_atxinktHvV0` | Your Supabase anon key |

#### **Optional Variables (Recommended):**

```
VITE_MODE=production
VITE_API_URL=https://hackathon-db-six.vercel.app
VITE_AUTH_TIMEOUT=3600000
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=error
NODE_ENV=production
```

### Step 4: Set Scope
- **Environment**: Select all (Production, Preview, Development)
  OR
- **Specific environments**: Choose based on your preference

### Step 5: Save and Deploy
1. Click **Save** for each variable
2. Vercel will show: *"Environment variables updated"*
3. Go to **Deployments** tab
4. Find the latest deployment
5. Click the **⋮** (three dots) menu
6. Select **Redeploy**

### Step 6: Wait for Deployment
- Deployment typically takes 1-2 minutes
- You'll see build logs in real-time
- Once complete, visit: https://hackathon-db-six.vercel.app/

### Step 7: Verify
- The error should be gone
- Admin panel and registration should work
- Check browser console for any remaining errors

## 📋 Full Configuration List

If you want to add all optional variables:

```
VITE_SUPABASE_URL=https://pkfgqdhqzbihckblysed.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmdxZGhxemJpaGNrYmx5c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY2MDEsImV4cCI6MjEwMDQ0MjYwMX0.Nmy-5fpTTxJJSQECT-u1Bb7aEJKYTpf_atxinktHvV0
VITE_MODE=production
VITE_API_URL=https://hackathon-db-six.vercel.app
VITE_API_TIMEOUT=30000
VITE_AUTH_TIMEOUT=3600000
VITE_AUTH_REDIRECT=/student-login
VITE_ENABLE_EMAIL_VERIFICATION=false
VITE_ENABLE_PASSWORD_RESET=false
VITE_ENABLE_SOCIAL_AUTH=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_TEAM_SELECTION=true
VITE_ENABLE_PROJECT_ABSTRACTS=true
VITE_ENABLE_ADMIN_PANEL=true
VITE_ENABLE_RATE_LIMIT=true
VITE_ENABLE_CSP=true
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_SECURE_COOKIES=true
VITE_HSTS_MAX_AGE=31536000
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=error
VITE_CACHE_TTL=300000
VITE_CACHE_STORAGE=localStorage
VITE_MAX_FILE_SIZE_MB=10
VITE_MAX_TEAM_MEMBERS=4
VITE_REGISTRATION_LIMIT_PER_HOUR=50
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANIMATIONS=true
VITE_TOAST_DURATION_MS=4000
NODE_ENV=production
```

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Your Live App**: https://hackathon-db-six.vercel.app/
- **GitHub Repository**: https://github.com/231001027/Hackathon-DB

## ❓ Troubleshooting

### Still seeing error after redeploy?
1. Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
2. Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Vercel build logs for errors

### Build fails after adding variables?
1. Check variable names are spelled correctly (case-sensitive!)
2. Ensure no extra spaces before/after values
3. Re-save variables and redeploy

### Admin panel not accessible?
1. Verify `VITE_ENABLE_ADMIN_PANEL=true`
2. Check Supabase credentials are correct
3. Ensure Supabase project is accessible

## ✨ Notes

- Environment variables are **NOT** included in `.env` file on Vercel (security)
- Variables must be set in Vercel dashboard for live environment
- Local development uses `.env` file
- Production uses Vercel environment variables
- Changes take effect immediately after redeploy

---

**Last Updated**: July 24, 2026
**Status**: Active
