import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { de } from '@/content/dictionaries/de';
import { en } from '@/content/dictionaries/en';
import * as analytics from '@/lib/analytics';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    socialLinkClick: vi.fn(),
    legalPageView: vi.fn(),
  },
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock useLanguage hook
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

describe('Footer Component', () => {
  const mockPush = vi.fn();
  const mockUseLanguage = vi.mocked(useLanguage);

  const renderWithLanguage = (language: 'de' | 'en' = 'de') => {
    const dictionary = language === 'de' ? de : en;
    mockUseLanguage.mockReturnValue({
      dictionary,
      language,
      setLanguage: vi.fn(),
    });
    
    return render(<Footer />);
  };

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders footer with copyright and legal links', () => {
      renderWithLanguage('de');
      
      expect(screen.getByText(/© 2025 Maximilian Spitzer/)).toBeInTheDocument();
      expect(screen.getByText('Impressum')).toBeInTheDocument();
      expect(screen.getByText('Datenschutz')).toBeInTheDocument();
    });

    it('renders social media links', () => {
      renderWithLanguage();
      
      const githubLink = screen.getByLabelText(/GitHub/);
      const linkedinLink = screen.getByLabelText(/LinkedIn/);
      
      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
    });

    it('renders with English dictionary', () => {
      renderWithLanguage('en');
      
      expect(screen.getByText(/© 2025 Maximilian Spitzer/)).toBeInTheDocument();
      expect(screen.getByText('Legal Notice')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile-first responsive layout classes', () => {
      const { container } = renderWithLanguage();
      
      // Check for mobile-stack utility class
      const layoutContainer = container.querySelector('.mobile-stack');
      expect(layoutContainer).toBeInTheDocument();
      
      // Check for responsive spacing
      const spacingElements = container.querySelectorAll('[class*="space-responsive"]');
      expect(spacingElements.length).toBeGreaterThan(0);
    });

    it('uses responsive typography classes', () => {
      renderWithLanguage();
      
      const copyrightText = screen.getByText(/© 2025 Maximilian Spitzer/);
      expect(copyrightText).toHaveClass('text-responsive-sm');
      
      const legalLinks = screen.getByText('Impressum').closest('div');
      expect(legalLinks).toHaveClass('text-responsive-sm');
    });

    it('applies proper responsive padding', () => {
      const { container } = renderWithLanguage();
      
      const footerContainer = container.querySelector('.container');
      expect(footerContainer?.parentElement).toHaveClass('py-responsive-lg');
    });
  });

  describe('Touch Target Accessibility', () => {
    it('has minimum 44px touch targets for all interactive elements', () => {
      renderWithLanguage();
      
      // Legal links
      const impressumLink = screen.getByText('Impressum');
      const datenschutzLink = screen.getByText('Datenschutz');
      
      expect(impressumLink).toHaveClass('touch-target');
      expect(datenschutzLink).toHaveClass('touch-target');
      
      // Social media links
      const githubLink = screen.getByLabelText(/GitHub/);
      const linkedinLink = screen.getByLabelText(/LinkedIn/);
      
      expect(githubLink).toHaveClass('touch-target-comfortable');
      expect(linkedinLink).toHaveClass('touch-target-comfortable');
    });

    it('has proper icon sizes for touch targets', () => {
      renderWithLanguage();
      
      const githubIcon = screen.getByLabelText(/GitHub/).querySelector('svg');
      const linkedinIcon = screen.getByLabelText(/LinkedIn/).querySelector('svg');
      
      expect(githubIcon).toHaveClass('h-6', 'w-6');
      expect(linkedinIcon).toHaveClass('h-6', 'w-6');
    });
  });

  describe('Link Functionality', () => {
    it('has correct href attributes for legal pages', () => {
      renderWithLanguage();
      
      const impressumLink = screen.getByText('Impressum');
      const datenschutzLink = screen.getByText('Datenschutz');
      
      expect(impressumLink.closest('a')).toHaveAttribute('href', '/impressum');
      expect(datenschutzLink.closest('a')).toHaveAttribute('href', '/datenschutz');
    });

    it('has correct href attributes for social media links', () => {
      renderWithLanguage();
      
      const githubLink = screen.getByLabelText(/GitHub/);
      const linkedinLink = screen.getByLabelText(/LinkedIn/);
      
      expect(githubLink).toHaveAttribute('href', 'https://github.com');
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
    });

    it('opens social media links in new tab', () => {
      renderWithLanguage();
      
      const githubLink = screen.getByLabelText(/GitHub/);
      const linkedinLink = screen.getByLabelText(/LinkedIn/);
      
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Analytics Integration', () => {
    it('tracks social media link clicks', async () => {
      renderWithLanguage();
      
      const githubLink = screen.getByLabelText(/GitHub/);
      fireEvent.click(githubLink);
      
      expect(analytics.trackPortfolioEvent.socialLinkClick).toHaveBeenCalledWith(
        'GitHub',
        'https://github.com',
        'footer'
      );
    });

    it('tracks legal page clicks', async () => {
      renderWithLanguage();
      
      const impressumLink = screen.getByText('Impressum');
      fireEvent.click(impressumLink);
      
      expect(analytics.trackPortfolioEvent.legalPageView).toHaveBeenCalledWith('impressum');
    });

    it('tracks LinkedIn link clicks', async () => {
      renderWithLanguage();
      
      const linkedinLink = screen.getByLabelText(/LinkedIn/);
      fireEvent.click(linkedinLink);
      
      expect(analytics.trackPortfolioEvent.socialLinkClick).toHaveBeenCalledWith(
        'LinkedIn',
        'https://linkedin.com',
        'footer'
      );
    });

    it('tracks privacy policy clicks', async () => {
      renderWithLanguage();
      
      const datenschutzLink = screen.getByText('Datenschutz');
      fireEvent.click(datenschutzLink);
      
      expect(analytics.trackPortfolioEvent.legalPageView).toHaveBeenCalledWith('datenschutz');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper ARIA labels for screen readers', () => {
      renderWithLanguage('de');
      
      const githubLink = screen.getByLabelText('GitHub');
      const linkedinLink = screen.getByLabelText('LinkedIn');
      
      expect(githubLink).toHaveAttribute('aria-label', 'GitHub');
      expect(linkedinLink).toHaveAttribute('aria-label', 'LinkedIn');
    });

    it('has proper focus management', () => {
      renderWithLanguage();
      
      const allLinks = screen.getAllByRole('link');
      allLinks.forEach(link => {
        expect(link).toHaveClass('btn-focus');
      });
    });

    it('marks decorative elements as hidden from screen readers', () => {
      const { container } = renderWithLanguage();
      
      const separator = container.querySelector('[aria-hidden="true"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveTextContent('•');
    });

    it('has proper SVG accessibility attributes', () => {
      renderWithLanguage();
      
      const svgElements = screen.getAllByRole('img', { hidden: true });
      svgElements.forEach(svg => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Visual States and Interactions', () => {
    it('has hover states for interactive elements', () => {
      renderWithLanguage();
      
      const impressumLink = screen.getByText('Impressum');
      const githubLink = screen.getByLabelText(/GitHub/);
      
      expect(impressumLink).toHaveClass('hover:text-foreground');
      expect(githubLink).toHaveClass('hover:text-foreground');
    });

    it('has active states for touch devices', () => {
      renderWithLanguage();
      
      const githubLink = screen.getByLabelText(/GitHub/);
      const linkedinLink = screen.getByLabelText(/LinkedIn/);
      
      expect(githubLink).toHaveClass('active:scale-98');
      expect(linkedinLink).toHaveClass('active:scale-98');
    });
  });

  describe('Layout and Spacing', () => {
    it('uses consistent responsive spacing throughout', () => {
      const { container } = renderWithLanguage();
      
      // Check for responsive spacing utilities
      const responsiveSpacing = container.querySelectorAll('[class*="space-responsive"]');
      expect(responsiveSpacing.length).toBeGreaterThan(0);
    });

    it('centers content properly on mobile and desktop', () => {
      const { container } = renderWithLanguage();
      
      const mainContainer = container.querySelector('.mobile-stack');
      expect(mainContainer).toHaveClass('items-center');
    });

    it('maintains proper semantic structure', () => {
      const { container } = renderWithLanguage();
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('border-t', 'bg-background');
    });
  });

  describe('Content Validation', () => {
    it('displays current year in copyright', () => {
      renderWithLanguage();
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
    });

    it('uses proper text hierarchy and styling', () => {
      renderWithLanguage();
      
      const copyrightText = screen.getByText(/© 2025 Maximilian Spitzer/);
      expect(copyrightText).toHaveClass('text-responsive-sm', 'leading-relaxed', 'text-muted-foreground');
    });
  });

  describe('Cross-browser Compatibility', () => {
    it('uses appropriate CSS classes for browser compatibility', () => {
      const { container } = renderWithLanguage();
      
      // Check for proper transition classes
      const transitionElements = container.querySelectorAll('.transition-colors');
      expect(transitionElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Considerations', () => {
    it('uses proper loading attributes for external links', () => {
      renderWithLanguage();
      
      const externalLinks = [
        screen.getByLabelText(/GitHub/),
        screen.getByLabelText(/LinkedIn/)
      ];
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});