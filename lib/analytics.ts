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
    src: process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://umami.example.com/script.js',
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

// Load Umami analytics script
export function loadUmamiScript(): Promise<void> {
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
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track(eventName, eventData);
  }
}

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
    await loadUmamiScript();
    return;
  }

  // If consent-based mode, check for consent
  if (hasAnalyticsConsent()) {
    console.log('Loading analytics with user consent');
    await loadUmamiScript();
  } else {
    console.log('Analytics consent not given, waiting for user action');
  }
}