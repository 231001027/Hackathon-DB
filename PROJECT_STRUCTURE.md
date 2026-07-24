# Project Structure Guide

Detailed guide to the Smart Ability Hackathon Portal project structure.

---

## Directory Overview

```
Hackathon-Portal/
├── .bolt/                          # Bolt configuration
├── dist/                           # Production build output
├── node_modules/                   # Dependencies
├── public/                         # Static assets
├── src/                            # Source code
│   ├── components/                 # React components
│   ├── pages/                      # Page components
│   ├── context/                    # React Context
│   ├── hooks/                      # Custom hooks
│   ├── utils/                      # Utility functions
│   ├── types/                      # TypeScript definitions
│   ├── config/                     # Configuration
│   ├── data/                       # Static data
│   ├── layouts/                    # Layout components
│   ├── routes/                     # Route protection
│   ├── styles/                     # Global styles
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── .env.example                    # Environment template
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore rules
├── eslint.config.js                # ESLint config
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── package-lock.json               # Dependency lock
├── postcss.config.js               # PostCSS config
├── tailwind.config.js              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── tsconfig.app.json               # App-specific config
├── tsconfig.node.json              # Node-specific config
├── vite.config.ts                  # Vite configuration
├── README.md                       # Main documentation
├── DEPLOYMENT.md                   # Deployment guide
├── TESTING.md                      # Testing guide
├── PERFORMANCE.md                  # Performance guide
├── ACCESSIBILITY.md                # Accessibility guide
├── DESIGN_SYSTEM.md                # Design guide
├── CODE_STANDARDS.md               # Code standards
└── PROJECT_STRUCTURE.md            # This file
```

---

## Component Structure

### /src/components/

```
components/
├── ui/                             # Base components
│   ├── Avatar.tsx                  # User avatar
│   ├── Breadcrumb.tsx              # Navigation breadcrumb
│   ├── Button.tsx                  # Reusable button
│   ├── FieldError.tsx              # Form error display
│   ├── Logo.tsx                    # Brand logo
│   ├── Modal.tsx                   # Modal dialog
│   ├── Progress.tsx                # Progress bar
│   ├── SearchBar.tsx               # Search input
│   ├── Skeleton.tsx                # Loading skeleton
│   ├── StatCard.tsx                # Statistics card
│   ├── StatusBadge.tsx             # Status indicator
│   ├── ThemeToggle.tsx             # Dark mode toggle
│   └── ValidationFeedback.tsx      # Validation messages
├── admin/                          # Admin components
│   ├── AdminSidebar.tsx            # Admin navigation
│   ├── Charts.tsx                  # Analytics charts
│   ├── DashboardHeader.tsx         # Dashboard header
│   ├── DataTable.tsx               # Team data table
│   └── TeamDetailsModal.tsx        # Team info modal
├── sections/                       # Landing page sections
│   ├── Contact.tsx                 # Contact section
│   ├── FAQ.tsx                     # FAQ section
│   ├── FeatureCards.tsx            # Features display
│   ├── Hero.tsx                    # Hero section
│   ├── StatsBand.tsx               # Statistics band
│   └── Timeline.tsx                # Event timeline
├── ErrorBoundary.tsx               # Error boundary
├── Footer.tsx                      # Footer component
├── Navbar.tsx                      # Navigation bar
├── NotificationPanel.tsx           # Notifications
├── ProjectAbstractCard.tsx         # Project card
├── ProjectAbstractsList.tsx        # Projects list
└── UploadCard.tsx                  # File upload
```

### Component Template

```typescript
/**
 * ComponentName - Brief description
 * Longer description explaining purpose and usage
 */

import React from 'react';

interface ComponentNameProps {
  /** Description of prop */
  propName: string;
  /** Optional prop description */
  optionalProp?: boolean;
}

/**
 * ComponentName Component
 * @param props - Component props
 * @returns Rendered component
 */
export default function ComponentName({
  propName,
  optionalProp = false,
}: ComponentNameProps) {
  return <div>{propName}</div>;
}
```

---

## Pages Structure

### /src/pages/

```
pages/
├── admin/                          # Admin pages
│   ├── AdminAnalytics.tsx          # Analytics dashboard
│   ├── AdminDashboard.tsx          # Main admin dashboard
│   ├── AdminSettings.tsx           # Admin settings
│   ├── AdminSubmissions.tsx        # Review submissions
│   └── AdminTeams.tsx              # Manage teams
├── AboutPage.tsx                   # About page
├── LandingPage.tsx                 # Home page
├── LoginPage.tsx                   # Login page
├── NotFoundPage.tsx                # 404 page
├── RegisterPage.tsx                # Registration choice
├── StudentDashboard.tsx            # Student main dashboard
├── TeamDetailsPage.tsx             # Team view page
├── TeamLeaderRegisterPage.tsx      # Team registration
├── TeamMembersSetupPage.tsx        # Member setup
└── MemberRegisterPage.tsx          # Member registration
```

---

## Utilities Structure

### /src/utils/

```
utils/
├── index.ts                        # Main exports
├── cn.ts                           # CSS class helper
├── icons.ts                        # Icon mapping
├── constants.ts                    # Constants
├── validation.ts                   # Input validation
├── formValidator.ts                # Form validators
├── apiErrors.ts                    # Error handling
├── cache.ts                        # Caching utilities
├── performance.ts                  # Performance monitoring
└── (additional utilities)
```

### Key Utilities

**validation.ts**
- Email validation
- Mobile number validation
- Password strength checking
- Input sanitization
- Rate limiting

**formValidator.ts**
- Field-level validators
- Form validation schemas
- Error messages
- Validation rules

**apiErrors.ts**
- Error codes
- Error messages
- Retry logic
- Response validation

**cache.ts**
- Memory cache
- Persistent cache
- Request deduplication
- Lazy loading

**performance.ts**
- Performance monitoring
- Core Web Vitals
- Memory analysis
- Metrics reporting

---

## Context Structure

### /src/context/

```
context/
├── AuthContext.tsx                 # Authentication state
├── ThemeContext.tsx                # Dark mode state
└── ToastContext.tsx                # Toast notifications
```

### Auth Context

```typescript
interface AuthContextValue {
  user: AuthUser | null;
  teams: Team[];
  loginStudent: (email: string, password: string) => { ok: boolean; message: string };
  loginAdmin: (email: string, password: string) => { ok: boolean; message: string };
  registerTeam: (data: Omit<Team, ...>) => { ok: boolean; team?: Team };
  registerMemberToTeam: (teamId: string, member: TeamMember) => void;
  updateTeamMembers: (teamId: string, members: Team['members']) => void;
  selectProject: (teamId: string, projectId: string) => void;
  uploadPdf: (fileName: string) => void;
  logout: () => void;
  // ...
}
```

---

## Types Structure

### /src/types/

```
types/
└── index.ts                        # All type definitions
```

### Core Types

```typescript
// User & Auth
interface AuthUser {
  role: UserRole;
  email: string;
  name: string;
  teamId?: string;
  isLeader: boolean;
}

// Team Data
interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  password: string;
  college: string;
  department: string;
  year: string;
  mobile: string;
  members: TeamMember[];
  membersComplete: boolean;
  selectedProjectId?: string;
  pdfName: string | null;
  submissionStatus: SubmissionStatus;
  submissionDate: string | null;
  createdAt: string;
}

interface TeamMember {
  name: string;
  email: string;
  department: string;
  year: string;
}

// Project Data
interface ProjectAbstract {
  id: string;
  problemNumber: number;
  title: string;
  problemStatement: string;
  developmentGuidelines: string;
  features: string[];
  expectedSolution: string[];
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Status Types
type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted';
type UserRole = 'student' | 'admin';
type ThemeMode = 'light' | 'dark';
```

---

## Hooks Structure

### /src/hooks/

```
hooks/
├── index.ts                        # Exports
├── useFormValidation.ts            # Form validation hook
├── useLocalStorage.ts              # LocalStorage hook
├── useCountUp.ts                   # Count animation
├── useFakeLoading.ts               # Loading simulator
├── useClickOutside.ts              # Click outside detection
└── useMediaQuery.ts                # Media query hook
```

### Custom Hooks

**useFormValidation**
- Form state management
- Validation handling
- Error tracking
- Touch tracking

**useLocalStorage**
- Persist state
- Sync with localStorage
- Automatic updates

---

## Routes Structure

### /src/routes/

```
routes/
└── ProtectedRoute.tsx              # Route protection
```

### Route Configuration

All routes configured in `/src/App.tsx`:

```
/                           → LandingPage
/about                      → AboutPage
/register                   → RegisterPage (role choice)
/register-team-leader       → TeamLeaderRegisterPage
/member-register            → MemberRegisterPage
/student-login              → LoginPage (student mode)
/admin-login                → LoginPage (admin mode)
/student/dashboard          → StudentDashboard
/student/setup-members      → TeamMembersSetupPage
/team-details               → TeamDetailsPage
/admin/dashboard            → AdminDashboard
/admin/teams                → AdminTeams
/admin/submissions          → AdminSubmissions
/admin/analytics            → AdminAnalytics
/admin/settings             → AdminSettings
*                           → NotFoundPage
```

---

## Data Structure

### /src/data/

```
data/
├── index.ts                        # Main seed data
├── seed.ts                         # Demo data generator
└── projectAbstracts.ts             # Project statements
```

---

## Layouts Structure

### /src/layouts/

```
layouts/
├── AdminLayout.tsx                 # Admin dashboard layout
└── PublicLayout.tsx                # Public pages layout
```

---

## Configuration Structure

### /src/config/

```
config/
└── environment.ts                  # Environment config
```

### Environment Configuration

```typescript
const config = {
  appName: 'Smart Ability Hackathon',
  appVersion: '1.0.0',
  features: {
    emailVerification: false,
    passwordReset: false,
    socialAuth: false,
  },
  limits: {
    maxTeamMembers: 5,
    maxFileSizeMB: 10,
  },
  security: {
    enableRateLimit: true,
    enableCSP: true,
  },
  logging: {
    enableConsoleLog: true,
    logLevel: 'debug',
  },
};
```

---

## Build Configuration

### vite.config.ts

```typescript
// Code splitting configuration
manualChunks: {
  'vendor': ['react', 'react-dom', 'react-router-dom'],
  'animation': ['framer-motion'],
  'icons': ['lucide-react'],
  'admin': ['./src/pages/admin/*'],
  'auth': ['./src/pages/*RegisterPage.tsx', './src/pages/LoginPage.tsx'],
  'student': ['./src/pages/StudentDashboard.tsx'],
}
```

---

## Development Workflow

### Local Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open browser: `http://localhost:5174`

### Building

```bash
npm run build              # Production build
npm run preview           # Preview build locally
npm run typecheck         # Type checking
npm run lint              # Linting
npm run lint:fix          # Auto-fix issues
```

---

## File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `ProjectAbstractCard.tsx`)
- **Pages**: `PascalCase.tsx` (e.g., `StudentDashboard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `validation.ts`)
- **Types**: `index.ts` (centralized)
- **Hooks**: `useCarmelCase.ts` (e.g., `useFormValidation.ts`)
- **Context**: `ContextNameContext.tsx` (e.g., `AuthContext.tsx`)
- **Tests**: `fileName.test.ts`

---

## Import Path Aliases

```typescript
// Use @ alias for cleaner imports
import { Button } from '@/components/ui/Button';
import { useFormValidation } from '@/hooks';
import { isValidEmail } from '@/utils/validation';
import type { Team } from '@/types';

// Instead of relative paths
// import Button from '../../../components/ui/Button';
```

---

## Adding New Features

### Step-by-Step Guide

1. **Create Types** (`/src/types/index.ts`)
   - Define interfaces
   - Export types

2. **Create Utilities** (`/src/utils/`)
   - Validation functions
   - Helper functions

3. **Create Components** (`/src/components/`)
   - Create component files
   - Add JSDoc comments
   - Export from index

4. **Create Pages** (if needed, `/src/pages/`)
   - Page component
   - Route configuration

5. **Update Routes** (`/src/App.tsx`)
   - Add route
   - Set up lazy loading

6. **Update Context** (if needed)
   - Add state
   - Add actions

7. **Add Documentation**
   - Update README.md
   - Add code comments
   - Update this file

8. **Test**
   - Manual testing
   - Edge cases
   - Accessibility

---

## Common Tasks

### Adding a Component

```bash
# 1. Create component file
touch src/components/MyComponent.tsx

# 2. Add to index (if needed)
# 3. Export from appropriate index file
# 4. Use in pages/other components
```

### Adding a Utility Function

```bash
# 1. Add to appropriate utils file
# 2. Export from utils/index.ts
# 3. Add JSDoc comments
# 4. Add unit tests
```

### Adding a New Route

1. Create page component
2. Add to App.tsx routes
3. Set up lazy loading
4. Add ProtectedRoute if needed
5. Update navigation

---

## Maintenance

- Review structure quarterly
- Update docs when adding features
- Keep components focused
- Refactor as needed
- Document new patterns

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Ready ✓
