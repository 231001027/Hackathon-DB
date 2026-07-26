# Update Vercel Environment Variables

## Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com
2. Select your project: `hackathon-db-six`
3. Click **Settings** (top menu)

---

## Step 2: Update Environment Variables

Click **Environment Variables** (left sidebar)

Add/Update these two variables:

### Variable 1:
```
Name: VITE_SUPABASE_URL
Value: https://lhhyknfzswlkdxumiujk.supabase.co
Environments: Production, Preview, Development
```
Click **Save**

### Variable 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_sh9yN5r1n9fBZGE_rXIYCg_clbbisOm
Environments: Production, Preview, Development
```
Click **Save**

---

## Step 3: Redeploy

1. Go back to **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots** menu
4. Click **Redeploy**

Or simply: Push to GitHub and Vercel auto-deploys

---

## Step 4: Verify Connection

Once deployed:
1. Go to: https://hackathon-db-six.vercel.app
2. Try registering a team
3. Check Supabase dashboard → teams table
4. Verify data appears

---

## Done! ✅

Your portal is now connected to the new Supabase project!
