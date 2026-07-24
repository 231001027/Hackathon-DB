/**
 * Environment Configuration
 * Centralized configuration management for different deployment environments
 * Supports: development, staging, production
 */

type Environment = 'development' | 'staging' | 'production';

const getEnvironment = (): Environment => {
  const env = import.meta.env.MODE as Environment;
  return ['development', 'staging', 'production'].includes(env)
    ? env
    : 'development';
};

/**
 * Base configuration object with environment-specific values
 */
const baseConfig = {
  // App Info
  appName: 'Smart Ability Hackathon',
  appVersion: '1.0.0',
  appUrl: 'https://hackathon.college.edu',

  // Feature Flags
  features: {
    emailVerification: false, // Enable when email service is set up
    passwordReset: false, // Enable when email service is set up
    socialAuth: false, // Enable when OAuth is configured
    advancedAnalytics: true, // Admin analytics
    teamChat: false, // Enable when backend is ready
  },

  // Limits & Constraints
  limits: {
    maxTeamMembers: 5,
    maxTeamNameLength: 50,
    minPasswordLength: 8,
    maxFileSizeMB: 10,
    maxRegistrationAttempts: 5,
    registrationAttemptWindow: 3600, // seconds
  },

  // UI/UX
  ui: {
    enableDarkMode: true,
    enableAnimations: true,
    toastDuration: 4000, // milliseconds
    pageTransitionDuration: 0.3, // seconds
  },

  // Security
  security: {
    enableRateLimit: true,
    enableCSP: true,
    enableXFrameOptions: true,
    enableXContentTypeOptions: true,
    csrfProtection: true,
  },

  // Logging
  logging: {
    enableConsoleLog: true,
    enableRemoteLog: false,
    logLevel: 'warn' as const, // 'error' | 'warn' | 'info' | 'debug'
  },

  // Cache
  cache: {
    enableCache: true,
    cacheDuration: 3600, // seconds
  },
};

/**
 * Environment-specific configuration overrides
 */
const envConfig = {
  development: {
    appUrl: 'http://localhost:5174',
    logging: {
      enableConsoleLog: true,
      enableRemoteLog: false,
      logLevel: 'debug' as const,
    },
    security: {
      enableRateLimit: false,
      enableCSP: false,
      enableXFrameOptions: false,
      enableXContentTypeOptions: false,
      csrfProtection: false,
    },
  },

  staging: {
    appUrl: 'https://staging-hackathon.college.edu',
    logging: {
      enableConsoleLog: false,
      enableRemoteLog: true,
      logLevel: 'info' as const,
    },
    security: {
      enableRateLimit: true,
      enableCSP: true,
      enableXFrameOptions: true,
      enableXContentTypeOptions: true,
      csrfProtection: true,
    },
  },

  production: {
    appUrl: 'https://hackathon.college.edu',
    features: {
      emailVerification: true,
      passwordReset: true,
      socialAuth: false,
      advancedAnalytics: true,
      teamChat: false,
    },
    logging: {
      enableConsoleLog: false,
      enableRemoteLog: true,
      logLevel: 'error' as const,
    },
    security: {
      enableRateLimit: true,
      enableCSP: true,
      enableXFrameOptions: true,
      enableXContentTypeOptions: true,
      csrfProtection: true,
    },
    cache: {
      enableCache: true,
      cacheDuration: 7200,
    },
  },
};

/**
 * Get current environment config merged with base config
 */
function getConfig() {
  const env = getEnvironment();
  return {
    ...baseConfig,
    ...(envConfig[env] || {}),
    environment: env,
  };
}

/**
 * Export configuration
 */
export const config = getConfig();

/**
 * Check if running in development
 */
export const isDevelopment = () => getEnvironment() === 'development';

/**
 * Check if running in production
 */
export const isProduction = () => getEnvironment() === 'production';

/**
 * Check if running in staging
 */
export const isStaging = () => getEnvironment() === 'staging';

/**
 * Export environment for reference
 */
export const environment = getEnvironment();
