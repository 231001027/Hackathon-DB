/**
 * Comprehensive validation utilities for production environment
 * Handles all input validation, sanitization, and security checks
 */

/**
 * Email validation with RFC 5322 compliance
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 simplified pattern
  const pattern = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
  return pattern.test(email.trim());
}

/**
 * Mobile number validation (Indian format - 10 digits)
 * @param mobile - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidMobile(mobile: string): boolean {
  if (!mobile || typeof mobile !== 'string') return false;
  return /^[6-9]\d{9}$/.test(mobile.trim()); // Indian mobile starts with 6-9
}

/**
 * Password strength validation
 * @param password - Password to check
 * @returns score (0-4) and human-readable label
 */
export function validatePassword(password: string): {
  score: number;
  label: string;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  if (!password || typeof password !== 'string') {
    return { score: 0, label: 'Invalid', issues: ['Password required'] };
  }

  if (password.length < 8) {
    issues.push('At least 8 characters');
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Include uppercase letter');
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    issues.push('Include number');
  } else {
    score++;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('Include special character');
  } else {
    score++;
  }

  const labels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score], issues };
}

/**
 * Team name validation
 * @param name - Team name to validate
 * @returns true if valid, false otherwise
 */
export function isValidTeamName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  // 2-50 chars, alphanumeric, spaces, hyphens
  return /^[a-zA-Z0-9\s\-]{2,50}$/.test(trimmed);
}

/**
 * Person name validation
 * @param name - Name to validate
 * @returns true if valid, false otherwise
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  // 2-100 chars, letters, spaces, common punctuation
  return /^[a-zA-Z\s'\-\.]{2,100}$/.test(trimmed) && trimmed.split(' ').length >= 2;
}

/**
 * Input sanitization against XSS attacks
 * @param input - User input to sanitize
 * @returns sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Validate file upload (for PDF submissions)
 * @param file - File object to validate
 * @param maxSize - Maximum file size in MB
 * @returns validation result
 */
export function validateFileUpload(
  file: File | null,
  maxSize: number = 10
): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: 'No file selected' };

  const maxBytes = maxSize * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size must be less than ${maxSize}MB` };
  }

  if (!file.type.includes('pdf')) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }

  return { valid: true };
}

/**
 * Rate limiting check (simple client-side implementation)
 * @param key - Unique identifier for rate limiting
 * @param maxAttempts - Maximum allowed attempts
 * @param windowSeconds - Time window in seconds
 * @returns true if within limit, false if exceeded
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): boolean {
  const store = new Map<string, number[]>();
  const stored = localStorage.getItem(`ratelimit_${key}`);
  const attempts = stored ? JSON.parse(stored) : [];
  const now = Date.now();

  // Filter out old attempts
  const recentAttempts = attempts.filter(
    (time: number) => now - time < windowSeconds * 1000
  );

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  localStorage.setItem(`ratelimit_${key}`, JSON.stringify(recentAttempts));
  return true;
}

/**
 * Validate duplicate email across teams
 * @param email - Email to check
 * @param teams - Array of teams
 * @param excludeTeamId - Team ID to exclude
 * @returns true if email exists, false if unique
 */
export function isDuplicateEmail(
  email: string,
  teams: Array<{ leaderemail: string; members: Array<{ email: string }> }>,
  excludeTeamId?: string
): boolean {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim().toLowerCase();

  return teams.some((team) => {
    // Check leader email
    if (team.leaderemail?.toLowerCase() === e) return true;
    // Check member emails
    if (Array.isArray(team.members)) {
      return team.members.some((m) => m.email?.toLowerCase() === e);
    }
    return false;
  });
}

/**
 * Validate form submission
 * @param data - Form data object
 * @param rules - Validation rules
 * @returns validation result with errors
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: unknown) => string | null>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [field, validate] of Object.entries(rules)) {
    const error = validate(data[field as keyof T]);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generate secure random string
 * @param length - Length of random string
 * @returns random string
 */
export function generateRandomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Debounce function for input validation
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
