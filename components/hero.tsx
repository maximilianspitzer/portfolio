'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { trackPortfolioEvent } from '@/lib/analytics';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';
import { useResponsive } from '@/hooks/useResponsive';
import ParticlesBackground from '@/components/particles-background';
import { prefersReducedMotion, isLowPoweredDevice } from '@/lib/responsive-utils';

export default function Hero() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('hero');
  const { currentBreakpoint, viewportWidth, deviceInfo } = useResponsive();
  const { isMobile, hasTouch } = deviceInfo;
  
  // Performance optimization flags
  const shouldReduceMotion = prefersReducedMotion();
  const isLowPowered = isLowPoweredDevice();
  const shouldOptimizeParticles = isMobile || isLowPowered;
  
  // Track responsive events
  const trackMobileInteraction = (action: string, element: string) => {
    if (isMobile) {
      trackPortfolioEvent.custom('mobile_hero_interaction', {
        action,
        element,
        breakpoint: currentBreakpoint,
        viewport_width: viewportWidth,
        has_touch: hasTouch,
        timestamp: Date.now(),
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrimaryCTA = () => {
    trackMobileInteraction('cta_click', 'primary_button');
    scrollToSection('work');
    trackPortfolioEvent.heroCtaClick('view_work');
  };

  const handleSecondaryCTA = () => {
    trackMobileInteraction('cta_click', 'secondary_button');
    scrollToSection('contact');
    trackPortfolioEvent.heroCtaClick('contact');
  };
  
  // Dynamic button classes for responsive touch targets
  const buttonBaseClasses = "px-6 sm:px-8 font-medium rounded-md transition-all duration-200 hover:scale-105 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground";
  const touchFriendlyClasses = hasTouch ? "min-h-[48px] py-3" : "py-3";
  
  const primaryButtonClasses = `${buttonBaseClasses} ${touchFriendlyClasses} bg-foreground text-background hover:bg-foreground/90 focus:bg-foreground/90`;
  const secondaryButtonClasses = `${buttonBaseClasses} ${touchFriendlyClasses} border border-border text-foreground hover:bg-accent focus:bg-accent`;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Particles Background Layer - Optimized for mobile performance */}
      <ParticlesBackground 
        reducedMotion={shouldReduceMotion}
        className={shouldOptimizeParticles ? "opacity-75" : ""}
      />

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 text-center pointer-events-none">
        <div className="max-w-4xl mx-auto">
          {/* Responsive typography using clamp() functions for fluid scaling */}
          <h1 
            className="font-bold text-foreground mb-6 animate-fade-in"
            style={{
              fontSize: 'clamp(2rem, 8vw, 4.5rem)', // 32px to 72px fluid scaling
              lineHeight: 'clamp(1.1, 1.2, 1.25)',
            }}
          >
            {dictionary.hero.headline}
          </h1>

          <p 
            className="text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delay"
            style={{
              fontSize: 'clamp(1rem, 3vw, 1.25rem)', // 16px to 20px fluid scaling
              lineHeight: 'clamp(1.4, 1.5, 1.6)',
            }}
          >
            {dictionary.hero.subhead}
          </p>

          {/* Mobile-optimized CTA buttons with touch-friendly sizing */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button
              onClick={handlePrimaryCTA}
              className={primaryButtonClasses}
              aria-label={`${dictionary.hero.cta_primary} - View portfolio work`}
            >
              {dictionary.hero.cta_primary}
            </button>

            <button
              onClick={handleSecondaryCTA}
              className={secondaryButtonClasses}
              aria-label={`${dictionary.hero.cta_secondary} - Contact information`}
            >
              {dictionary.hero.cta_secondary}
            </button>
          </div>
        </div>
      </div>
      {/* Responsive fade overlay - adjusts height based on screen size */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-40"
        style={{
          height: `clamp(8rem, 15vh, 12rem)`, // Responsive height: 128px to 192px
          background: `linear-gradient(to top, 
            var(--muted) 0%,
            rgba(10, 10, 10, 0.9) 25%,
            rgba(5, 5, 5, 0.6) 50%,
            rgba(2, 2, 2, 0.3) 75%,
            transparent 100%)`,
        }}
      />
    </section>
  );
}

// Add performance monitoring for mobile devices
if (typeof window !== 'undefined' && 'performance' in window) {
  // Monitor for layout shifts on mobile
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as PerformanceEntry & {
          hadRecentInput?: boolean;
          value?: number;
        };
        
        if (!layoutShiftEntry.hadRecentInput) {
          trackPortfolioEvent.custom('hero_layout_shift', {
            value: layoutShiftEntry.value || 0,
            viewport_width: window.innerWidth,
            is_mobile: window.innerWidth < 768,
            timestamp: Date.now(),
          });
        }
      }
    }
  });
  
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch {
      // Layout shift observation may not be supported
      console.debug('Layout shift observation not supported');
    }
  }
}
