# Smart Ability Hackathon Portal

Professional hackathon registration and team management platform for college hackathon events.

**Version**: 1.0.0 | **Status**: Production-Ready

🚀 **Live Demo**: https://hackathon-db-six.vercel.app/

---

## 📋 Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Security](#security)
8. [Performance](#performance)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

---

## ✨ Features

### For Team Leaders
- ✅ Register team with up to 5 members
- ✅ Set team academic details (department, year)
- ✅ Fill member information (name, email, department, year)
- ✅ Select project problem statement from 11 available
- ✅ Upload project abstract/PDF submission
- ✅ Track team submission status
- ✅ Real-time team dashboard with progress tracking

### For Team Members
- ✅ Join team using team name and password
- ✅ View team dashboard and project selection
- ✅ Track submission progress
- ✅ Access project abstracts library

### For Administrators
- ✅ Dashboard with live hackathon statistics
- ✅ Team management and monitoring
- ✅ Submission tracking and analytics
- ✅ Export team data and reports
- ✅ Event settings management

### Technical Features
- 🔒 Secure authentication with input validation
- 🎨 Professional dark/light theme support
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Optimized performance with code splitting
- ♿ WCAG accessibility compliance
- 🛡️ XSS protection and input sanitization
- 🚀 Production-ready error handling
- 📊 Real-time data synchronization

---

## 📦 Prerequisites

### Required
- **Node.js** 18.0+ ([Download](https://nodejs.org))
- **npm** 9.0+ (comes with Node.js)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Optional
- Git for version control
- VS Code for development

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Hackathon-Portal
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18.3.1
- React Router 7.18.1
- Framer Motion 12.42.2
- Tailwind CSS 3.4.1
- Vite 5.4.2

### Step 3: Verify Installation

```bash
npm run typecheck
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the project root for development:

```bash
# Development Configuration
VITE_API_URL=http://localhost:5174
VITE_ENABLE_DEBUGGING=true
VITE_LOG_LEVEL=debug
```

### Application Settings

Edit `src/config/environment.ts` to configure:
- App name and branding
- Feature flags (email verification, password reset, etc.)
- Security settings (rate limiting, CSP headers)
- Logging levels
- Cache settings

### Departments & Years

Customize available departments and years in `src/utils/index.ts`:

```typescript
export const DEPARTMENTS = [
  'B.E. / B.Tech - Computer Science',
  'B.E. / B.Tech - Information Technology',
  // Add more...
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
```

---

## 💻 Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

Server runs at: **http://localhost:5174/**

### Production Build

Create an optimized production build:

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Code Quality

Run linting:

```bash
npm run lint
```

Type checking:

```bash
npm run typecheck
```

---

## 📂 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base components (Button, Input, etc.)
│   ├── admin/           # Admin-specific components
│   ├── sections/        # Page sections
│   └── ErrorBoundary.tsx
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── StudentDashboard.tsx
│   └── ...
├── context/             # React Context (Auth, Theme, Toast)
├── config/              # Configuration files
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── validation.ts    # Input validation
│   └── ...
├── data/                # Static data & seed
│   └── projectAbstracts.ts
├── layouts/             # Layout components
├── routes/              # Route protection
├── index.css            # Global styles
└── main.tsx             # App entry point
```

---

## 🔒 Security

### Best Practices Implemented

1. **Input Validation**
   - Email validation with RFC 5322 compliance
   - Mobile number validation (Indian format)
   - Password strength requirements (8+ chars, uppercase, number, special char)
   - Team name and person name validation
   - XSS protection through input sanitization

2. **Authentication**
   - Secure password handling
   - Role-based access control (RBAC)
   - Protected routes
   - Session management via localStorage

3. **Data Protection**
   - Validation of all user inputs
   - File upload validation (PDF only, max 10MB)
   - Error boundary for error handling

4. **Frontend Security**
   - Content Security Policy headers
   - X-Frame-Options protection
   - X-Content-Type-Options enforcement
   - Rate limiting for form submissions

### Security Configuration

Edit `src/config/environment.ts`:

```typescript
security: {
  enableRateLimit: true,      // Limit repeated attempts
  enableCSP: true,            // Content Security Policy
  enableXFrameOptions: true,  // Clickjacking protection
  enableXContentTypeOptions: true,
  csrfProtection: true,       // CSRF token validation
}
```

---

## ⚡ Performance

### Optimization Strategies

1. **Code Splitting**
   - Pages loaded on-demand with React lazy()
   - Suspense fallback for smooth transitions
   - Bundle analysis: ~389KB (gzipped: ~127KB)

2. **Build Optimization**
   - Vite for fast development & production builds
   - Tree-shaking of unused code
   - Minification and compression
   - Asset optimization

3. **Caching**
   - Browser caching enabled
   - LocalStorage for session persistence
   - Data caching in config

4. **Rendering**
   - Framer Motion for performant animations
   - Efficient re-renders with React hooks
   - CSS-in-JS with Tailwind (no runtime overhead)

### Performance Checklist

- [ ] Production build created (`npm run build`)
- [ ] Bundle size < 500KB
- [ ] First Contentful Paint (FCP) < 1s
- [ ] Lighthouse score > 90

---

## 🎨 Theming

### Dark Mode Support

The app automatically detects system preference and supports manual switching via the ThemeToggle component.

### Customizing Colors

Edit `src/index.css` and Tailwind configuration to customize the color scheme:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg;
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port 5173/5174 Already in Use

```bash
# Kill process using the port (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

#### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Fails

```bash
# Clear build cache
rm -rf dist
npm run build
```

#### TypeScript Errors

```bash
# Run type checking
npm run typecheck

# Fix common errors
npm run lint -- --fix
```

---

## 📱 Deployment

### Prerequisites

- Node.js runtime environment
- Web server (Nginx, Apache, Vercel, Netlify, etc.)
- HTTPS certificate for production

### Deployment Steps

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your hosting

3. **Configure Web Server**
   - Set index.html as default route
   - Enable GZIP compression
   - Set cache headers for assets
   - Configure HTTPS/SSL

4. **Environment Variables**
   - Set production API URL
   - Disable debugging
   - Set log level to "error"

### Vercel Deployment

```bash
npm i -g vercel
vercel
```

### Netlify Deployment

```bash
npm i -g netlify-cli
netlify deploy
```

---

## 📊 Database & Storage

### Current Implementation
- LocalStorage for session persistence
- In-memory data state management
- Seed data for development/demo

### Future Enhancements
- Backend API integration
- Database (PostgreSQL, MongoDB)
- Email service (SendGrid, AWS SES)
- File storage (AWS S3, Google Cloud Storage)
- Analytics service

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and commit
   ```bash
   git commit -m "feat: add new feature"
   ```

3. Push and create pull request
   ```bash
   git push origin feature/your-feature
   ```

### Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Keep components small and focused
- Add JSDoc comments for complex functions
- Write meaningful commit messages

---

## 📞 Support & Documentation

### Getting Help

- Check [Troubleshooting](#troubleshooting) section
- Review code comments in `src/`
- Check component PropTypes
- Review error messages in browser console

### Additional Resources

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📄 License

This project is confidential and for use by [College Name] only.

---

## 📞 Contact

**Hackathon Coordinator**
- Email: hackathon@college.edu
- Phone: +91-XXX-XXX-XXXX

**Technical Support**
- Email: tech-support@college.edu

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✓
