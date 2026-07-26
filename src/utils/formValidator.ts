/**
 * Form Validation Utilities
 * Centralized form validation with comprehensive error messages
 * Used across all registration, login, and data entry forms
 */

import {
  isValidEmail,
  isValidMobile,
  isValidTeamName,
  isValidName,
  validatePassword,
} from './validation';

/**
 * Error message templates for common validation issues
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_DUPLICATE: 'This email is already registered',
  MOBILE_INVALID: 'Please enter a valid 10-digit mobile number',
  PASSWORD_SHORT: 'Password must be at least 8 characters',
  PASSWORD_WEAK: 'Password is too weak. Include uppercase, number, and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  NAME_INVALID: 'Please enter a valid name (minimum 2 words)',
  TEAM_NAME_INVALID: 'Team name must be 2-50 characters (alphanumeric, spaces, hyphens)',
  DEPARTMENT_REQUIRED: 'Please select a department',
  YEAR_REQUIRED: 'Please select your year',
  TEAM_REQUIRED: 'Please select a team',
  FILE_REQUIRED: 'Please select a file to upload',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  FILE_INVALID_TYPE: 'Only PDF files are allowed',
  DUPLICATE_EMAIL_TEAM: 'This email is already registered in your team',
  MIN_MEMBERS: 'At least one additional member is required',
  MAX_MEMBERS: 'You have reached the maximum number of team members',
};

/**
 * Validator functions for common fields
 */
export const fieldValidators = {
  /**
   * Validate email field
   */
  email: (value: string, options?: { checkDuplicate?: (email: string) => boolean }): string | null => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.REQUIRED;
    }
    if (!isValidEmail(value)) {
      return ERROR_MESSAGES.EMAIL_INVALID;
    }
    if (options?.checkDuplicate && options.checkDuplicate(value)) {
      return ERROR_MESSAGES.EMAIL_DUPLICATE;
    }
    return null;
  },

  /**
   * Validate password field
   */
  password: (value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGES.REQUIRED;
    }
    if (value.length < 8) {
      return ERROR_MESSAGES.PASSWORD_SHORT;
    }
    const validation = validatePassword(value);
    if (validation.score < 2) {
      return ERROR_MESSAGES.PASSWORD_WEAK;
    }
    return null;
  },

  /**
   * Validate password confirmation
   */
  confirmPassword: (value: string, passwordValue: string): string | null => {
    if (!value) {
      return ERROR_MESSAGES.REQUIRED;
    }
    if (value !== passwordValue) {
      return ERROR_MESSAGES.PASSWORD_MISMATCH;
    }
    return null;
  },

  /**
   * Validate name field
   */
  name: (value: string): string | null => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.REQUIRED;
    }
    if (!isValidName(value)) {
      return ERROR_MESSAGES.NAME_INVALID;
    }
    return null;
  },

  /**
   * Validate team name field
   */
  teamName: (value: string): string | null => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.REQUIRED;
    }
    if (!isValidTeamName(value)) {
      return ERROR_MESSAGES.TEAM_NAME_INVALID;
    }
    return null;
  },

  /**
   * Validate mobile number
   */
  mobile: (value: string): string | null => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.REQUIRED;
    }
    if (!isValidMobile(value)) {
      return ERROR_MESSAGES.MOBILE_INVALID;
    }
    return null;
  },

  /**
   * Validate dropdown selection
   */
  select: (value: string, fieldName: string): string | null => {
    if (!value || value === '') {
      return `Please select a ${fieldName}`;
    }
    return null;
  },

  /**
   * Validate file upload
   */
  file: (file: File | null): string | null => {
    if (!file) {
      return ERROR_MESSAGES.FILE_REQUIRED;
    }
    if (file.size > 10 * 1024 * 1024) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }
    if (!file.type.includes('pdf')) {
      return ERROR_MESSAGES.FILE_INVALID_TYPE;
    }
    return null;
  },
};

/**
 * Form validation schema builder
 */
export interface ValidationRule {
  field: string;
  validate: (value: unknown, context?: Record<string, unknown>) => string | null;
}

/**
 * Validate entire form against rules
 */
export function validateForm(
  data: Record<string, unknown>,
  rules: ValidationRule[]
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const rule of rules) {
    const error = rule.validate(data[rule.field], data);
    if (error) {
      errors[rule.field] = error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Login form validation
 */
export function validateLoginForm(email: string, password: string): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!email?.trim()) {
    errors.email = ERROR_MESSAGES.REQUIRED;
  } else if (!isValidEmail(email)) {
    errors.email = ERROR_MESSAGES.EMAIL_INVALID;
  }

  if (!password) {
    errors.password = ERROR_MESSAGES.REQUIRED;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Team registration (step 1) validation
 */
export function validateTeamRegistrationStep1(data: {
  teamName: string;
  leaderName: string;
  leaderemail: string;
  password: string;
  confirmPassword: string;
  isDuplicate?: (email: string) => boolean;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const teamNameError = fieldValidators.teamName(data.teamName);
  if (teamNameError) errors.teamName = teamNameError;

  const nameError = fieldValidators.name(data.leaderName);
  if (nameError) errors.leaderName = nameError;

  const emailError = fieldValidators.email(data.leaderemail, {
    checkDuplicate: data.isDuplicate,
  });
  if (emailError) errors.leaderemail = emailError;

  const passwordError = fieldValidators.password(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = fieldValidators.confirmPassword(data.confirmPassword, data.password);
  if (confirmError) errors.confirmPassword = confirmError;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Team registration (step 2) validation
 */
export function validateTeamRegistrationStep2(data: {
  department: string;
  year: string;
  mobile: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.department) {
    errors.department = ERROR_MESSAGES.DEPARTMENT_REQUIRED;
  }

  if (!data.year) {
    errors.year = ERROR_MESSAGES.YEAR_REQUIRED;
  }

  const mobileError = fieldValidators.mobile(data.mobile);
  if (mobileError) errors.mobile = mobileError;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Team members validation
 */
export function validateTeamMembers(members: Array<{
  name: string;
  email: string;
  department: string;
  year: string;
}>, existingEmails: string[] = []): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const emailSet = new Set<string>();

  members.forEach((member, idx) => {
    // Skip empty members
    if (!member.name?.trim() && !member.email?.trim() && !member.department && !member.year) {
      return;
    }

    const prefix = `member_${idx}`;

    // Validate name
    if (!member.name?.trim()) {
      errors[`${prefix}_name`] = ERROR_MESSAGES.REQUIRED;
    } else if (!isValidName(member.name)) {
      errors[`${prefix}_name`] = ERROR_MESSAGES.NAME_INVALID;
    }

    // Validate email
    if (!member.email?.trim()) {
      errors[`${prefix}_email`] = ERROR_MESSAGES.REQUIRED;
    } else if (!isValidEmail(member.email)) {
      errors[`${prefix}_email`] = ERROR_MESSAGES.EMAIL_INVALID;
    } else {
      const lowerEmail = member.email.trim().toLowerCase();
      if (emailSet.has(lowerEmail)) {
        errors[`${prefix}_email`] = ERROR_MESSAGES.DUPLICATE_EMAIL_TEAM;
      } else if (existingEmails.includes(lowerEmail)) {
        errors[`${prefix}_email`] = ERROR_MESSAGES.EMAIL_DUPLICATE;
      }
      emailSet.add(lowerEmail);
    }

    // Validate department
    if (!member.department) {
      errors[`${prefix}_department`] = ERROR_MESSAGES.DEPARTMENT_REQUIRED;
    }

    // Validate year
    if (!member.year) {
      errors[`${prefix}_year`] = ERROR_MESSAGES.YEAR_REQUIRED;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Member registration validation
 */
export function validateMemberRegistration(data: {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  teamPassword: string;
  isDuplicate?: (email: string) => boolean;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const nameError = fieldValidators.name(data.name);
  if (nameError) errors.name = nameError;

  const emailError = fieldValidators.email(data.email, {
    checkDuplicate: data.isDuplicate,
  });
  if (emailError) errors.email = emailError;

  const mobileError = fieldValidators.mobile(data.phone);
  if (mobileError) errors.phone = mobileError;

  if (!data.department) {
    errors.department = ERROR_MESSAGES.DEPARTMENT_REQUIRED;
  }

  if (!data.year) {
    errors.year = ERROR_MESSAGES.YEAR_REQUIRED;
  }

  if (!data.teamPassword?.trim()) {
    errors.teamPassword = ERROR_MESSAGES.REQUIRED;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
