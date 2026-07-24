# Deployment Guide - Smart Ability Hackathon Portal

This guide provides step-by-step instructions for deploying the hackathon portal to production environments.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Optimization](#build-optimization)
3. [Environment Setup](#environment-setup)
4. [Deployment Methods](#deployment-methods)
5. [Production Configuration](#production-configuration)
6. [SSL/HTTPS Setup](#ssltls-setup)
7. [Performance Monitoring](#performance-monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run typecheck`)
- [ ] Linting clean (`npm run lint`)
- [ ] No console errors in development
- [ ] All features tested manually
- [ ] Git history clean and documented

### Security Audit
- [ ] No hardcoded secrets or API keys
- [ ] Password validation enabled
- [ ] Input sanitization active
- [ ] CORS configured correctly
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Error messages don't expose sensitive info

### Performance
- [ ] Build size < 500KB
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1s
- [ ] Code splitting working
- [ ] Images optimized
- [ ] Caching headers set

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment instructions written
- [ ] Support contact information provided

---

## Build Optimization

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory:
- **Size**: ~390KB (gzipped: ~128KB)
- **Format**: Minified, tree-shaken, chunked
- **Features**: Code splitting, lazy loading enabled

### Verify Build

```bash
npm run preview
```

This serves the production build locally to verify it works correctly.

### Build Analysis

Check build output for any warnings:

```bash
npm run build 2>&1 | grep -i "warning"
```

---

## Environment Setup

### Create Production Environment File

```bash
cp .env.example .env.production
```

### Configure for Production

Edit `.env.production`:

```bash
# Production Configuration
VITE_MODE=production
VITE_API_URL=https://hackathon.college.edu
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=error
VITE_ENABLE_RATE_LIMIT=true
VITE_ENABLE_CSP=true
```

### Update Configuration Files

Edit `src/config/environment.ts` for production:

```typescript
production: {
  appUrl: 'https://hackathon.college.edu',
  logging: {
    enableConsoleLog: false,
    enableRemoteLog: true,
    logLevel: 'error',
  },
  security: {
    enableRateLimit: true,
    enableCSP: true,
    // ... all security flags true
  },
}
```

---

## Deployment Methods

### Method 1: Vercel (Recommended for Simplicity)

**Vercel** provides the easiest deployment with automatic HTTPS, CDN, and serverless functions.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add production environment variables

4. **Custom Domain**
   - Go to Settings → Domains
   - Add your college domain (hackathon.college.edu)
   - Configure DNS records

#### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_MODE": "production"
  }
}
```

---

### Method 2: Netlify

**Netlify** offers continuous deployment from Git with excellent performance.

#### Steps:

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

3. **Configure in Netlify Dashboard**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables (add all from `.env.production`)

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

### Method 3: Traditional Server (Nginx/Apache)

For college hosting infrastructure using a traditional web server.

#### Prerequisites
- Nginx or Apache web server
- SSH access to server
- Node.js 18+ installed (for potential Node.js backend)

#### Steps:

1. **Build on Local Machine**
   ```bash
   npm run build
   ```

2. **Upload to Server**
   ```bash
   scp -r dist/* user@server:/var/www/hackathon/
   ```

3. **Nginx Configuration** (`/etc/nginx/sites-available/hackathon`)
   ```nginx
   server {
       listen 443 ssl http2;
       server_name hackathon.college.edu;

       # SSL Certificates
       ssl_certificate /etc/letsencrypt/live/hackathon.college.edu/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/hackathon.college.edu/privkey.pem;

       # Security Headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;

       # Gzip Compression
       gzip on;
       gzip_types text/plain text/css text/javascript application/json;

       # Cache Static Assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Serve SPA
       location / {
           root /var/www/hackathon;
           try_files $uri $uri/ /index.html;
       }
   }

   # Redirect HTTP to HTTPS
   server {
       listen 80;
       server_name hackathon.college.edu;
       return 301 https://$server_name$request_uri;
   }
   ```

4. **Enable Site and Restart**
   ```bash
   sudo ln -s /etc/nginx/sites-available/hackathon /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### Method 4: Docker Container

For containerized deployment.

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Push

```bash
docker build -t hackathon-portal:1.0.0 .
docker tag hackathon-portal:1.0.0 registry.college.edu/hackathon-portal:latest
docker push registry.college.edu/hackathon-portal:latest
```

---

## Production Configuration

### Security Headers

Ensure these headers are set in your web server:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.vercel.com
Referrer-Policy: no-referrer-when-downgrade
```

### Rate Limiting

Configure rate limiting for API endpoints:

```
Max login attempts: 5 per hour
Max registration: 50 per hour
Max file upload: 10 per minute
```

### Database & Storage

**Current Setup**: LocalStorage (development/demo)

**Production Migration Path**:
1. Backend API (Node.js/Django/Rails)
2. Database (PostgreSQL/MongoDB)
3. File storage (AWS S3/Google Cloud)
4. Email service (SendGrid/AWS SES)

---

## SSL/TLS Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate Certificate
sudo certbot certonly --nginx -d hackathon.college.edu

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Verify SSL

```bash
https://www.ssllabs.com/ssltest/analyze.html?d=hackathon.college.edu
```

---

## Performance Monitoring

### Enable Performance Tracking

1. **Google Analytics**
   ```bash
   # Add GA script to index.html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   ```

2. **Sentry Error Tracking**
   ```bash
   npm install @sentry/react
   # Configure in App.tsx
   ```

3. **Lighthouse Audits**
   ```bash
   # Chrome DevTools → Lighthouse
   # Target: 90+ score
   ```

### Monitor Key Metrics

- **Core Web Vitals**
  - Largest Contentful Paint (LCP): < 2.5s
  - First Input Delay (FID): < 100ms
  - Cumulative Layout Shift (CLS): < 0.1

- **Application Metrics**
  - Registration completion rate
  - Login success rate
  - Page load time
  - Error rate

---

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Issues

```bash
# Check build size
du -sh dist/

# Verify assets
ls -lah dist/assets/

# Check service health
curl -I https://hackathon.college.edu
```

### Performance Issues

- Enable GZIP compression
- Reduce JavaScript bundle size
- Optimize images
- Enable browser caching
- Use CDN for static assets

### Security Issues

- Update dependencies: `npm audit fix`
- Enable HTTPS: `certbot renew`
- Review logs for suspicious activity
- Implement IP whitelisting if needed

---

## Rollback Procedure

If issues occur after deployment:

### Vercel
```bash
# View deployments
vercel ls

# Rollback to previous version
vercel rollback
```

### Netlify
```bash
# View deployment history
netlify deploy:list

# Redeploy previous version
netlify deploy --prod --dir=dist
```

### Traditional Server
```bash
# Keep backup of previous build
sudo cp -r /var/www/hackathon /var/www/hackathon.backup

# Restore if needed
sudo cp -r /var/www/hackathon.backup/* /var/www/hackathon/
```

---

## Post-Deployment Verification

- [ ] HTTPS working with valid certificate
- [ ] All pages accessible and loading correctly
- [ ] Login/registration functional
- [ ] Project abstracts displaying
- [ ] Submission uploads working
- [ ] Admin dashboard accessible
- [ ] Database syncing (if applicable)
- [ ] Email notifications working (if configured)
- [ ] Monitoring and logging active
- [ ] Team members can access their dashboards

---

## Support

For deployment issues contact:
- **Technical Support**: tech-support@college.edu
- **Documentation**: See README.md
- **Issue Tracking**: [GitHub Issues/Project Board]

---

**Version**: 1.0.0 | **Last Updated**: July 2026
