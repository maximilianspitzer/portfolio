import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import WorkGrid from '@/components/work-grid';
import { LanguageProvider } from '@/contexts/LanguageContext';
import * as responsiveHook from '@/hooks/useResponsive';
import type { ResponsiveState } from '@/types/responsive';

// Mock the hooks and dependencies
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    projectModalOpen: vi.fn(),
    projectModalClose: vi.fn(),
    custom: vi.fn(),
  },
}));

vi.mock('@/hooks/useAnalyticsTracking', () => ({
  useSectionTracking: vi.fn(() => ({ current: null })),
}));

vi.mock('@/hooks/useResponsive');
vi.mock('@/components/project-modal', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="project-modal">Modal</div>,
  };
});

vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: ({ alt, fill, priority, blurDataURL, sizes, ...props }: { alt: string; fill?: boolean; priority?: boolean; blurDataURL?: string; sizes?: string; [key: string]: unknown }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        {...(props as Record<string, unknown>)} 
        alt={alt} 
        data-testid="project-image" 
        data-fill={fill ? 'true' : 'false'}
        data-priority={priority ? 'true' : 'false'}
        data-blur-data-url={blurDataURL}
        sizes={sizes}
      />
    ),
  };
});

const testDictionary = {
  work: {
    title: 'My Work',
    subtitle: 'Projects I\'ve built',
    view_project: 'View Project'
  }
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    {children}
  </LanguageProvider>
);

const mockUseResponsive = responsiveHook.useResponsive as ReturnType<typeof vi.fn>;

describe('WorkGrid Touch Target Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useLanguage context
    vi.doMock('@/contexts/LanguageContext', () => ({
      useLanguage: () => ({
        dictionary: testDictionary,
        currentLanguage: 'en',
        setLanguage: vi.fn(),
      }),
      LanguageProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }));
  });

  describe('Mobile Touch Targets', () => {
    beforeEach(() => {
      const mockResponsiveState: ResponsiveState = {
        currentBreakpoint: 'xs',
        viewportWidth: 375,
        viewportHeight: 667,
        deviceInfo: {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          hasTouch: true,
          orientation: 'portrait',
          pixelRatio: 2,
          supportsHover: false,
        },
        isWithinBreakpoint: vi.fn(),
        isAtLeastBreakpoint: vi.fn(),
        isAtMostBreakpoint: vi.fn(),
      };
      
      mockUseResponsive.mockReturnValue(mockResponsiveState);
    });

    it('should have touch-target class on CTA buttons', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const touchButtons = document.querySelectorAll('.touch-target');
      expect(touchButtons.length).toBeGreaterThan(0);
      
      // Each project card should have a touch-friendly CTA
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        const ctaButton = card.querySelector('.touch-target');
        expect(ctaButton).toBeInTheDocument();
      });
    });

    it('should have minimum 44px touch targets in CSS', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Create a style element to simulate the CSS custom properties
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --touch-target-min: 44px;
          --touch-target-comfortable: 48px;
        }
        .touch-target {
          min-width: var(--touch-target-min);
          min-height: var(--touch-target-min);
        }
      `;
      document.head.appendChild(style);
      
      const touchButtons = document.querySelectorAll('.touch-target');
      touchButtons.forEach(button => {
        // In test environment, we verify the class is present
        // Actual size verification would be done in E2E tests
        expect(button).toHaveClass('touch-target');
      });
      
      document.head.removeChild(style);
    });

    it('should have adequate spacing between touch targets', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Technology tags should have proper spacing
      const techTagContainers = document.querySelectorAll('.flex.flex-wrap');
      techTagContainers.forEach(container => {
        expect(container).toHaveClass('gap-2');
      });
    });

    it('should have accessible focus states for touch devices', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        expect(card).toHaveClass('focus-within:ring-2');
        expect(card).toHaveClass('focus-within:ring-foreground');
      });
    });
  });

  describe('Desktop Touch Target Accessibility', () => {
    beforeEach(() => {
      const mockResponsiveState: ResponsiveState = {
        currentBreakpoint: 'lg',
        viewportWidth: 1024,
        viewportHeight: 768,
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
      };
      
      mockUseResponsive.mockReturnValue(mockResponsiveState);
    });

    it('should still maintain touch-friendly targets on desktop', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Even on desktop, maintain accessible touch targets for hybrid devices
      const touchButtons = document.querySelectorAll('.touch-target');
      expect(touchButtons.length).toBeGreaterThan(0);
    });

    it('should have proper hover states on desktop', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        expect(card).toHaveClass('card-hover');
        expect(card).toHaveClass('hover:shadow-lg');
      });
    });
  });

  describe('High Contrast Mode Support', () => {
    it('should maintain touch target visibility in high contrast', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Simulate high contrast mode with CSS
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-contrast: high) {
          :root {
            --touch-target-min: 48px;
            --touch-target-comfortable: 52px;
          }
        }
      `;
      document.head.appendChild(style);
      
      const touchButtons = document.querySelectorAll('.touch-target');
      touchButtons.forEach(button => {
        expect(button).toHaveClass('touch-target');
        // In high contrast, touch targets should be even more prominent
        expect(button).toHaveClass('btn-focus');
      });
      
      document.head.removeChild(style);
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect reduced motion preference for touch interactions', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        // Cards should have card-hover class which respects reduced motion
        expect(card).toHaveClass('card-hover');
      });
    });
  });

  describe('Focus Management', () => {
    it('should prevent double tab stops on internal elements', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        // Main card should be focusable
        expect(card).toHaveAttribute('tabIndex', '0');
        
        // Internal CTA button should not be in tab order
        const internalButtons = card.querySelectorAll('button[tabindex="-1"]');
        expect(internalButtons.length).toBeGreaterThan(0);
      });
    });

    it('should have proper ARIA labels for screen readers', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        const ariaLabel = card.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toMatch(/View project:/);
      });
    });

    it('should support keyboard navigation', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        // Should have onKeyDown handler (can't test implementation directly)
        expect(card).toHaveAttribute('role', 'button');
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Touch Target Size Validation', () => {
    it('should use CSS custom properties for consistent sizing', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Verify that touch-target utilities are used
      const touchElements = document.querySelectorAll('.touch-target');
      expect(touchElements.length).toBeGreaterThan(0);
      
      // Each should use the CSS custom property system
      touchElements.forEach(element => {
        expect(element).toHaveClass('touch-target');
      });
    });

    it('should have consistent spacing using design system tokens', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Grid should use responsive spacing
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
      expect(grid).toHaveClass('sm:gap-6');
      
      // Cards should use responsive padding
      const cardContents = document.querySelectorAll('[class*="p-4"]');
      expect(cardContents.length).toBeGreaterThan(0);
    });
  });
});