# Design System - Smart Ability Hackathon Portal

Professional design system ensuring consistent branding, visual hierarchy, and user experience.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Components](#components)
6. [Dark Mode](#dark-mode)
7. [Animations](#animations)
8. [Guidelines](#guidelines)

---

## Brand Identity

### Brand Values

- **Inclusive**: Accessible to all users
- **Professional**: Corporate-grade quality
- **Modern**: Contemporary design patterns
- **Trustworthy**: Secure and reliable
- **Efficient**: Fast and responsive

### Brand Voice

- Clear and direct
- Supportive and encouraging
- Jargon-free where possible
- Action-oriented

---

## Color System

### Primary Colors

**Brand Blue** (Primary Action)
```
Light Mode:   #3B82F6 (Tailwind brand-500)
Dark Mode:    #60A5FA (Tailwind brand-400)
```

**Accent Orange** (Secondary)
```
Light Mode:   #F97316 (Tailwind accent-500)
Dark Mode:    #FB923C (Tailwind accent-400)
```

### Semantic Colors

**Success** - Green
```
Light: #10B981  Dark: #34D399
Uses: Confirmations, success messages, valid states
```

**Warning** - Amber
```
Light: #F59E0B  Dark: #FBBF24
Uses: Alerts, warnings, need attention
```

**Error** - Red
```
Light: #EF4444  Dark: #F87171
Uses: Errors, destructive actions, invalid states
```

**Info** - Blue
```
Light: #3B82F6  Dark: #60A5FA
Uses: Information, tips, additional context
```

### Neutral Colors (Light Mode)

```
Background:     #F8FAFC (slate-50)
Surface:        #FFFFFF (white)
Surface Alt:    #F1F5F9 (slate-100)
Border:         #E2E8F0 (slate-200)
Text Primary:   #1E293B (slate-900)
Text Secondary: #64748B (slate-500)
Text Muted:     #94A3B8 (slate-400)
```

### Neutral Colors (Dark Mode)

```
Background:     #0F172A (slate-950)
Surface:        #1E293B (slate-900)
Surface Alt:    #334155 (slate-800)
Border:         #475569 (slate-700)
Text Primary:   #F1F5F9 (slate-100)
Text Secondary: #CBD5E1 (slate-300)
Text Muted:     #94A3B8 (slate-400)
```

### Usage Guidelines

- **Backgrounds**: Use neutral palette
- **Text**: High contrast with background
- **Interactive**: Primary blue, hover/focus states
- **Status**: Semantic colors (green/amber/red)
- **Accents**: Use sparingly for emphasis

---

## Typography

### Font Stack

```css
/* Display/Headlines */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Body Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (if needed) */
font-family: 'Fira Code', monospace;
```

### Type Scale

| Usage | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Display (H1) | 32px-48px | 700 | 1.2 |
| Heading (H2) | 24px-32px | 700 | 1.3 |
| Heading (H3) | 18px-20px | 600 | 1.4 |
| Body Large | 16px | 400 | 1.6 |
| Body Regular | 14px | 400 | 1.6 |
| Body Small | 12px | 400 | 1.5 |
| Caption | 11px | 400 | 1.4 |

### Examples

```typescript
// Heading 1 (Page Title)
<h1 className="font-display text-4xl font-bold leading-tight">
  Register Your Team
</h1>

// Heading 2 (Section Title)
<h2 className="font-display text-2xl font-bold leading-tight">
  Team Information
</h2>

// Heading 3 (Subsection)
<h3 className="font-display text-lg font-semibold leading-normal">
  Team Members
</h3>

// Body Text
<p className="text-sm text-slate-600">
  Complete all fields to register your team
</p>

// Small/Caption
<p className="text-xs text-slate-500">
  Last updated 2 hours ago
</p>
```

---

## Spacing System

### Base Unit: 4px

```
4px    = 0.25rem (xs)
8px    = 0.5rem  (sm)
12px   = 0.75rem (md)
16px   = 1rem    (base)
24px   = 1.5rem  (lg)
32px   = 2rem    (xl)
48px   = 3rem    (2xl)
64px   = 4rem    (3xl)
```

### Padding

```
Button:     px-4 py-2 (16px × 8px)
Card:       p-6 (24px all sides)
Section:    px-6 py-8 (mobile), px-8 py-12 (desktop)
```

### Margins

```
Between sections:   gap-6 to gap-8 (24-32px)
Between elements:   gap-3 to gap-4 (12-16px)
Between lines:      gap-2 (8px)
```

### Example

```typescript
<div className="space-y-8">
  <div className="glass-card p-6">
    <h2 className="text-2xl font-bold mb-4">Section Title</h2>
    <div className="space-y-3">
      <p>Item 1</p>
      <p>Item 2</p>
    </div>
  </div>
</div>
```

---

## Components

### Button Variants

```typescript
// Primary (CTA)
<button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg">
  Primary
</button>

// Secondary
<button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg">
  Secondary
</button>

// Tertiary (Ghost)
<button className="px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg">
  Tertiary
</button>

// Danger
<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
  Delete
</button>
```

### Input Fields

```typescript
<input
  type="email"
  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
  placeholder="Enter email"
/>
```

### Cards

```typescript
// Standard Card
<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
  <h3 className="font-bold text-slate-900">Card Title</h3>
  <p className="mt-2 text-sm text-slate-600">Card content</p>
</div>

// Glass Card (Elevated)
<div className="glass-card rounded-lg border border-white/20 bg-white/50 p-6">
  Content
</div>
```

### Forms

```typescript
<div className="space-y-5">
  <div>
    <label className="block text-sm font-medium text-slate-900 mb-1">
      Email Address
    </label>
    <input
      type="email"
      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    />
  </div>
  <button className="w-full py-2 bg-brand-600 text-white rounded-lg">
    Submit
  </button>
</div>
```

---

## Dark Mode

### Implementation

```typescript
// Theme context handles dark mode
const { theme, toggleTheme } = useTheme();

// Tailwind dark: prefix
<div className="bg-white dark:bg-slate-900">
  <h1 className="text-slate-900 dark:text-white">Title</h1>
</div>
```

### Color Adjustments

**Light Mode → Dark Mode**

| Light | Dark |
|-------|------|
| #FFFFFF (bg) | #0F172A (bg) |
| #1E293B (text) | #F1F5F9 (text) |
| #3B82F6 (brand) | #60A5FA (brand) |
| #E2E8F0 (border) | #475569 (border) |

### Dark Mode Guidelines

1. Reduce brightness of background
2. Increase brightness of text
3. Adjust shadows (more prominent in dark)
4. Maintain sufficient contrast
5. Test with dark mode enabled

---

## Animations

### Principles

- **Purposeful**: Animations convey meaning
- **Subtle**: 300-400ms transitions
- **GPU-Accelerated**: Use transform, opacity
- **Accessible**: Respect prefers-reduced-motion

### Transition Times

```typescript
// Quick feedback (interactive)
transition-duration: 150ms

// Standard transitions (UI changes)
transition-duration: 300ms

// Longer animations (page transitions)
transition-duration: 500ms
```

### Easing Functions

```typescript
// Ease-in-out (default, natural)
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)

// Ease-out (faster at start)
transition-timing-function: cubic-bezier(0, 0, 0.2, 1)

// Ease-in (faster at end)
transition-timing-function: cubic-bezier(0.4, 0, 1, 1)
```

### Examples

```typescript
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>

// Hover effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>
```

---

## Guidelines

### DO ✓

- Use consistent spacing (multiples of 4px)
- Maintain visual hierarchy
- Ensure sufficient color contrast
- Use semantic colors for meaning
- Respect user motion preferences
- Test on multiple screen sizes
- Follow accessibility standards

### DON'T ✗

- Use arbitrary spacing values
- Flatten visual hierarchy
- Use color as only indicator
- Create animations > 500ms
- Ignore dark mode
- Use animations on hover on mobile
- Rely on visual design alone

### Responsive Patterns

```typescript
// Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Hide on mobile
<div className="hidden md:block">

// Touch-friendly sizes
<button className="h-12 md:h-10 px-4 py-3 md:py-2">
```

---

## Implementation

### Tailwind Configuration

The design system is implemented via Tailwind CSS with custom theme:

```javascript
theme: {
  extend: {
    colors: {
      'brand': { 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB' },
      'accent': { 400: '#FB923C', 500: '#F97316', 600: '#EA580C' },
    },
    fontFamily: {
      'display': ['Inter', ...],
    },
  }
}
```

### Custom Classes

```css
/* Accessible focus */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2;
}

/* Glass effect */
.glass-card {
  @apply rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm;
}

/* Smooth transitions */
.transition-smooth {
  @apply transition-all duration-300 ease-out;
}
```

---

## Maintenance

- Review design system quarterly
- Update colors based on accessibility testing
- Document new patterns
- Keep components consistent
- Test across browsers and devices

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Ready for Production ✓
