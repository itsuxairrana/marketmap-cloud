// SEO Constants
export const SITE_NAME = 'MarketMap';
export const SITE_URL = 'https://marketmap.cloud';
export const SITE_DESCRIPTION = 'Find where your startup customers actually hang out. See real CAC data, hidden platforms, and budget allocation.';

export const SEO_METADATA = {
  title: 'MarketMap - Find Where Your Customers Hang Out',
  description: SITE_DESCRIPTION,
  keywords: [
    'startup marketing channels',
    'CAC calculator',
    'marketing budget allocation',
    'startup marketing strategy',
    'SaaS marketing',
    'DTC marketing',
    'marketing spend allocation'
  ],
  authors: [{ name: 'MarketMap' }],
};

export const OG_IMAGE = `${SITE_URL}/og-image.png`;

// App Constants
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Budget limits
export const MIN_BUDGET = 0;
export const MAX_BUDGET = 100000;
export const DEFAULT_BUDGET = 10000;

// Archetype categories
export const ARCHETYPES = {
  b2b_saas: 'B2B SaaS',
  dtc_ecommerce: 'DTC E-commerce',
  indie_hackers: 'Indie Hackers',
  agency_service: 'Agency/Service Business'
};

// Colors
export const COLORS = {
  primary: '#0066cc',
  secondary: '#f59e0b',
  accent: '#10b981',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  light: '#f3f4f6',
  dark: '#1f2937',
};

// API Endpoints
export const API_ROUTES = {
  budget: '/api/budget',
  analytics: '/api/analytics',
  email: '/api/email',
};

// Feature flags
export const FEATURES = {
  emailCapture: true,
  pdfDownload: true,
  analyticsTracking: true,
  supabaseLogging: false, // Phase 1+
  premiumTier: false, // Phase 2+
};
