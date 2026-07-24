# Deployment Checklist & Production Runbook

Comprehensive pre-deployment verification and production deployment guide for Smart Ability Hackathon Portal.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Steps](#deployment-steps)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Rollback Plan](#rollback-plan)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality (Complete Before Commit)

- [ ] **TypeScript Compilation**
  ```bash
  npm run typecheck
  # Expected: Exit code 0, no errors
  ```

- [ ] **ESLint & Code Style**
  ```bash
  npm run lint
  # Expected: No errors or warnings
  ```

- [ ] **Build Process**
  ```bash
  npm run build
  # Expected: Success, no warnings
  # Bundle size: < 500KB total, < 150KB gzipped
  ```

### Security Checks

- [ ] **No Hardcoded Secrets**
  ```bash
  grep -r "password\|api_key\|secret\|token" src/ \
    --exclude-dir=node_modules \
    --exclude="*.md"
  # Expected: Only in config/environment.ts with references to env vars
  ```

- [ ] **Dependencies Audit**
  ```bash
  npm audit
  # Expected: No vulnerabilities or only dev dependencies
  ```

- [ ] **Environment Variables Configured**
  ```bash
  # Check .env.example has all required variables
  cat .env.example
  
  # Required variables:
  # - VITE_API_URL
  # - VITE_AUTH_TIMEOUT
  # - VITE_CACHE_TTL
  # - NODE_ENV=production
  ```

- [ ] **HTTPS Only**
  - [ ] Production URL uses HTTPS
  - [ ] Content Security Policy headers set
  - [ ] HSTS header enabled (min 31536000 seconds)

### Performance Verification

- [ ] **Bundle Size**
  ```bash
  npm run build && du -sh dist/
  # Expected: < 500KB total
  ```

- [ ] **Gzip Size**
  ```bash
  # Verify gzip sizes in build output
  # Expected: < 150KB gzipped
  ```

- [ ] **Code Splitting**
  ```bash
  # Verify chunks created:
  ls -lh dist/assets/ | grep -E "vendor|admin|auth|student"
  # Expected: 5+ chunks with good distribution
  ```

- [ ] **Lighthouse Score**
  ```
  Expected minimum scores:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 90+
  - SEO: 90+
  ```

### Functionality Testing

- [ ] **Landing Page**
  - [ ] All sections load
  - [ ] Navigation works
  - [ ] Links functional
  - [ ] No console errors

- [ ] **Authentication**
  - [ ] Student login works
  - [ ] Admin login works
  - [ ] Logout clears session
  - [ ] Redirect to login on unauthorized access

- [ ] **Registration**
  - [ ] Team leader registration completes
  - [ ] Member registration works
  - [ ] Form validation enforces
  - [ ] Duplicate email blocked
  - [ ] Password strength enforced

- [ ] **Dashboard**
  - [ ] Student dashboard displays
  - [ ] Team data shows correctly
  - [ ] Admin dashboard accessible
  - [ ] Analytics display

- [ ] **Forms**
  - [ ] All forms submit
  - [ ] Validation messages appear
  - [ ] Error handling works
  - [ ] Success feedback shown

### Accessibility & UX

- [ ] **Keyboard Navigation**
  - [ ] Tab through form
  - [ ] Submit with Enter
  - [ ] Escape closes modals
  - [ ] Focus visible throughout

- [ ] **Screen Reader**
  - [ ] Form labels announced
  - [ ] Errors announced
  - [ ] Buttons have proper role
  - [ ] Images have alt text

- [ ] **Mobile Responsive**
  - [ ] Tested on mobile (iOS + Android)
  - [ ] Touch targets 44x44px minimum
  - [ ] Forms usable on mobile
  - [ ] No horizontal scroll

- [ ] **Dark Mode**
  - [ ] Toggle works
  - [ ] Colors adjust
  - [ ] Contrast maintained
  - [ ] Preference persists

### Documentation

- [ ] **README.md**
  - [ ] Setup instructions clear
  - [ ] Dependencies listed
  - [ ] Commands documented
  - [ ] Troubleshooting included

- [ ] **DEPLOYMENT.md**
  - [ ] Deployment options clear
  - [ ] Steps sequential
  - [ ] Environment setup documented

- [ ] **.env.example**
  - [ ] All variables listed
  - [ ] Comments explain each variable
  - [ ] No actual secrets

### Data & Backup

- [ ] **Database Backup** (if applicable)
  - [ ] Backup created before deployment
  - [ ] Backup verified
  - [ ] Recovery tested

- [ ] **User Data**
  - [ ] No test data in production
  - [ ] Sensitive data encrypted
  - [ ] GDPR compliance checked

---

## Environment Configuration

### Production Environment Setup

```bash
# 1. Copy environment template
cp .env.example .env.production

# 2. Configure required variables
export VITE_API_URL="https://api.hackathon.college.edu"
export VITE_AUTH_TIMEOUT="3600000"  # 1 hour
export VITE_CACHE_TTL="300000"      # 5 minutes
export NODE_ENV="production"
export VITE_LOG_LEVEL="warn"
export VITE_ENABLE_ANALYTICS="true"
```

### Environment Variables Reference

```env
# API Configuration
VITE_API_URL=https://api.hackathon.college.edu
VITE_API_TIMEOUT=30000

# Auth Configuration
VITE_AUTH_TIMEOUT=3600000
VITE_AUTH_REDIRECT=/student-login

# Cache Configuration
VITE_CACHE_TTL=300000
VITE_CACHE_STORAGE=localStorage

# Logging
VITE_LOG_LEVEL=warn
VITE_LOG_FORMAT=json

# Analytics
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Feature Flags
VITE_ENABLE_TEAM_SELECTION=true
VITE_ENABLE_PROJECT_ABSTRACTS=true
VITE_ENABLE_ADMIN_PANEL=true

# Security
VITE_SECURE_COOKIES=true
VITE_CSP_ENABLED=true
VITE_HSTS_MAX_AGE=31536000

# Environment
NODE_ENV=production
```

### Vercel Deployment Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "nodeVersion": "18.x",
  "env": {
    "VITE_API_URL": "@api_url_production",
    "VITE_AUTH_TIMEOUT": "3600000",
    "VITE_CACHE_TTL": "300000"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Deployment Configuration

```toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
X-XSS-Protection = "1; mode=block"
Strict-Transport-Security = "max-age=31536000; includeSubDomains"
Cache-Control = "public, max-age=3600"
```

---

## Deployment Steps

### Vercel Deployment (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Authenticate with Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. Configure environment variables in Vercel dashboard
# Settings → Environment Variables → Add production variables

# 5. Verify deployment
vercel list  # List all deployments
vercel inspect  # Inspect current deployment
```

### Netlify Deployment

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Authenticate with Netlify
netlify login

# 3. Connect site (first time)
netlify init

# 4. Deploy
netlify deploy --prod --dir=dist

# 5. Configure environment variables
netlify env:set VITE_API_URL "https://api.hackathon.college.edu"
netlify env:set VITE_AUTH_TIMEOUT "3600000"
netlify env:set VITE_CACHE_TTL "300000"
```

### Traditional Server Deployment

```bash
# 1. Build project
npm run build

# 2. Copy dist folder to server
scp -r dist/ user@server:/var/www/hackathon-portal/

# 3. Configure web server (Nginx example)
# Location: /etc/nginx/sites-available/hackathon-portal
# See NGINX_CONFIG.md for complete configuration

# 4. Restart web server
sudo systemctl restart nginx

# 5. Verify
curl -I https://hackathon.college.edu
```

### Docker Deployment

```dockerfile
# Create Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and push Docker image
docker build -t hackathon-portal:latest .
docker tag hackathon-portal:latest registry.example.com/hackathon-portal:latest
docker push registry.example.com/hackathon-portal:latest

# Deploy using Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## Post-Deployment Verification

### Immediate Checks (First 5 minutes)

```bash
# 1. Check deployment status
curl -I https://hackathon.college.edu
# Expected: HTTP 200

# 2. Verify no console errors
# Open in browser → F12 → Console
# Expected: No errors (only warnings/info acceptable)

# 3. Test critical paths
# [ ] Landing page loads
# [ ] Login page accessible
# [ ] Registration works
# [ ] Dashboard loads for student
# [ ] Admin panel accessible
```

### Health Checks (15 minutes)

```bash
# 1. Monitor server logs
tail -f /var/log/nginx/access.log
# Expected: 200 responses, no 5xx errors

# 2. Check performance metrics
# Lighthouse score > 90
# Load time < 3s
# Time to Interactive < 5s

# 3. Verify analytics
# Check Google Analytics shows traffic

# 4. Test API endpoints
curl https://api.hackathon.college.edu/health
# Expected: 200 with status "healthy"
```

### Functional Tests (30 minutes)

```javascript
// Automated smoke tests
describe('Production Deployment', () => {
  it('should load landing page', async () => {
    const response = await fetch('https://hackathon.college.edu/');
    expect(response.status).toBe(200);
  });

  it('should have correct CSP headers', async () => {
    const response = await fetch('https://hackathon.college.edu/');
    expect(response.headers.has('content-security-policy')).toBe(true);
  });

  it('should redirect to HTTPS', async () => {
    const response = await fetch('http://hackathon.college.edu/', {
      redirect: 'manual',
    });
    expect([301, 302, 307, 308]).toContain(response.status);
  });

  it('should serve gzipped assets', async () => {
    const response = await fetch('https://hackathon.college.edu/');
    expect(response.headers.get('content-encoding')).toBe('gzip');
  });
});
```

### User Acceptance Tests (1 hour)

- [ ] **Student Flow**
  1. Register as team leader
  2. Create team and add members
  3. View dashboard
  4. Select project abstract
  5. Upload submission

- [ ] **Admin Flow**
  1. Login as admin
  2. View all teams
  3. View submissions
  4. Check analytics
  5. Manage settings

- [ ] **Edge Cases**
  1. Test on mobile
  2. Test on slow connection (3G)
  3. Test with JavaScript disabled
  4. Test with ad blocker
  5. Test with VPN

---

## Rollback Plan

### Immediate Rollback (< 5 minutes)

```bash
# Vercel
vercel --prod --env ROLLBACK_VERSION=<previous-hash>

# Netlify
netlify deploy --prod --dir=dist --message="Rollback to <commit-hash>"

# Traditional server
git revert HEAD
npm run build
scp -r dist/ user@server:/var/www/hackathon-portal/
sudo systemctl restart nginx
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d hackathon_prod backup_2024-07-24.sql

# Verify data
SELECT COUNT(*) FROM teams;
SELECT COUNT(*) FROM members;

# Notify users if data affected
```

### Communication Plan

1. **Immediate** (< 5 min)
   - Disable error notifications
   - Start rollback
   - Post status update

2. **Within 15 minutes**
   - Rollback complete
   - Verify system working
   - Update status page

3. **Within 1 hour**
   - Root cause analysis started
   - Post-mortem scheduled
   - Update team

---

## Monitoring & Health Checks

### Uptime Monitoring

```bash
# Setup monitoring with UptimeRobot or similar
# Monitor endpoints:
# https://hackathon.college.edu/ (landing page)
# https://hackathon.college.edu/student-login (student login)
# https://api.hackathon.college.edu/health (API health)

# Expected response time: < 2s
# Uptime target: 99.9%
```

### Error Tracking

```javascript
// Setup Sentry for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Automatically tracks all errors and performance
```

### Performance Monitoring

```javascript
// Setup performance monitoring
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  
  console.log('Page Load Time:', pageLoadTime);
  
  // Send to analytics
  sendMetrics({
    pageLoadTime,
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
    timeToFirstByte: perfData.responseStart - perfData.navigationStart,
  });
});
```

### Real User Monitoring

```javascript
// Collect Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// Expected targets:
// - LCP: < 2.5s
// - FID: < 100ms
// - CLS: < 0.1
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Blank Page on Load

**Symptom**: Page shows blank, console has errors

**Solution**:
```bash
# Check build output
npm run build

# Verify source maps
ls -la dist/

# Check bundle chunks loaded
# Browser DevTools → Network → Filter by .js

# If chunks missing:
# 1. Clear cache: Ctrl+Shift+Delete
# 2. Hard refresh: Ctrl+Shift+R
# 3. Clear service worker
```

#### 2. 404 on Page Refresh

**Symptom**: Works on initial load, 404 on refresh

**Solution**:
```bash
# Configure server to redirect to index.html
# Vercel: Automatically configured
# Netlify: Add _redirects file
# Traditional: Configure web server

# Example nginx config:
location / {
  try_files $uri $uri/ /index.html;
}
```

#### 3. Slow Performance

**Symptom**: Page loads slowly, Lighthouse score low

**Solution**:
```bash
# 1. Check bundle size
npm run build && du -sh dist/

# 2. Enable gzip compression
# Nginx: gzip on;
# Vercel: Automatic

# 3. Add caching headers
# Cache-Control: public, max-age=31536000

# 4. Enable CDN
# Vercel: Automatic
# Netlify: Automatic
# Traditional: CloudFlare
```

#### 4. CORS Errors

**Symptom**: API calls fail with CORS error

**Solution**:
```bash
# Check API server CORS headers
curl -I https://api.hackathon.college.edu

# Verify headers include:
# Access-Control-Allow-Origin: https://hackathon.college.edu
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE
# Access-Control-Allow-Headers: Content-Type, Authorization

# If missing, configure in API server
```

#### 5. Memory Leak

**Symptom**: Performance degrades over time

**Solution**:
```javascript
// Check for memory leaks
// Browser DevTools → Memory → Take heap snapshot

// Common causes:
// 1. Event listeners not removed
// - Solution: Use cleanup in useEffect

// 2. Timers not cleared
// - Solution: Clear in cleanup

// 3. Large objects retained
// - Solution: Check cache invalidation

// Example fix:
useEffect(() => {
  const timer = setTimeout(() => {
    // do something
  }, 1000);

  return () => clearTimeout(timer); // Cleanup
}, []);
```

#### 6. Login Loop

**Symptom**: Redirects to login continuously

**Solution**:
```bash
# 1. Check auth token in localStorage
# Browser DevTools → Storage → localStorage

# 2. Verify token not expired
# Check token expiration in AuthContext

# 3. Clear localStorage and try again
localStorage.clear()

# 4. Check API authentication endpoint
curl -H "Authorization: Bearer <token>" \
  https://api.hackathon.college.edu/auth/verify
```

---

## Final Checklist

### 24 Hours Before Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Team notified
- [ ] Backup created
- [ ] Rollback plan rehearsed

### Day of Deployment

- [ ] Production environment ready
- [ ] Monitoring tools configured
- [ ] Team on standby
- [ ] Communication channels open
- [ ] Runbook accessible

### Post-Deployment (Week 1)

- [ ] Monitor error rates daily
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan improvements

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Ready for Deployment ✓

**Deployment Authorization**:
- [ ] Tech Lead
- [ ] DevOps Lead
- [ ] Product Owner
