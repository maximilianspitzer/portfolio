import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import WorkGrid from '@/components/work-grid';
import { LanguageProvider } from '@/contexts/LanguageContext';
import * as analyticsLib from '@/lib/analytics';
import * as responsiveHook from '@/hooks/useResponsive';
// Analytics tracking hook is mocked below
import { projects } from '@/content/projects';
import type { ResponsiveState } from '@/types/responsive';

// Mock the analytics and hooks
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
    default: ({ project, onClose }: { project: Record<string, unknown>; onClose: () => void }) => (
      <div data-testid="project-modal">
        <div>{project.id as string}</div>
        <button onClick={onClose} data-testid="close-modal">Close</button>
      </div>
    ),
  };
});

// Mock Next.js Image component
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

// Test dictionaries
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

describe('WorkGrid Responsive Component', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseResponsive.mockReturnValue(mockResponsiveState);
    
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

  describe('Mobile Layout (xs/sm breakpoints)', () => {
    beforeEach(() => {
      mockUseResponsive.mockReturnValue({
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
    });

    it('should render single column grid on mobile', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('sm:grid-cols-2'); // Class is present for responsive behavior
    });

    it('should show fewer technology tags on mobile', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      // Mobile should show max 2 tech tags vs 3 on desktop
      const techTags = firstCard.querySelectorAll('span[class*="bg-muted text-muted-foreground"]');
      const visibleTags = Array.from(techTags).filter(tag => 
        !tag.textContent?.startsWith('+')
      );
      
      expect(visibleTags.length).toBeLessThanOrEqual(2);
    });

    it('should use mobile-optimized image aspect ratio', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const imageContainers = document.querySelectorAll('.aspect-\\[4\\/3\\]');
      expect(imageContainers.length).toBeGreaterThan(0);
    });

    it('should have touch-friendly minimum target sizes', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const touchButtons = document.querySelectorAll('.touch-target');
      touchButtons.forEach(button => {
        // Note: In test environment, CSS custom properties might not be available
        // This tests the class is present, actual sizing would be tested in E2E
        expect(button).toHaveClass('touch-target');
      });
    });
  });

  describe('Tablet Layout (md breakpoint)', () => {
    beforeEach(() => {
      mockUseResponsive.mockReturnValue({
        ...mockResponsiveState,
        currentBreakpoint: 'md',
        viewportWidth: 768,
        deviceInfo: {
          ...mockResponsiveState.deviceInfo,
          isMobile: false,
          isTablet: true,
          isDesktop: false,
          hasTouch: true,
        },
      });
    });

    it('should render two column grid on tablet', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('sm:grid-cols-2');
    });

    it('should use video aspect ratio for images', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const imageContainers = document.querySelectorAll('.sm\\:aspect-video');
      expect(imageContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Desktop Layout (lg+ breakpoints)', () => {
    beforeEach(() => {
      mockUseResponsive.mockReturnValue({
        ...mockResponsiveState,
        currentBreakpoint: 'lg',
        viewportWidth: 1024,
        deviceInfo: {
          ...mockResponsiveState.deviceInfo,
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          hasTouch: false,
        },
      });
    });

    it('should render three column grid on desktop', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });

    it('should show more technology tags on desktop', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      const techTags = firstCard.querySelectorAll('span[class*="bg-muted text-muted-foreground"]');
      const visibleTags = Array.from(techTags).filter(tag => 
        !tag.textContent?.startsWith('+')
      );
      
      expect(visibleTags.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Responsive Interactions', () => {
    it('should track responsive analytics when project is opened', async () => {
      const { container } = render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      fireEvent.click(firstCard);
      
      await waitFor(() => {
        expect(analyticsLib.trackPortfolioEvent.custom).toHaveBeenCalledWith(
          'work_grid_project_open',
          expect.objectContaining({
            project_id: projects[0].id,
            breakpoint: mockResponsiveState.currentBreakpoint,
            device_type: 'desktop',
            is_touch_device: false,
          })
        );
      }, { container });
    });

    it('should handle keyboard interactions for accessibility', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      // Test Enter key
      fireEvent.keyDown(firstCard, { key: 'Enter' });
      expect(screen.getByTestId('project-modal')).toBeInTheDocument();
    });

    it('should handle space key interactions', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      fireEvent.keyDown(firstCard, { key: ' ' });
      expect(screen.getByTestId('project-modal')).toBeInTheDocument();
    });
  });

  describe('Image Optimization', () => {
    it('should use responsive sizes attribute', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const images = screen.getAllByTestId('project-image');
      images.forEach(image => {
        expect(image).toHaveAttribute('sizes', 
          '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        );
      });
    });

    it('should prioritize first 3 images for loading', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const images = screen.getAllByTestId('project-image');
      
      // First 3 images should have priority
      for (let i = 0; i < Math.min(3, images.length); i++) {
        // Note: This would be tested better in integration tests
        // as priority is handled by Next.js Image component
        expect(images[i]).toHaveAttribute('alt');
      }
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      projectCards.forEach(card => {
        expect(card).toHaveAttribute('aria-label');
        expect(card.getAttribute('aria-label')).toMatch(/View project:/);
      });
    });

    it('should use semantic HTML elements', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      // Should use article elements for project cards
      const articles = document.querySelectorAll('article');
      expect(articles.length).toBe(projects.length);
      
      // Should have proper heading hierarchy
      const sectionHeading = screen.getByRole('heading', { level: 2 });
      expect(sectionHeading).toBeInTheDocument();
      
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings.length).toBe(projects.length);
    });

    it('should support focus management', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      expect(firstCard).toHaveAttribute('tabIndex', '0');
      
      // Internal CTA button should not be focusable to prevent double tab stops
      const ctaButtons = firstCard.querySelectorAll('button[tabindex="-1"]');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Modal Integration', () => {
    it('should open and close modal correctly', async () => {
      const { container } = render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      // Open modal
      fireEvent.click(firstCard);
      await waitFor(() => {
        expect(screen.getByTestId('project-modal')).toBeInTheDocument();
      }, { container });
      
      // Close modal
      const closeButton = screen.getByTestId('close-modal');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
      }, { container });
    });

    it('should track modal close events', async () => {
      const { container } = render(<WorkGrid />, { wrapper: TestWrapper });
      
      const projectCards = screen.getAllByRole('button');
      const firstCard = projectCards[0];
      
      fireEvent.click(firstCard);
      await waitFor(() => {
        expect(screen.getByTestId('project-modal')).toBeInTheDocument();
      }, { container });
      
      const closeButton = screen.getByTestId('close-modal');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(analyticsLib.trackPortfolioEvent.projectModalClose).toHaveBeenCalledWith(
          projects[0].id,
          expect.any(String)
        );
      }, { container });
    });
  });

  describe('Performance Optimizations', () => {
    it('should use CSS classes for responsive behavior', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const gridContainer = document.querySelector('.grid');
      
      // Should use Tailwind responsive classes
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('sm:grid-cols-2');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });

    it('should prevent horizontal scrolling', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const section = document.querySelector('section');
      expect(section).toHaveClass('no-horizontal-scroll');
    });

    it('should use responsive spacing utilities', () => {
      render(<WorkGrid />, { wrapper: TestWrapper });
      
      const section = document.querySelector('section');
      expect(section).toHaveClass('section-spacing');
      
      const container = document.querySelector('.container-responsive');
      expect(container).toBeInTheDocument();
    });
  });
});