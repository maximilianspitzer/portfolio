'use client';

import { useEffect, useRef, useState } from 'react';
import { trackPortfolioEvent } from '@/lib/analytics';

// Hook for tracking scroll depth
export function useScrollDepthTracking() {
  const [trackedDepths, setTrackedDepths] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;

      const depths = ['25%', '50%', '75%', '100%'] as const;
      const thresholds = [25, 50, 75, 100];

      thresholds.forEach((threshold, index) => {
        const depthKey = depths[index];
        if (scrollPercentage >= threshold && !trackedDepths.has(depthKey)) {
          trackPortfolioEvent.pageScrollDepth(depthKey);
          setTrackedDepths(prev => new Set(prev).add(depthKey));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackedDepths]);
}

// Hook for tracking time spent on page
export function useTimeOnPageTracking(pageName: string) {
  const startTimeRef = useRef<number>(Date.now());
  const reportedRef = useRef<boolean>(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    reportedRef.current = false;

    const handleBeforeUnload = () => {
      if (!reportedRef.current) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackPortfolioEvent.timeOnPage(pageName, timeSpent);
        reportedRef.current = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !reportedRef.current) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackPortfolioEvent.timeOnPage(pageName, timeSpent);
        reportedRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Report time if component unmounts
      if (!reportedRef.current) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackPortfolioEvent.timeOnPage(pageName, timeSpent);
      }
    };
  }, [pageName]);
}

// Hook for tracking section visibility
export function useSectionTracking(sectionName: string) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          startTimeRef.current = Date.now();
          trackPortfolioEvent.sectionView(sectionName, 0); // Initial view
        } else if (!entry.isIntersecting && isVisible && startTimeRef.current) {
          const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
          trackPortfolioEvent.sectionView(sectionName, timeSpent);
          setIsVisible(false);
          startTimeRef.current = null;
        }
      },
      { threshold: 0.3 } // Track when 30% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [sectionName, isVisible]);

  return sectionRef;
}

// Hook for tracking page load performance
export function usePageLoadTracking(routeName: string) {
  useEffect(() => {
    const measurePageLoad = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const loadTime = Math.round(performance.now());
        trackPortfolioEvent.pageLoadTime(loadTime, routeName);
      }
    };

    // Measure after a short delay to ensure page is fully loaded
    const timer = setTimeout(measurePageLoad, 100);
    return () => clearTimeout(timer);
  }, [routeName]);
}

// Hook for tracking external link clicks
export function useExternalLinkTracking() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const url = target.href;
        const isExternal = !url.startsWith(window.location.origin) && 
                          (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:'));
        
        if (isExternal) {
          const context = target.closest('section')?.id || 
                         target.closest('[data-section]')?.getAttribute('data-section') || 
                         'unknown';
          trackPortfolioEvent.externalLinkClick(url, context);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}