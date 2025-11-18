/**
 * Application Configuration
 * Centralizes all environment variables and configuration
 */

const getEnv = (key: string, defaultValue = ''): string => {
  return import.meta.env[key] || defaultValue;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? Number(value) : defaultValue;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

export const config = {
  // App
  app: {
    name: getEnv('VITE_APP_NAME', 'EssayBridge'),
    version: getEnv('VITE_APP_VERSION', '1.0.0'),
    env: getEnv('VITE_APP_ENV', 'development'),
  },

  // API
  api: {
    baseURL: getEnv('VITE_API_BASE_URL', 'http://localhost:3001/api'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
    version: getEnv('VITE_API_VERSION', 'v1'),
  },

  // Auth
  auth: {
    tokenKey: getEnv('VITE_AUTH_TOKEN_KEY', 'essaybridge_token'),
    refreshTokenKey: getEnv('VITE_AUTH_REFRESH_TOKEN_KEY', 'essaybridge_refresh_token'),
    tokenExpiry: getEnvNumber('VITE_AUTH_TOKEN_EXPIRY', 7200000), // 2 hours
    sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT', 3600000), // 1 hour
  },

  // File Upload
  upload: {
    maxSize: getEnvNumber('VITE_UPLOAD_MAX_SIZE', 10485760), // 10MB
    allowedTypes: getEnv('VITE_UPLOAD_ALLOWED_TYPES', '.pdf,.doc,.docx,.hwp,.txt').split(','),
    endpoint: getEnv('VITE_UPLOAD_ENDPOINT', '/uploads'),
  },

  // Payment
  payment: {
    provider: getEnv('VITE_PAYMENT_PROVIDER', 'toss'),
    toss: {
      clientKey: getEnv('VITE_TOSS_CLIENT_KEY'),
      secretKey: getEnv('VITE_TOSS_SECRET_KEY'),
      successUrl: getEnv('VITE_TOSS_SUCCESS_URL', '/payment/success'),
      failUrl: getEnv('VITE_TOSS_FAIL_URL', '/payment/fail'),
    },
  },

  // Storage
  storage: {
    provider: getEnv('VITE_STORAGE_PROVIDER', 's3'),
    s3: {
      bucket: getEnv('VITE_S3_BUCKET'),
      region: getEnv('VITE_S3_REGION', 'ap-northeast-2'),
    },
    cdnUrl: getEnv('VITE_CDN_URL'),
  },

  // Analytics
  analytics: {
    gaTrackingId: getEnv('VITE_GA_TRACKING_ID'),
    hotjarId: getEnv('VITE_HOTJAR_ID'),
    sentryDsn: getEnv('VITE_SENTRY_DSN'),
  },

  // Feature Flags
  features: {
    analytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', true),
    errorReporting: getEnvBoolean('VITE_ENABLE_ERROR_REPORTING', true),
    chatSupport: getEnvBoolean('VITE_ENABLE_CHAT_SUPPORT', false),
    maintenanceMode: getEnvBoolean('VITE_MAINTENANCE_MODE', false),
  },

  // Site URLs
  site: {
    url: getEnv('VITE_SITE_URL', 'https://essaybridge.com'),
    termsUrl: getEnv('VITE_TERMS_URL', '/terms'),
    privacyUrl: getEnv('VITE_PRIVACY_URL', '/privacy'),
    helpCenterUrl: getEnv('VITE_HELP_CENTER_URL', '/help'),
  },

  // Email
  email: {
    provider: getEnv('VITE_EMAIL_SERVICE_PROVIDER', 'sendgrid'),
    supportEmail: getEnv('VITE_SUPPORT_EMAIL', 'support@essaybridge.com'),
  },
} as const;

// Validation
if (config.app.env === 'production') {
  if (!config.api.baseURL || config.api.baseURL.includes('localhost')) {
    console.warn('⚠️  Production mode but API_BASE_URL points to localhost');
  }

  if (!config.payment.toss.clientKey || config.payment.toss.clientKey.includes('test_')) {
    console.warn('⚠️  Production mode but using test payment credentials');
  }
}

export default config;
