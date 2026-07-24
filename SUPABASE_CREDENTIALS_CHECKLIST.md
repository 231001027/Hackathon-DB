# Supabase Credentials Checklist

Quick reference for all credentials needed for Supabase integration.

---

## 📋 Credentials Required

### 1. VITE_SUPABASE_URL ⭐ REQUIRED

**What it is:** Your Supabase project's base URL

**Where to find it:**
1. Go to [supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project: `hackathon-portal`
4. Click ⚙️ "Settings" (bottom left)
5. Click "API" tab
6. Under "Project URL", copy the full URL

**Example format:**
```
https://your-project.supabase.co
```

**✅ Checklist:**
- [ ] URL starts with `https://`
- [ ] URL ends with `.supabase.co`
- [ ] No extra spaces or characters
- [ ] Copied directly from Supabase dashboard

**Where to paste in code:**
```env
# In .env file:
VITE_SUPABASE_URL=https://your-project.supabase.co
```

---

### 2. VITE_SUPABASE_ANON_KEY ⭐ REQUIRED

**What it is:** Anonymous/public API key for client-side requests

**Where to find it:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project: `hackathon-portal`
3. Click ⚙️ "Settings" (bottom left)
4. Click "API" tab
5. Under "Project API Keys"
6. Look for "anon (public)" key
7. Copy the long string (it starts with `eyJ...`)

**❌ DON'T USE:**
- ❌ `service_role (secret)` key (for backend only)
- ❌ Any key labeled "secret"

**⚠️ Important:**
- This key is "public" - it's safe to expose in frontend code
- Use ONLY this key in `.env` file
- Never use the service_role key in frontend

**Example format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkdnp...
```

**✅ Checklist:**
- [ ] Key starts with `eyJ`
- [ ] Key is very long (200+ characters)
- [ ] Labeled as "anon (public)" not "service_role (secret)"
- [ ] No extra spaces or newlines
- [ ] Copied directly from Supabase dashboard

**Where to paste in code:**
```env
# In .env file:
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3. Database Password (Optional - Migrations only)

**What it is:** Password for direct database connection

**Where to find it:**
- Shown during project creation
- Stored in: Settings → Database → Connection pooling

**When you need it:**
- Running database migrations
- Direct SQL queries
- Advanced database management
- NOT needed for normal app usage

**⚠️ Security:**
- Store securely (password manager)
- Never share or commit to Git
- Rotate regularly in production

---

## 🔒 Environment File (.env)

### Step 1: Create .env file

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Open .env and update

```env
# ============================================================
# SUPABASE CONFIGURATION (REQUIRED)
# ============================================================

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================================
# Rest of configuration (optional for development)
# ============================================================

VITE_MODE=development
VITE_API_URL=http://localhost:5174
# ... rest of settings
```

### Step 3: Verify

```bash
# Check that .env file exists and is in .gitignore
cat .gitignore | grep "\.env"

# Should output:
# .env
# .env.*.local
```

---

## 🚀 Getting Started

### 1. Create Supabase Account

```
Go to: https://supabase.com
Sign up with email or GitHub
```

### 2. Create Project

```
1. Click "New Project"
2. Project name: hackathon-portal
3. Create strong database password
4. Choose region closest to you
5. Wait 2-3 minutes for setup
```

### 3. Get Credentials

Use the checklist above to copy:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY

### 4. Update .env

```bash
# Edit .env file with your credentials
nano .env

# Or use your editor:
code .env
```

### 5. Test Connection

```bash
npm run dev
```

If it starts without errors → ✅ Success!

---

## 🔍 Verify Your Credentials

### Command Line Check

```bash
# Check .env file has values
grep VITE_SUPABASE .env

# Output should be:
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_ANON_KEY=eyJ...
```

### Browser Console Check

```javascript
// In browser console (F12), run:
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)

// Should print your credentials (public, so safe)
```

### API Test

```javascript
// In browser console:
import { supabase } from '@/config/supabase'
await supabase.from('projects').select().limit(1)

// Should return data or empty array (no error)
```

---

## ❌ Common Mistakes

### ❌ Wrong Key Used

**Problem:**
```
Using service_role key instead of anon key
```

**Fix:**
```
Use only "anon (public)" key from Settings > API
```

### ❌ Missing URL

**Problem:**
```
VITE_SUPABASE_URL not set in .env
```

**Fix:**
```
Copy full URL: https://your-project.supabase.co
```

### ❌ Wrong Format

**Problem:**
```
https://your-project.supabase.io  ❌ (wrong domain)
your-project.supabase.co          ❌ (missing https://)
```

**Fix:**
```
https://your-project.supabase.co  ✅ (correct)
```

### ❌ Credentials in Git

**Problem:**
```
.env file committed to Git (security risk!)
```

**Fix:**
```
.gitignore already includes .env
Never commit real credentials
```

---

## 🔐 Security Checklist

- [ ] .env file is in .gitignore
- [ ] Using anon key (not service_role)
- [ ] No credentials in source code
- [ ] No credentials in Git history
- [ ] URL format is correct
- [ ] Key is not shared/exposed
- [ ] Database password stored securely

---

## ✅ Final Checklist

Before starting development:

- [ ] Supabase account created
- [ ] Project created: `hackathon-portal`
- [ ] Database credentials obtained
- [ ] .env file updated with:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
- [ ] .env file is NOT in Git
- [ ] Connection tested: `npm run dev`
- [ ] No errors in console

---

## 📞 Troubleshooting

### Connection Test Failed?

**Check:**
1. Is the URL exactly: `https://your-project.supabase.co`?
2. Is the anon key copied completely (200+ characters)?
3. Are you using the correct (anon) key, not service_role?
4. Is the .env file in the project root?
5. Did you restart `npm run dev` after updating .env?

### Still having issues?

1. Check SUPABASE_SETUP.md for detailed guide
2. Review Supabase docs: https://supabase.com/docs
3. Contact Supabase support: https://supabase.com/support

---

**Status:** Ready for setup ✅  
**Created:** July 24, 2026  
**Version:** 1.0.0

**Next Step:** Follow SUPABASE_SETUP.md for complete setup →
