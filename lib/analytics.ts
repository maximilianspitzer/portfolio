'use client';

// Analytics configuration and utility functions
export interface AnalyticsConfig {
  websiteId: string;
  src: string;
  enabled: boolean;
  cookieless: boolean;
}

// Get analytics configuration from environment variables
export function getAnalyticsConfig(): AnalyticsConfig {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
  const cookieless = process.env.NEXT_PUBLIC_UMAMI_COOKIELESS === 'true';

  return {
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '',
    src:
      process.env.NEXT_PUBLIC_UMAMI_SRC ||
      'https://umami.example.com/script.js',
    enabled,
    cookieless,
  };
}

// Check if analytics is enabled
export function isAnalyticsEnabled(): boolean {
  return getAnalyticsConfig().enabled;
}

// Check if cookieless mode is enabled
export function isCookielessMode(): boolean {
  return getAnalyticsConfig().cookieless;
}

// Umami Analytics Integration
// https://umami.is/docs/tracker-functions

// Type definition for Umami
interface UmamiTracker {
  track: (eventName: string, eventData?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

// Load Umami analytics script
export function loadUmami(): Promise<void> {
  return new Promise((resolve, reject) => {
    const config = getAnalyticsConfig();

    if (!config.enabled || !config.websiteId || !config.src) {
      console.warn('Umami analytics not properly configured');
      resolve();
      return;
    }

    // Check if script is already loaded
    if (document.querySelector(`script[src="${config.src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = config.src;
    script.setAttribute('data-website-id', config.websiteId);

    // Add additional attributes for cookieless mode
    if (config.cookieless) {
      script.setAttribute('data-do-not-track', 'true');
      script.setAttribute('data-cache', 'true');
    }

    script.onload = () => {
      console.log('Umami analytics loaded successfully');
      resolve();
    };

    script.onerror = () => {
      console.error('Failed to load Umami analytics');
      reject(new Error('Failed to load Umami analytics'));
    };

    document.head.appendChild(script);
  });
}

// Track custom events (optional)
export function trackEvent(
  eventName: string,
  eventData?: Record<string, unknown>
): void {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

// Enhanced event tracking functions for portfolio
export const trackPortfolioEvent = {
  // Navigation events
  languageChange: (language: string) => {
    trackEvent('Language Change', { language });
  },

  navigationClick: (section: string) => {
    trackEvent('Navigation Click', { section });
  },

  // Hero section events
  heroCtaClick: (cta: string) => {
    trackEvent('Hero CTA Click', { cta });
  },

  // Work/Project events
  projectModalOpen: (projectId: string, projectTitle: string) => {
    trackEvent('Project Modal Open', { projectId, projectTitle });
  },

  projectModalClose: (projectId: string, projectTitle: string) => {
    trackEvent('Project Modal Close', { projectId, projectTitle });
  },

  projectLinkClick: (
    projectId: string,
    linkType: 'live' | 'github',
    url: string
  ) => {
    trackEvent('Project Link Click', { projectId, linkType, url });
  },

  // Contact events
  contactMethodClick: (method: 'email' | 'phone' | 'social', value: string) => {
    trackEvent('Contact Method Click', { method, value });
  },

  // Social media events
  socialLinkClick: (
    platform: string,
    url: string,
    location: 'header' | 'footer' | 'about'
  ) => {
    trackEvent('Social Link Click', { platform, url, location });
  },

  // Legal pages
  legalPageView: (page: 'impressum' | 'datenschutz') => {
    trackEvent('Legal Page View', { page });
  },

  // Scroll depth (simplified)
  pageScrollDepth: (depth: '50%' | '100%') => {
    trackEvent('Page Scroll Depth', { depth });
  },

  // Simple section tracking (no time data)
  sectionView: (section: string) => {
    trackEvent('Section Viewed', { section });
  },

  // Skip to content accessibility
  skipToContentUsed: () => {
    trackEvent('Skip to Content Used');
  },

  // Error events
  error404: (path: string, referrer: string) => {
    trackEvent('404 Error', { path, referrer });
  },

  // Cookie consent events
  cookieConsentAccepted: () => {
    trackEvent('Cookie Consent Accepted');
  },

  cookieConsentDeclined: () => {
    trackEvent('Cookie Consent Declined');
  },

  // External link tracking
  externalLinkClick: (url: string, context: string) => {
    trackEvent('External Link Click', { url, context });
  },

  // Custom event tracking for responsive system
  custom: (eventName: string, properties: Record<string, unknown>) => {
    trackEvent(eventName, properties);
  },
};

// Analytics consent management
const CONSENT_KEY = 'umami_consent';

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) === 'true';
}

export function setAnalyticsConsent(consent: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, consent.toString());
}

export function clearAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
}

export function loadUmamiScript(): Promise<void> {
  return loadUmami();
}

// Initialize analytics based on configuration and consent
export async function initializeAnalytics(): Promise<void> {
  const config = getAnalyticsConfig();

  if (!config.enabled) {
    console.log('Analytics disabled via environment variable');
    return;
  }

  // If cookieless mode, load immediately
  if (config.cookieless) {
    console.log('Loading analytics in cookieless mode');
    await loadUmami();
    return;
  }

  // If consent-based mode, check for consent
  if (hasAnalyticsConsent()) {
    console.log('Loading analytics with user consent');
    await loadUmami();
  } else {
    console.log('Analytics consent not given, waiting for user action');
  }
}
