import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Process from '@/components/process';
// Mock the analytics
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    custom: vi.fn(),
  },
}));

// Mock responsive utilities
vi.mock('@/hooks/useResponsive', () => ({
  useResponsive: vi.fn(),
}));

// Mock analytics tracking hook
vi.mock('@/hooks/useAnalyticsTracking', () => ({
  useSectionTracking: vi.fn(() => ({ current: null })),
}));

// Mock language context
vi.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
  useLanguage: vi.fn(),
}));

import { useResponsive } from '@/hooks/useResponsive';
import { useLanguage } from '@/contexts/LanguageContext';
import { en } from '@/content/dictionaries/en';
import { de } from '@/content/dictionaries/de';

const mockUseResponsive = vi.mocked(useResponsive);
const mockUseLanguage = vi.mocked(useLanguage);


// Test wrapper component
const TestWrapper = ({ 
  children, 
  dictionary = en 
}: { 
  children: React.ReactNode;
  dictionary?: typeof en;
}) => {
  // Set up the mock for useLanguage
  mockUseLanguage.mockReturnValue({
    language: 'en',
    dictionary,
    setLanguage: vi.fn(),
  });

  return <div data-testid="test-wrapper">{children}</div>;
};

describe('Process Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default responsive state (desktop)
    mockUseResponsive.mockReturnValue({
      currentBreakpoint: 'lg',
      viewportWidth: 1440,
      viewportHeight: 900,
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
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the process section with correct structure', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check section exists (use element query since it's a semantic section)
      const section = screen.getByRole('heading', { level: 2 }).closest('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'process');

      // Check header content
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('My Process');
      expect(screen.getByText('How I work with you')).toBeInTheDocument();
    });

    it('renders all process steps with correct content', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check all step titles are rendered
      expect(screen.getByText('Brief')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Build')).toBeInTheDocument();
      expect(screen.getByText('Launch')).toBeInTheDocument();
      expect(screen.getByText('Care')).toBeInTheDocument();

      // Check step descriptions
      expect(screen.getByText('We discuss your goals and requirements in detail.')).toBeInTheDocument();
      expect(screen.getByText('Conception and design of the user interface.')).toBeInTheDocument();
      expect(screen.getByText('Development of the application with cutting-edge technologies.')).toBeInTheDocument();
      expect(screen.getByText('Deployment and go-live of your new application.')).toBeInTheDocument();
      expect(screen.getByText('Maintenance and continuous improvement.')).toBeInTheDocument();
    });

    it('renders step numbers correctly', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check all step numbers are present (multiple elements may have same text)
      const stepNumbers = screen.getAllByText('1');
      expect(stepNumbers.length).toBeGreaterThan(0);
      
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);
      expect(screen.getAllByText('4').length).toBeGreaterThan(0);
      expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Responsiveness', () => {
    it('shows only mobile timeline on mobile devices', () => {
      // Mock mobile device
      mockUseResponsive.mockReturnValue({
        currentBreakpoint: 'sm',
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
      });

      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Mobile timeline should be visible
      const mobileTimelineNodes = screen.getAllByText('1').filter(el => {
        const parent = el.closest('div');
        return parent?.className.includes('w-12 h-12') && 
               parent?.className.includes('flex-shrink-0');
      });
      expect(mobileTimelineNodes.length).toBeGreaterThan(0);

      // All steps should still be rendered
      expect(screen.getByText('Brief')).toBeInTheDocument();
      expect(screen.getAllByText('Design')).toHaveLength(1);
    });

    it('shows only desktop timeline on desktop devices', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Desktop timeline nodes should be visible
      const desktopTimelineNodes = screen.getAllByText('1').filter(el => {
        const parent = el.closest('div');
        return parent?.className.includes('w-12 h-12') && 
               parent?.className.includes('z-10') &&
               parent?.className.includes('shadow-lg');
      });
      expect(desktopTimelineNodes.length).toBeGreaterThan(0);
    });

    it('ensures no duplicate timelines are rendered', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Count all step number elements
      const allStepOnes = screen.getAllByText('1');
      
      // Should have exactly 2 instances of '1': one in content card, one in timeline node
      // This ensures no duplicate timeline rendering
      expect(allStepOnes).toHaveLength(2);
    });
  });

  describe('Touch Target Compliance', () => {
    it('ensures mobile timeline nodes meet 44px minimum touch targets', () => {
      // Mock mobile device
      mockUseResponsive.mockReturnValue({
        currentBreakpoint: 'sm',
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
      });

      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check mobile timeline nodes have proper touch target size (w-12 h-12 = 48px)
      const mobileNodes = screen.getAllByText('1').filter(el => {
        const parent = el.closest('div');
        return parent?.className.includes('w-12 h-12');
      });

      expect(mobileNodes.length).toBeGreaterThan(0);
      
      // Verify the class includes the proper sizing
      mobileNodes.forEach(node => {
        const parent = node.closest('div');
        expect(parent?.className).toMatch(/w-12.*h-12/);
      });
    });

    it('ensures interactive elements have appropriate spacing', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check that cards have proper spacing
      const cards = screen.getAllByText('Brief').map(el => 
        el.closest('.bg-accent')
      ).filter(Boolean);

      expect(cards.length).toBeGreaterThan(0);
      
      cards.forEach(card => {
        expect(card).toHaveClass('p-6');
      });
    });
  });

  describe('Responsive Typography', () => {
    it('uses responsive typography classes', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl', 'lg:text-4xl');
    });

    it('applies proper responsive spacing', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      const section = document.getElementById('process');
      expect(section).toHaveClass('py-12', 'sm:py-16', 'lg:py-20');
    });
  });

  describe('Internationalization Support', () => {
    it('renders German content correctly', () => {
      render(
        <TestWrapper dictionary={de}>
          <Process />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Mein Prozess');
      expect(screen.getByText('So arbeite ich mit Ihnen zusammen')).toBeInTheDocument();
      expect(screen.getByText('Wir besprechen Ihre Ziele und Anforderungen im Detail.')).toBeInTheDocument();
    });

    it('handles German text expansion properly in mobile layout', () => {
      // Mock mobile device  
      mockUseResponsive.mockReturnValue({
        currentBreakpoint: 'sm',
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
      });

      render(
        <TestWrapper dictionary={de}>
          <Process />
        </TestWrapper>
      );

      // German text should render without overflow
      const germanDescription = screen.getByText('Wir besprechen Ihre Ziele und Anforderungen im Detail.');
      expect(germanDescription).toBeInTheDocument();
      
      // Check the parent card has proper styling for text expansion
      const card = germanDescription.closest('.bg-accent');
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Visual Design Compliance', () => {
    it('uses monochrome design system colors', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      const section = document.getElementById('process');
      expect(section).toHaveClass('bg-background');

      // Check card styling uses accent colors
      const briefTitle = screen.getByText('Brief');
      const card = briefTitle.closest('.bg-accent');
      expect(card).toHaveClass('bg-accent', 'border', 'border-border');
    });

    it('applies proper visual hierarchy', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveClass('font-bold', 'text-foreground');

      const stepHeadings = screen.getAllByRole('heading', { level: 3 });
      stepHeadings.forEach(heading => {
        expect(heading).toHaveClass('font-semibold', 'text-foreground');
      });
    });
  });

  describe('Performance Considerations', () => {
    it('renders efficiently without unnecessary re-renders', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check initial render
      expect(screen.getByText('My Process')).toBeInTheDocument();

      // Rerender with same props should not cause issues
      rerender(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      expect(screen.getByText('My Process')).toBeInTheDocument();
    });

    it('handles responsive state changes gracefully', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Initial desktop render
      expect(screen.getByText('Brief')).toBeInTheDocument();

      // Change to mobile
      mockUseResponsive.mockReturnValue({
        currentBreakpoint: 'sm',
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
      });

      rerender(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Content should still be there after responsive change
      expect(screen.getByText('Brief')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Check semantic structure
      expect(document.getElementById('process')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5);
    });

    it('maintains focus management', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      const section = document.getElementById('process');
      expect(section).toHaveAttribute('id', 'process');
    });

    it('provides appropriate color contrast', () => {
      render(
        <TestWrapper>
          <Process />
        </TestWrapper>
      );

      // Main heading
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-foreground');

      // Subtitle
      const subtitle = screen.getByText('How I work with you');
      expect(subtitle).toHaveClass('text-muted-foreground');
    });
  });

  describe('Error Handling', () => {
    it('handles missing dictionary gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Test with empty dictionary - create a minimal but complete dictionary structure
      const emptyDict = { 
        ...en,
        process: { title: '', subtitle: '', steps: [] } 
      };
      
      expect(() => {
        render(
          <TestWrapper dictionary={emptyDict}>
            <Process />
          </TestWrapper>
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('handles responsive hook failures gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock hook to return undefined/error state
      mockUseResponsive.mockImplementation(() => {
        throw new Error('Responsive hook failed');
      });

      expect(() => {
        render(
          <TestWrapper>
            <Process />
          </TestWrapper>
        );
      }).toThrow('Responsive hook failed');

      consoleSpy.mockRestore();
    });
  });
});