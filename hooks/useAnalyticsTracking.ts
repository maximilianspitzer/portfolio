'use client';

import { useEffect, useRef, useState } from 'react';
import { trackPortfolioEvent } from '@/lib/analytics';

// Hook for tracking scroll depth (simplified to meaningful milestones)
export function useScrollDepthTracking() {
  const [trackedDepths, setTrackedDepths] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;

      // Only track meaningful milestones
      const depths = ['50%', '100%'] as const;
      const thresholds = [50, 95]; // 95% instead of 100% for better accuracy

      thresholds.forEach((threshold, index) => {
        const depthKey = depths[index];
        if (scrollPercentage >= threshold && !trackedDepths.has(depthKey)) {
          trackPortfolioEvent.pageScrollDepth(depthKey);
          setTrackedDepths((prev) => new Set(prev).add(depthKey));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackedDepths]);
}

// Hook for tracking section visibility (simplified)
export function useSectionTracking(sectionName: string) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only track once when section becomes visible for the first time
        if (entry.isIntersecting && !hasBeenViewed) {
          setHasBeenViewed(true);
          trackPortfolioEvent.sectionView(sectionName);
        }
      },
      { threshold: 0.5 } // Track when 50% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [sectionName, hasBeenViewed]);

  return sectionRef;
}

// Hook for tracking external link clicks
export function useExternalLinkTracking() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const url = target.href;
        const isExternal =
          !url.startsWith(window.location.origin) &&
          (url.startsWith('http') ||
            url.startsWith('mailto:') ||
            url.startsWith('tel:'));

        if (isExternal) {
          const context =
            target.closest('section')?.id ||
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
