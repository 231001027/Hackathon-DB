# Quick Start Guide

**⚡ Get Started in 5 Minutes**

---

## 1. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 2. Configuration

```bash
# Copy environment template
cp .env.example .env

# Update environment variables (optional for development)
# VITE_API_URL=your-api-endpoint
# VITE_AUTH_TIMEOUT=3600000
```

---

## 3. Key Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Deploy
npm run build           # Production build
npm run preview         # Preview production build

# Quality Checks
npm run typecheck       # Type checking
npm run lint            # Linting
```

---

## 4. Test Accounts (Development)

**Student Login**
- Email: student@example.com
- Password: SecurePass123!

**Admin Login**
- Email: admin@example.com
- Password: AdminPass123!

---

## 5. Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview & setup |
| `FINAL_SUMMARY.md` | Complete project summary |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment guide |
| `.env.example` | Environment variables |
| `vite.config.ts` | Build configuration |

---

## 6. Deployment (Choose One)

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Traditional Server
```bash
npm run build
# Copy dist/ to server
```

---

## 7. Build Verification

```bash
# Verify everything works
npm run typecheck && npm run build

# Expected output:
# ✓ TypeScript: 0 errors
# ✓ Build: 392KB (155KB gzipped)
# ✓ Built successfully in 1.14s
```

---

## 8. Features to Explore

- **Landing Page**: `/` 
- **Student Login**: `/student-login`
- **Admin Login**: `/admin-login`
- **Registration**: `/register-team-leader`
- **Student Dashboard**: `/student/dashboard` (after login)
- **Admin Dashboard**: `/admin/dashboard` (after admin login)

---

## 9. Project Structure

```
src/
├── components/      # UI components
├── pages/          # Page components
├── context/        # React context (Auth, Theme, Toast)
├── hooks/          # Custom hooks
├── utils/          # Utilities (validation, cache, etc.)
├── types/          # TypeScript types
├── data/           # Static data & project abstracts
└── config/         # Configuration
```

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Clear cache: `Ctrl+Shift+Delete` |
| 404 on refresh | Already configured ✓ |
| Slow build | Normal (1-2s) |
| Port 5173 taken | `npm run dev -- --port 3000` |

---

## 11. Documentation Map

```
Get Started:
  → QUICK_START.md (you are here)
  → README.md

Development:
  → PROJECT_STRUCTURE.md
  → CODE_STANDARDS.md
  → DESIGN_SYSTEM.md

Deployment:
  → DEPLOYMENT_CHECKLIST.md
  → DEPLOYMENT.md

Quality:
  → TEST_STRATEGY.md
  → ACCESSIBILITY.md
  → PERFORMANCE.md

Reference:
  → FINAL_SUMMARY.md
```

---

## 12. Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Explore the app
4. ✅ Check documentation
5. ✅ Deploy when ready

---

## 12. Support

For more detailed information, see:
- **Setup Issues**: Check README.md
- **Development**: See PROJECT_STRUCTURE.md & CODE_STANDARDS.md
- **Deployment**: See DEPLOYMENT_CHECKLIST.md
- **Performance**: See PERFORMANCE.md
- **Accessibility**: See ACCESSIBILITY.md

---

**Happy Coding! 🚀**

Last Updated: July 24, 2026  
Status: Production Ready ✅
