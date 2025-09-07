'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  isAnalyticsEnabled,
  isCookielessMode,
  hasAnalyticsConsent,
  setAnalyticsConsent,
  loadUmamiScript,
} from '@/lib/analytics';
import { trackPortfolioEvent } from '@/lib/analytics';

export default function ConsentBanner() {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    de: {
      message:
        'Diese Website verwendet Umami Analytics, um die Nutzung zu analysieren und zu verbessern. Es werden keine personenbezogenen Daten gespeichert.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen',
      privacy: 'Datenschutz',
    },
    en: {
      message:
        'This website uses Umami Analytics to analyze and improve usage. No personal data is stored.',
      accept: 'Accept',
      decline: 'Decline',
      privacy: 'Privacy',
    },
  };

  const bannerContent = content[language];

  useEffect(() => {
    // Only show banner if analytics is enabled, not in cookieless mode, and consent not given
    const shouldShow =
      isAnalyticsEnabled() && !isCookielessMode() && !hasAnalyticsConsent();
    setShowBanner(shouldShow);
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    setAnalyticsConsent(true);

    // Track consent decision
    trackPortfolioEvent.cookieConsentAccepted();

    try {
      await loadUmamiScript();
      console.log('Analytics enabled with user consent');
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }

    setIsLoading(false);
    setShowBanner(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);

    // Track consent decision
    trackPortfolioEvent.cookieConsentDeclined();

    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {bannerContent.message}{' '}
              <Link
                href="/datenschutz"
                className="text-foreground hover:underline"
              >
                {bannerContent.privacy}
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border border-border text-foreground rounded-md hover:bg-accent transition-colors"
              disabled={isLoading}
            >
              {bannerContent.decline}
            </button>

            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                bannerContent.accept
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
