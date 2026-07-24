# Testing Guide - Smart Ability Hackathon Portal

Comprehensive testing procedures for manual and automated testing of the hackathon portal.

---

## Table of Contents

1. [Test Coverage](#test-coverage)
2. [Manual Testing Checklist](#manual-testing-checklist)
3. [Form Validation Testing](#form-validation-testing)
4. [Authentication Testing](#authentication-testing)
5. [Error Handling Testing](#error-handling-testing)
6. [Performance Testing](#performance-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Browser Compatibility](#browser-compatibility)

---

## Test Coverage

### Priority Areas

- **Critical**: Authentication, Registration, Data Validation
- **High**: Dashboard, Team Management, Submissions
- **Medium**: UI/UX, Theme Toggle, Responsiveness
- **Low**: Analytics, Admin Settings

### Test Types

- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows
- **Manual Tests**: UI/UX and accessibility

---

## Manual Testing Checklist

### Pre-Deployment Testing

#### Landing Page
- [ ] Page loads without errors
- [ ] All hero animations smooth
- [ ] CTA buttons navigate correctly
- [ ] Footer displays properly
- [ ] Mobile layout responsive
- [ ] Dark mode toggle works
- [ ] No console errors

#### Navigation
- [ ] Navbar visible on all pages
- [ ] Links navigate correctly
- [ ] Mobile menu toggles
- [ ] Active route highlighted
- [ ] Breadcrumbs accurate

#### Theme & Accessibility
- [ ] Light mode colors readable
- [ ] Dark mode colors readable
- [ ] Theme persists on reload
- [ ] Font sizes readable
- [ ] Contrast ratios meet WCAG AA
- [ ] Focus indicators visible

---

## Form Validation Testing

### Test Cases

#### Email Validation

```
✓ Valid: user@college.edu
✓ Valid: firstname.lastname@university.ac.in
✗ Invalid: missing@domain
✗ Invalid: user@
✗ Invalid: user domain.com
✗ Invalid: user@@domain.com
✗ Duplicate: existing-user@college.edu
```

#### Password Validation

```
✓ Strong: Pass@123word (8+ chars, uppercase, number, special)
✓ Good: MyPassword123! 
✗ Weak: password (no uppercase/numbers/special)
✗ Weak: Pass123 (no special character)
✗ Short: Pass@12 (< 8 characters)
✗ Mismatch: confirmation doesn't match
```

#### Mobile Number Validation

```
✓ Valid: 9876543210 (Indian format)
✓ Valid: 8765432109
✗ Invalid: 1234567890 (starts with 1)
✗ Invalid: 98765432 (only 8 digits)
✗ Invalid: 9876543210123 (too many digits)
✗ Invalid: 987654321a (contains letters)
```

#### Team Name Validation

```
✓ Valid: Code Warriors
✓ Valid: Team-Alpha
✓ Valid: A1B2C3
✗ Invalid: A (too short)
✗ Invalid: [Special chars only]
✗ Invalid: Super Long Team Name That Exceeds Fifty Characters Total
```

#### Name Validation

```
✓ Valid: John Doe
✓ Valid: Mary Jane Smith
✗ Invalid: John (single name)
✗ Invalid: 123 456 (numbers)
✗ Invalid: J0hn D03 (contains numbers)
```

### Test Execution

1. **Email Field**
   - [ ] Type invalid email → error message appears
   - [ ] Blur field → error persists
   - [ ] Fix error → error disappears
   - [ ] Try duplicate email → duplicate error shows
   - [ ] Mobile: tap outside field → error shows

2. **Password Field**
   - [ ] Type weak password → strength indicator shows
   - [ ] Add uppercase → indicator improves
   - [ ] Add number → indicator improves
   - [ ] Add special char → "Strong" label appears
   - [ ] Clear field → indicator disappears
   - [ ] Mismatch confirm → error on confirm field

3. **Mobile Number**
   - [ ] Type letters → auto-filter to numbers only
   - [ ] Paste number with dashes → auto-format
   - [ ] Blur with 9 digits → error shows
   - [ ] Add 10th digit → error clears

---

## Authentication Testing

### Login Flow

#### Student Login - Valid Credentials

```bash
Email: aarav@college.edu
Password: password123
```

**Test Steps:**
1. [ ] Visit /student-login
2. [ ] Enter credentials
3. [ ] Click "Sign In"
4. [ ] Wait for animation
5. [ ] Redirects to /student/dashboard
6. [ ] User name displays in sidebar
7. [ ] Team info shows correctly
8. [ ] Logout works

#### Student Login - Invalid Credentials

**Test Steps:**
1. [ ] Visit /student-login
2. [ ] Enter wrong email → error message
3. [ ] Enter wrong password → error message
4. [ ] Clear fields → no error
5. [ ] Try submitting empty form → required errors

#### Admin Login

```bash
Email: admin@smarthackathon.com
Password: admin123
```

**Test Steps:**
1. [ ] Visit /admin-login
2. [ ] Enter credentials
3. [ ] Redirects to /admin/dashboard
4. [ ] Admin sidebar displays
5. [ ] All admin sections accessible

### Session Management

- [ ] Session persists on page refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login when not authenticated
- [ ] Correct role redirects (admin vs student)

---

## Form Submission Testing

### Team Leader Registration

**Step 1: Team & Leader Info**
- [ ] All fields required
- [ ] Email uniqueness checked
- [ ] Password strength validated
- [ ] Confirm password must match
- [ ] Error messages clear and helpful

**Step 2: Academic Details**
- [ ] Department dropdown works
- [ ] Year dropdown works
- [ ] Mobile field numeric only
- [ ] Valid mobile required

**Step 3: Team Members**
- [ ] Can add members (up to 4 additional)
- [ ] Can remove members
- [ ] All member fields validated
- [ ] Duplicate emails prevented
- [ ] Form submission works

**After Submission:**
- [ ] Success message shows
- [ ] Redirects to login
- [ ] Team data saved

### Member Registration

**Step 1: Find Team**
- [ ] Search works by team name
- [ ] Search works by leader name
- [ ] Team list updates dynamically
- [ ] Can select team

**Step 2: Registration**
- [ ] All fields required
- [ ] Validations working
- [ ] Team password validated
- [ ] Success on correct password
- [ ] Error on wrong password

---

## Error Handling Testing

### Network Errors

- [ ] Offline mode → error message
- [ ] Slow network → loading spinner
- [ ] Request timeout → retry option
- [ ] Connection restored → retry succeeds

### Validation Errors

- [ ] Form errors prevent submission
- [ ] Error messages specific and helpful
- [ ] Can fix and retry
- [ ] Success after fixing errors

### Server Errors

- [ ] 500 error → friendly message
- [ ] 503 error → retry option
- [ ] 4xx errors → specific message
- [ ] Error boundary catches crashes

### User Feedback

- [ ] Validation errors appear immediately
- [ ] Success messages confirm action
- [ ] Loading states visible
- [ ] Disabled states when loading
- [ ] Toast notifications appear

---

## Dashboard Testing

### Student Dashboard (Leader View)

- [ ] Profile card displays correctly
- [ ] Team info accurate
- [ ] Progress bar shows completion
- [ ] Team member count correct
- [ ] PDF upload works
- [ ] Submission status accurate
- [ ] Project abstracts load
- [ ] Can select project

### Student Dashboard (Member View)

- [ ] Read-only view enforced
- [ ] Cannot select project
- [ ] Info banner shows
- [ ] Can see team's project selection
- [ ] Cannot upload

### Admin Dashboard

- [ ] Statistics load
- [ ] Charts render
- [ ] Team list shows
- [ ] Can access all sections
- [ ] Filters work

---

## Performance Testing

### Page Load Times

```bash
# Using Lighthouse in Chrome DevTools
Target: First Contentful Paint < 1s
Target: Largest Contentful Paint < 2.5s
Target: Total Blocking Time < 100ms
```

**Test Procedure:**
1. [ ] Open DevTools → Lighthouse
2. [ ] Run audit (mobile + desktop)
3. [ ] Record scores
4. [ ] Check metrics
5. [ ] Compare to baseline

### Bundle Size

```bash
npm run build
# Check dist/ size
```

**Target:**
- [ ] Total < 500KB
- [ ] JS bundles < 400KB
- [ ] Gzipped < 150KB

### Memory Usage

- [ ] Heap not growing over time
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] No jank on scroll

---

## Accessibility Testing

### WCAG 2.1 Level AA Compliance

#### Keyboard Navigation
- [ ] All buttons accessible via Tab
- [ ] Focus visible on all elements
- [ ] Enter triggers buttons
- [ ] Space triggers checkboxes
- [ ] Escape closes modals

#### Screen Reader Testing
- [ ] Use NVDA (Windows) or VoiceOver (Mac)
- [ ] Forms announced correctly
- [ ] Labels associated with inputs
- [ ] Errors announced
- [ ] Dynamic content announced

#### Color Contrast
- [ ] Text: 4.5:1 minimum
- [ ] Large text: 3:1 minimum
- [ ] Icons/buttons: 3:1 minimum
- [ ] Not relying on color alone

#### Responsive Design
- [ ] Mobile (320px): readable, usable
- [ ] Tablet (768px): optimal layout
- [ ] Desktop (1024px+): full features
- [ ] No horizontal scroll

---

## Browser Compatibility

### Desktop Browsers

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers

- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet (latest)
- [ ] Firefox Android (latest)

### Minimum Versions

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Test Features

- [ ] Layout responsive
- [ ] Animations smooth
- [ ] Forms functional
- [ ] Touch interactions work
- [ ] No console errors

---

## Automation Testing Scripts

### Run All Checks

```bash
# TypeScript checking
npm run typecheck

# ESLint
npm run lint

# Build
npm run build

# Preview build
npm run preview
```

### Pre-Deployment Verification

```bash
#!/bin/bash
echo "Running TypeScript check..."
npm run typecheck || exit 1

echo "Running linter..."
npm run lint || exit 1

echo "Building for production..."
npm run build || exit 1

echo "✓ All checks passed!"
```

---

## Test Data

### Demo Credentials

**Team Leader:**
```
Email: aarav@college.edu
Password: password123
Team: Team Alpha
Members: 3
```

**Team Member:**
```
Email: priya@college.edu
Password: password123
Team: Team Alpha
```

**Admin:**
```
Email: admin@smarthackathon.com
Password: admin123
```

### Test Scenarios

**Scenario 1: Complete Registration**
1. Register new team
2. Fill all steps
3. Add members
4. Submit
5. Login
6. Select project
7. Upload submission

**Scenario 2: Join as Member**
1. Find team
2. Fill member form
3. Join team
4. Login
5. View team project
6. See dashboard

**Scenario 3: Admin Workflow**
1. Login as admin
2. View teams
3. View submissions
4. Check analytics
5. Export data

---

## Issue Tracking

### Report Template

```
**Title**: [Component] Issue description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected**: What should happen

**Actual**: What actually happened

**Environment**:
- Browser: Chrome 120
- Device: MacBook Pro
- Resolution: 1440x900

**Screenshot**: [attach if possible]
```

---

## Sign-Off Checklist

Before releasing to production:

- [ ] All critical tests passed
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Accessibility compliance verified
- [ ] Browser compatibility confirmed
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Team approval obtained

---

**Last Updated**: July 2026  
**Version**: 1.0.0
