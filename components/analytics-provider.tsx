'use client';

import { useEffect } from 'react';
import ConsentBanner from './consent-banner';
import { initializeAnalytics } from '@/lib/analytics';

export default function AnalyticsProvider() {
  useEffect(() => {
    // Initialize analytics on mount
    initializeAnalytics().catch(console.error);
  }, []);

  return <ConsentBanner />;
}