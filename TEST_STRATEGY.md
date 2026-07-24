# Test Strategy & Validation Implementation

Comprehensive testing and validation approach for the Smart Ability Hackathon Portal.

---

## Table of Contents

1. [Testing Pyramid](#testing-pyramid)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [Validation Strategy](#validation-strategy)
5. [Error Scenarios](#error-scenarios)
6. [User Feedback](#user-feedback)
7. [Test Checklists](#test-checklists)

---

## Testing Pyramid

### Structure

```
        🔺 E2E Tests (5%)
       End-to-end user flows
       
      🔺 Integration Tests (25%)
     Component interactions & API calls
     
    🔺 Unit Tests (70%)
   Individual functions & utilities
```

### Testing Distribution

- **Unit Tests**: 70% - Individual functions, utilities, validators
- **Integration Tests**: 25% - Component interactions, form submissions
- **E2E Tests**: 5% - Critical user flows (registration, login, submission)

---

## Unit Testing

### Validation Functions

```typescript
// Example: Test email validation
describe('isValidEmail', () => {
  it('should accept valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('first.last@domain.co.uk')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
  });
});

// Example: Test mobile validation
describe('isValidMobile', () => {
  it('should accept valid Indian mobile numbers', () => {
    expect(isValidMobile('9876543210')).toBe(true);
    expect(isValidMobile('8765432109')).toBe(true);
  });

  it('should reject invalid numbers', () => {
    expect(isValidMobile('1234567890')).toBe(false); // Starts with 1
    expect(isValidMobile('98765432')).toBe(false);   // Too short
    expect(isValidMobile('abc123def5')).toBe(false); // Contains letters
  });
});

// Example: Test password validation
describe('validatePassword', () => {
  it('should score password strength correctly', () => {
    const weak = validatePassword('weak');
    expect(weak.score).toBe(0);

    const strong = validatePassword('SecurePass123!');
    expect(strong.score).toBeGreaterThan(2);
    expect(strong.label).toBe('Strong');
  });

  it('should identify missing requirements', () => {
    const password = validatePassword('password');
    expect(password.issues).toContain('Include uppercase letter');
    expect(password.issues).toContain('Include number');
    expect(password.issues).toContain('Include special character');
  });
});

// Example: Test form validator
describe('validateLoginForm', () => {
  it('should validate required fields', () => {
    const { valid, errors } = validateLoginForm('', '');
    expect(valid).toBe(false);
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('should validate email format', () => {
    const { valid, errors } = validateLoginForm('invalid', 'password123');
    expect(valid).toBe(false);
    expect(errors.email).toContain('valid email');
  });

  it('should accept valid input', () => {
    const { valid, errors } = validateLoginForm('user@example.com', 'password123');
    expect(valid).toBe(true);
    expect(Object.keys(errors).length).toBe(0);
  });
});
```

### Cache Functions

```typescript
describe('SmartCache', () => {
  it('should store and retrieve data', () => {
    const cache = new SmartCache();
    cache.set('key', { value: 'data' });
    expect(cache.get('key')).toEqual({ value: 'data' });
  });

  it('should expire cached data', () => {
    const cache = new SmartCache();
    cache.set('key', 'data', { memoryTTL: 10 }); // 10ms
    expect(cache.get('key')).toBe('data');
    
    // After expiration
    jest.advanceTimersByTime(20);
    expect(cache.get('key')).toBeNull();
  });

  it('should clear all cache', () => {
    const cache = new SmartCache();
    cache.set('key1', 'data1');
    cache.set('key2', 'data2');
    cache.clear();
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });
});
```

---

## Integration Testing

### Form Component Testing

```typescript
describe('LoginForm Component', () => {
  it('should display validation errors', async () => {
    const { getByRole, getByText } = render(<LoginForm />);
    
    const submitButton = getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText(/email.*required/i)).toBeInTheDocument();
      expect(getByText(/password.*required/i)).toBeInTheDocument();
    });
  });

  it('should enable submit button when form is valid', async () => {
    const { getByRole, getByPlaceholderText } = render(<LoginForm />);
    
    const emailInput = getByPlaceholderText(/email/i);
    const passwordInput = getByPlaceholderText(/password/i);
    const submitButton = getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    const { getByRole, getByPlaceholderText } = render(
      <LoginForm onSubmit={onSubmit} />
    );
    
    fireEvent.change(getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});

// Form interaction testing
describe('TeamRegistrationForm', () => {
  it('should progress through steps', () => {
    const { getByText, queryByText } = render(<TeamRegistrationForm />);
    
    // Step 1 visible
    expect(getByText(/team name/i)).toBeInTheDocument();
    
    // Fill step 1
    fillStep1Form();
    fireEvent.click(getByText(/next/i));

    // Step 2 visible
    expect(queryByText(/team name/i)).not.toBeInTheDocument();
    expect(getByText(/department/i)).toBeInTheDocument();
  });

  it('should validate before moving to next step', () => {
    const { getByText } = render(<TeamRegistrationForm />);
    
    fireEvent.click(getByText(/next/i));

    expect(getByText(/required/i)).toBeInTheDocument();
  });
});
```

---

## Validation Strategy

### Real-time Validation

```typescript
// Input validation during typing
const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const email = e.target.value;
  setFieldValue('email', email);
  
  // Real-time validation
  if (email.trim().length > 0) {
    const error = fieldValidators.email(email);
    setFieldError('email', error || '');
  }
}, [setFieldValue, setFieldError]);

// Debounced validation for expensive checks
const debouncedCheckDuplicate = debounce((email: string) => {
  if (isDuplicateEmail(email, teams)) {
    setFieldError('email', ERROR_MESSAGES.EMAIL_DUPLICATE);
  }
}, 300);

useEffect(() => {
  if (isValidEmail(email)) {
    debouncedCheckDuplicate(email);
  }
}, [email]);
```

### Async Validation

```typescript
// Validate team password
async function validateTeamPassword(
  teamId: string,
  password: string
): Promise<{ valid: boolean; error?: string }> {
  const team = teams.find(t => t.id === teamId);
  
  if (!team) {
    return { valid: false, error: 'Team not found' };
  }
  
  if (team.password !== password) {
    return { valid: false, error: 'Incorrect password' };
  }
  
  return { valid: true };
}

// Usage in form
const handlePasswordValidation = async (password: string) => {
  const result = await validateTeamPassword(teamId, password);
  if (!result.valid) {
    setFieldError('teamPassword', result.error);
  }
};
```

### Validation on Submit

```typescript
// Full form validation
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate all fields
  const validation = validateForm(values, {
    name: (v) => fieldValidators.name(v as string),
    email: (v) => fieldValidators.email(v as string),
    password: (v) => fieldValidators.password(v as string),
  });

  if (!validation.valid) {
    setErrors(validation.errors);
    toast.error('Please fix the highlighted fields');
    return;
  }

  // Submit if valid
  setSubmitting(true);
  try {
    await onSubmit(values);
    toast.success('Form submitted successfully');
  } catch (error) {
    toast.error(getErrorMessage(error).message);
    setErrors({ submit: getErrorMessage(error).message });
  } finally {
    setSubmitting(false);
  }
};
```

---

## Error Scenarios

### Network Errors

```typescript
// Test offline scenario
describe('Offline Handling', () => {
  it('should handle network error gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(
      new Error('Failed to fetch')
    );

    const { getByText } = render(<LoginForm />);
    
    fillForm();
    fireEvent.click(getByText(/sign in/i));

    await waitFor(() => {
      expect(getByText(/network.*connection/i)).toBeInTheDocument();
    });
  });

  it('should show retry option', async () => {
    const { getByText } = render(<ErrorMessage error={networkError} />);
    expect(getByText(/retry/i)).toBeInTheDocument();
  });
});
```

### Validation Errors

```typescript
// Test validation error display
describe('Validation Error Display', () => {
  it('should show field-level errors', () => {
    const { getByText } = render(
      <FieldError error="Email is invalid" />
    );
    expect(getByText(/email is invalid/i)).toBeInTheDocument();
  });

  it('should show form-level errors', () => {
    const errors = {
      email: 'Invalid email',
      password: 'Too weak',
    };
    const { getByText } = render(
      <ValidationFeedback
        message="Please fix 2 errors"
        type="error"
      />
    );
    expect(getByText(/fix 2 errors/i)).toBeInTheDocument();
  });
});
```

### Timeout Errors

```typescript
// Test request timeout
describe('Request Timeout', () => {
  it('should handle request timeout', async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100);

    try {
      await fetch('/api/teams', { signal: controller.signal });
    } catch (error) {
      expect(error.name).toBe('AbortError');
    }
  });
});
```

---

## User Feedback

### Success Feedback

```typescript
// Show success message
const handleRegistrationSuccess = () => {
  toast.success('Team registered successfully!', {
    description: `Welcome, ${teamName}. You can now log in.`,
  });
  navigate('/student-login');
};

// Show loading state
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Spinner className="animate-spin mr-2" />
      Registering...
    </>
  ) : (
    'Register Team'
  )}
</button>
```

### Error Feedback

```typescript
// Show error message
const showError = (error: unknown) => {
  const { message, code } = getErrorMessage(error);
  toast.error(message, {
    description: code !== 'ERROR' ? code : undefined,
  });
};

// Show field error with icon
<div className="flex items-center gap-2">
  <AlertCircle className="w-4 h-4 text-red-500" />
  <span className="text-sm text-red-600">{error}</span>
</div>
```

### Loading States

```typescript
// Loading skeleton
{isLoading ? (
  <CardSkeleton />
) : (
  <ProjectCard project={project} />
)}

// Loading indicator
{isLoading && (
  <div className="flex items-center justify-center gap-2">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-500 border-t-transparent" />
    <span>Loading...</span>
  </div>
)}
```

---

## Test Checklists

### Before Deployment

#### Functionality
- [ ] Login/logout works
- [ ] Registration flows complete
- [ ] Form validation triggers correctly
- [ ] Error messages display
- [ ] Success messages appear
- [ ] Navigation works
- [ ] All pages load
- [ ] Dashboard displays data

#### Edge Cases
- [ ] Empty form submission
- [ ] Invalid email formats
- [ ] Weak passwords rejected
- [ ] Duplicate emails caught
- [ ] Special characters handled
- [ ] Very long inputs handled
- [ ] Rapid submissions prevented
- [ ] Network timeout handled

#### Error Scenarios
- [ ] Network error shown
- [ ] API error shown
- [ ] Validation error shown
- [ ] Timeout handled
- [ ] Offline mode handled
- [ ] Error boundary catches crashes
- [ ] Toast notifications appear
- [ ] Retry works

#### Performance
- [ ] Page loads quickly
- [ ] No console errors
- [ ] Animations smooth
- [ ] Forms responsive
- [ ] No memory leaks
- [ ] Caching works
- [ ] Bundle size acceptable
- [ ] Lighthouse score > 90

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Labels associated with inputs
- [ ] Error messages announced
- [ ] Mobile responsive
- [ ] Touch targets 44x44px

#### Security
- [ ] No console errors
- [ ] XSS protection active
- [ ] Input sanitized
- [ ] No hardcoded secrets
- [ ] HTTPS enforced
- [ ] Rate limiting works
- [ ] Password rules enforced
- [ ] Session timeout works

#### Data Integrity
- [ ] Form data saved correctly
- [ ] LocalStorage persists
- [ ] No data loss on refresh
- [ ] Duplicate check works
- [ ] Data validation passes
- [ ] State updates correctly
- [ ] Cache invalidates properly
- [ ] Logout clears data

#### Cross-browser
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] Mobile browsers
- [ ] No broken layouts
- [ ] All features work
- [ ] Performance acceptable

---

## Continuous Testing

### Pre-commit
```bash
npm run typecheck    # Type checking
npm run lint         # Linting
```

### Pre-deployment
```bash
npm run build        # Build test
npm run preview      # Preview test
npm run typecheck    # Final type check
```

### In production
- Monitor error logs
- Track performance metrics
- Watch user feedback
- Check browser console
- Monitor API errors
- Track conversion rates

---

## Testing Tools Setup

### Recommended Tools

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0"
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- validation.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="email"
```

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Ready for Implementation ✓
