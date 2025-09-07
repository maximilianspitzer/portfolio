/**
 * Hero Component - Responsive Integration Tests
 * 
 * Tests the responsive enhancements added to the Hero component for Task 5
 * Focuses specifically on mobile optimization, touch targets, and performance
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Hero from '@/components/hero';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { trackPortfolioEvent } from '@/lib/analytics';
import * as ResponsiveHooks from '@/hooks/useResponsive';
import * as ResponsiveUtils from '@/lib/responsive-utils';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    heroCtaClick: vi.fn(),
    custom: vi.fn(),
  },
}));

// Mock responsive hooks
const mockResponsiveState = {
  currentBreakpoint: 'lg' as const,
  viewportWidth: 1024,
  viewportHeight: 768,
  deviceInfo: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    orientation: 'landscape' as const,
    pixelRatio: 1,
    supportsHover: true,
  },
  isWithinBreakpoint: vi.fn(),
  isAtLeastBreakpoint: vi.fn(),
  isAtMostBreakpoint: vi.fn(),
};

vi.mock('@/hooks/useResponsive', () => ({
  useResponsive: vi.fn(() => mockResponsiveState),
}));

// Mock responsive utilities
vi.mock('@/lib/responsive-utils', () => ({
  prefersReducedMotion: vi.fn(() => false),
  isLowPoweredDevice: vi.fn(() => false),
}));

// Mock particles background with responsive props
vi.mock('@/components/particles-background', () => ({
  __esModule: true,
  default: function MockParticlesBackground({ 
    reducedMotion, 
    className 
  }: { 
    reducedMotion?: boolean; 
    className?: string; 
  }) {
    return (
      <div 
        data-testid="particles-background" 
        data-reduced-motion={reducedMotion}
        className={className}
      />
    );
  },
}));

// Mock intersection observer
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock scroll behavior
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    {children}
  </LanguageProvider>
);

describe('Hero Component - Responsive Enhancements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Mobile Device Optimization', () => {
    it('should apply mobile optimizations for mobile devices', () => {
      // Set mobile state
      vi.mocked(ResponsiveHooks.useResponsive).mockReturnValue({
        ...mockResponsiveState,
        currentBreakpoint: 'xs',
        viewportWidth: 375,
        deviceInfo: {
          ...mockResponsiveState.deviceInfo,
          isMobile: true,
          isDesktop: false,
          hasTouch: true,
        },
      });

      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Check mobile particle optimization
      const particles = screen.getByTestId('particles-background');
      expect(particles).toHaveClass('opacity-75');
    });

    it('should track mobile interactions when CTA is clicked', () => {
      // Set mobile state
      vi.mocked(ResponsiveHooks.useResponsive).mockReturnValue({
        ...mockResponsiveState,
        currentBreakpoint: 'xs',
        deviceInfo: {
          ...mockResponsiveState.deviceInfo,
          isMobile: true,
          hasTouch: true,
        },
      });

      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const primaryButton = screen.getByRole('button', { name: /Projekte ansehen/i });
      fireEvent.click(primaryButton);

      expect(trackPortfolioEvent.custom).toHaveBeenCalledWith(
        'mobile_hero_interaction',
        expect.objectContaining({
          action: 'cta_click',
          element: 'primary_button',
          breakpoint: 'xs',
          has_touch: true,
        })
      );
    });
  });

  describe('Touch-Friendly Button Sizing', () => {
    it('should apply minimum 48px height for touch devices', () => {
      vi.mocked(ResponsiveHooks.useResponsive).mockReturnValue({
        ...mockResponsiveState,
        deviceInfo: {
          ...mockResponsiveState.deviceInfo,
          hasTouch: true,
        },
      });

      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const primaryButton = screen.getByRole('button', { name: /Projekte ansehen/i });
      const secondaryButton = screen.getByRole('button', { name: /Kontakt/i });

      expect(primaryButton).toHaveClass('min-h-[48px]');
      expect(secondaryButton).toHaveClass('min-h-[48px]');
    });

    it('should not apply touch sizing for non-touch devices', () => {
      vi.mocked(ResponsiveHooks.useResponsive).mockReturnValue({
        ...mockResponsiveState,
        deviceInfo: {
          ...mockResponsiveState.deviceInfo,
          hasTouch: false,
        },
      });

      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const primaryButton = screen.getByRole('button', { name: /Projekte ansehen/i });
      expect(primaryButton).not.toHaveClass('min-h-[48px]');
    });
  });

  describe('Performance Optimizations', () => {
    it('should optimize particles for reduced motion preference', () => {
      vi.mocked(ResponsiveUtils.prefersReducedMotion).mockReturnValue(true);

      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const particles = screen.getByTestId('particles-background');
      expect(particles).toHaveAttribute('data-reduced-motion', 'true');
    });

    it('should optimize particles for low-powered devices', () => {
      vi.mocked(ResponsiveUtils.isLowPoweredDevice).mockReturnValue(true);

      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const particles = screen.getByTestId('particles-background');
      expect(particles).toHaveClass('opacity-75');
    });
  });

  describe('Responsive Typography', () => {
    it('should apply fluid typography scaling with clamp functions', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      const styles = heading.getAttribute('style');
      
      expect(styles).toContain('clamp(2rem, 8vw, 4.5rem)');
      expect(styles).toContain('line-height');

      const paragraph = screen.getByText(/Ich entwickle moderne Webanwendungen/);
      const pStyles = paragraph.getAttribute('style');
      
      expect(pStyles).toContain('clamp(1rem, 3vw, 1.25rem)');
    });
  });

  describe('Accessibility Enhancements', () => {
    it('should provide descriptive ARIA labels for buttons', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const primaryButton = screen.getByRole('button', { name: /View portfolio work/i });
      const secondaryButton = screen.getByRole('button', { name: /Contact information/i });

      expect(primaryButton).toHaveAttribute('aria-label', 
        expect.stringContaining('View portfolio work')
      );
      expect(secondaryButton).toHaveAttribute('aria-label', 
        expect.stringContaining('Contact information')
      );
    });

    it('should have proper focus management for keyboard navigation', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('focus:outline-none');
        expect(button).toHaveClass('focus:ring-2');
        expect(button).toHaveClass('focus:ring-offset-2');
        expect(button).toHaveClass('focus:ring-foreground');
      });
    });
  });

  describe('Responsive Layout Structure', () => {
    it('should maintain proper z-index layering', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const contentArea = screen.getByText(/Ich entwickle moderne Webanwendungen/).closest('.relative');
      expect(contentArea).toHaveClass('z-10');

      const fadeOverlay = document.querySelector('.absolute.bottom-0');
      expect(fadeOverlay).toHaveClass('z-40');
    });

    it('should apply responsive fade overlay with clamp height', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const fadeOverlay = document.querySelector('.absolute.bottom-0');
      expect(fadeOverlay).toBeInTheDocument();
      
      const styles = fadeOverlay?.getAttribute('style');
      expect(styles).toContain('clamp(8rem, 15vh, 12rem)');
      expect(styles).toContain('var(--muted)');
    });
  });

  describe('Error Handling', () => {
    it('should handle analytics failures gracefully', () => {
      vi.mocked(trackPortfolioEvent.custom).mockImplementation(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        render(
          <TestWrapper>
            <Hero />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render correctly even with missing responsive state', () => {
      vi.mocked(ResponsiveHooks.useResponsive).mockReturnValue({
        currentBreakpoint: 'lg',
        viewportWidth: 0,
        viewportHeight: 0,
        deviceInfo: {
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          hasTouch: false,
          orientation: 'landscape',
          pixelRatio: 1,
          supportsHover: true,
        },
        isWithinBreakpoint: vi.fn(),
        isAtLeastBreakpoint: vi.fn(),
        isAtMostBreakpoint: vi.fn(),
      });

      expect(() => {
        render(
          <TestWrapper>
            <Hero />
          </TestWrapper>
        );
      }).not.toThrow();

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});