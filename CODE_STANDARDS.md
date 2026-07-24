# Code Standards & Quality Guide

Professional code quality standards for the Smart Ability Hackathon Portal.

---

## Table of Contents

1. [TypeScript Standards](#typescript-standards)
2. [React Best Practices](#react-best-practices)
3. [Code Organization](#code-organization)
4. [Naming Conventions](#naming-conventions)
5. [Documentation Standards](#documentation-standards)
6. [Error Handling](#error-handling)
7. [Testing Standards](#testing-standards)
8. [Review Checklist](#review-checklist)

---

## TypeScript Standards

### Strict Mode Enabled

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Definitions

```typescript
// ✓ GOOD: Explicit types
function calculateTotal(items: Array<Item>, taxRate: number): number {
  return items.reduce((sum, item) => sum + (item.price * (1 + taxRate)), 0);
}

// ✗ BAD: Implicit any
function calculateTotal(items, taxRate) {
  return items.reduce((sum, item) => sum + (item.price * (1 + taxRate)), 0);
}

// ✓ GOOD: Interfaces for objects
interface User {
  id: string;
  email: string;
  name: string;
  isLeader: boolean;
}

// ✗ BAD: Using object type
type User = object;

// ✓ GOOD: Union types for variants
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

// ✗ BAD: String anywhere
type FormStatus = string;
```

### Enums vs Union Types

```typescript
// ✓ GOOD: Union types for simple variants
type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted';

// ✓ GOOD: Enums for complex types
enum UserRole {
  Admin = 'admin',
  Leader = 'leader',
  Member = 'member',
}

// Guard clauses with type checking
function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}
```

### Generic Types

```typescript
// ✓ GOOD: Generic utilities
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

// Usage
const team = getById<Team>(teams, 'team-123');

// ✓ GOOD: Generic async wrapper
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<T>;
}
```

---

## React Best Practices

### Component Structure

```typescript
// ✓ GOOD: Clear component structure
interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (projectId: string) => void;
}

/**
 * Displays a project problem statement card
 * @param project - Project data to display
 * @param isSelected - Whether project is currently selected
 * @param onSelect - Callback when project is selected
 */
export default function ProjectCard({
  project,
  isSelected,
  onSelect,
}: ProjectCardProps) {
  return (
    <div>
      <h3>{project.title}</h3>
      <button onClick={() => onSelect(project.id)}>
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
}
```

### Hooks Usage

```typescript
// ✓ GOOD: Hooks at top level
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    // Side effect
  }, [dependencies]);

  return <div>{count}</div>;
}

// ✗ BAD: Hooks in conditionals
function MyComponent() {
  if (condition) {
    const [count, setCount] = useState(0); // ✗ Don't do this
  }
}

// ✓ GOOD: useCallback for event handlers
const handleSelect = useCallback((projectId: string) => {
  selectProject(projectId);
}, [selectProject]);

// ✓ GOOD: useMemo for derived state
const filteredProjects = useMemo(() => {
  return projects.filter(p => p.difficulty === selectedDifficulty);
}, [projects, selectedDifficulty]);
```

### Component Memoization

```typescript
// ✓ GOOD: Memo for pure components
interface ItemProps {
  item: Item;
  onDelete: (id: string) => void;
}

const ItemRow = memo(function ItemRow({ item, onDelete }: ItemProps) {
  return (
    <tr>
      <td>{item.name}</td>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </tr>
  );
});
```

---

## Code Organization

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Input, etc)
│   ├── admin/          # Admin-specific components
│   └── ErrorBoundary.tsx
├── pages/              # Page components
│   └── admin/          # Admin pages
├── context/            # React Context providers
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── config/             # Configuration
├── data/               # Static data & seed
├── layouts/            # Layout wrappers
├── routes/             # Route components
└── styles/             # Global styles
```

### Module Organization

```typescript
// ✓ GOOD: Clear separation of concerns
// utils/validation.ts - focused on validation
export function isValidEmail(email: string): boolean { ... }

// utils/cache.ts - focused on caching
export class SmartCache { ... }

// ✓ GOOD: Index files for public API
// utils/index.ts
export { isValidEmail, isValidMobile } from './validation';
export { cache } from './cache';
export { perf } from './performance';

// Usage
import { isValidEmail, cache, perf } from '@/utils';
```

---

## Naming Conventions

### Variables & Functions

```typescript
// ✓ GOOD: Clear, descriptive names
const isUserLoggedIn = user !== null;
const totalTeamMembers = team.members.length + 1;

function validateTeamRegistration(team: Team): ValidationResult { ... }

// ✗ BAD: Vague names
const x = user !== null;
const t = team.members.length + 1;
function validate(t) { ... }

// ✓ GOOD: Boolean prefixes
const isLoading = false;
const hasError = false;
const canSubmit = form.isValid;
const shouldShowModal = true;

// ✓ GOOD: Action function names
const handleClick = () => { ... };
const handleSubmit = () => { ... };
const handleChange = () => { ... };
```

### Components

```typescript
// ✓ GOOD: Clear component names
function ProjectAbstractCard() { ... }
function TeamMembersSetupPage() { ... }
function ValidationFeedback() { ... }

// ✗ BAD: Unclear names
function Card() { ... }
function Setup() { ... }
function Feedback() { ... }

// ✓ GOOD: Wrapper component naming
function WithAuth(Component) { ... }  // HOC
function useFormValidation() { ... }  // Hook
```

### Constants

```typescript
// ✓ GOOD: UPPER_CASE for constants
const MAX_TEAM_MEMBERS = 5;
const API_TIMEOUT_MS = 30000;
const STORAGE_KEY_USER = 'user_data';

// ✗ BAD: Inconsistent naming
const maxMembers = 5;
const timeOut = 30000;
const USER_KEY = 'user_data';
```

---

## Documentation Standards

### JSDoc Comments

```typescript
/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns true if valid, false otherwise
 * @example
 * isValidEmail('user@example.com') // true
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Fetches and filters teams
 * @param teams - Array of teams
 * @param query - Search query
 * @param options - Filter options
 * @param options.maxResults - Max results to return (default: 10)
 * @returns Filtered team list
 * @throws {Error} If query is invalid
 */
function filterTeams(
  teams: Team[],
  query: string,
  options?: { maxResults?: number }
): Team[] {
  if (!query || query.length < 2) {
    throw new Error('Query must be at least 2 characters');
  }
  // Implementation
}

/**
 * Custom hook for form validation
 * @param initialValues - Initial form values
 * @param onSubmit - Callback on form submission
 * @returns Form state and methods
 * @example
 * const { values, errors, setFieldValue } = useFormValidation(
 *   { email: '' },
 *   handleSubmit
 * );
 */
export function useFormValidation<T>(
  initialValues: T,
  onSubmit?: (values: T) => void
) {
  // Implementation
}
```

### Inline Comments

```typescript
// ✓ GOOD: Comments explain WHY, not WHAT
// Cache results for 5 minutes to reduce API calls during rapid filtering
const filteredTeams = useMemo(() => {
  return teams.filter(p => p.name.includes(query));
}, [teams, query]);

// ✗ BAD: Comments state obvious code
// Loop through teams
teams.forEach(team => { ... });

// ✓ GOOD: Mark complex logic
// Exponential backoff: delay = initialDelay * (multiplier ^ attempt)
// This prevents overwhelming the server with retry attempts
const delay = Math.min(
  initialDelay * Math.pow(backoffMultiplier, attempt),
  maxDelay
);
```

### README Section Comments

```typescript
/**
 * Error Boundary Component
 * 
 * Catches rendering errors and displays professional error UI.
 * Prevents entire application from crashing due to component errors.
 * 
 * @component
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * 
 * @see ACCESSIBILITY.md - Error message display standards
 */
```

---

## Error Handling

### Try-Catch Usage

```typescript
// ✓ GOOD: Specific error handling
async function loadTeams() {
  try {
    const teams = await fetchTeams();
    return teams;
  } catch (error) {
    if (error instanceof NetworkError) {
      logger.error('Network error loading teams', error);
      throw new Error('Unable to connect. Please check your internet.');
    }
    if (error instanceof APIError) {
      logger.error('API error loading teams', error);
      throw new Error('Server error. Please try again later.');
    }
    throw error; // Re-throw unknown errors
  }
}

// ✗ BAD: Generic catch-all
async function loadTeams() {
  try {
    return await fetchTeams();
  } catch (error) {
    console.log('Error'); // Vague, no context
  }
}
```

### Custom Error Classes

```typescript
// ✓ GOOD: Custom errors with context
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Usage
try {
  validateEmail(email);
} catch (error) {
  if (error instanceof ValidationError) {
    setFieldError(error.field, error.message);
  }
}
```

---

## Testing Standards

### Test File Location

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── utils/
│   ├── validation.ts
│   └── validation.test.ts
```

### Test Structure

```typescript
// ✓ GOOD: Clear test organization
describe('isValidEmail', () => {
  describe('valid emails', () => {
    it('should accept standard emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    it('should accept emails with dots', () => {
      expect(isValidEmail('first.last@example.com')).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('should reject emails without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('should reject emails without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });
  });
});
```

---

## Review Checklist

### Code Quality

- [ ] TypeScript compiles with no errors
- [ ] No console errors or warnings
- [ ] No `any` types without explanation
- [ ] All functions have return types
- [ ] No unused variables or imports
- [ ] Names are clear and descriptive
- [ ] No magic numbers (use constants)

### Documentation

- [ ] JSDoc comments on public functions
- [ ] Complex logic has inline comments
- [ ] README updated if behavior changed
- [ ] API documented if applicable
- [ ] Examples provided for complex features

### Performance

- [ ] No unnecessary re-renders
- [ ] useCallback for event handlers
- [ ] useMemo for expensive calculations
- [ ] Lazy loading implemented
- [ ] Bundle size acceptable

### Accessibility

- [ ] WCAG 2.1 Level AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

### Security

- [ ] Input validation implemented
- [ ] No hardcoded secrets
- [ ] XSS protection in place
- [ ] Rate limiting configured
- [ ] Error messages safe

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete
- [ ] Edge cases handled
- [ ] Error scenarios tested

---

## Git Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build, dependencies

### Examples

```
feat(auth): add email validation to login form

- Add RFC 5322 compliant email validator
- Show real-time validation feedback
- Add error message for invalid emails

Closes #123

fix(dashboard): fix team members count calculation

Update teamMemberCount() to include leader in count.

Fixes #456

docs: add accessibility guidelines

Added ACCESSIBILITY.md with WCAG 2.1 Level AA standards.
```

---

## Code Review Guidelines

### Reviewer Responsibilities

- [ ] Code follows standards in this document
- [ ] Logic is correct and efficient
- [ ] Tests are adequate
- [ ] Documentation is clear
- [ ] No security issues
- [ ] Performance acceptable

### Author Responsibilities

- [ ] Code is clean and well-organized
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Self-review before submitting

---

## Tools & Configuration

### ESLint

```bash
npm run lint        # Run linter
npm run lint:fix    # Auto-fix issues
```

### TypeScript

```bash
npm run typecheck   # Type checking
```

### Build

```bash
npm run build       # Production build
npm run preview     # Preview build
```

---

## Continuous Improvement

- Review this document quarterly
- Update based on team feedback
- Document new patterns
- Share best practices
- Celebrate improvements

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Active ✓
