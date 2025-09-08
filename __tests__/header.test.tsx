import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Header from '@/components/header';
import { useLanguage } from '@/contexts/LanguageContext';
import { de } from '@/content/dictionaries/de';
import { en } from '@/content/dictionaries/en';
import * as analytics from '@/lib/analytics';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    navigationClick: vi.fn(),
    languageChange: vi.fn(),
    custom: vi.fn(),
  },
}));

// Mock useLanguage hook
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

// Mock document.getElementById for scroll behavior
const mockScrollIntoView = vi.fn();

describe('Header Component', () => {
  const mockSetLanguage = vi.fn();
  const mockUseLanguage = vi.mocked(useLanguage);

  const renderWithLanguage = (language: 'de' | 'en' = 'de') => {
    const dictionary = language === 'de' ? de : en;
    mockUseLanguage.mockReturnValue({
      dictionary,
      language,
      setLanguage: mockSetLanguage,
    });
    
    return render(<Header />);
  };

  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = mockScrollIntoView;
    // Mock getElementById
    document.getElementById = vi.fn(() => ({
      scrollIntoView: mockScrollIntoView,
    })) as unknown as typeof document.getElementById;
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders header with logo and navigation', () => {
      renderWithLanguage('de');
      
      expect(screen.getByText('Maximilian Spitzer')).toBeInTheDocument();
      expect(screen.getByText('Über mich')).toBeInTheDocument();
      expect(screen.getByText('Projekte')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Prozess')).toBeInTheDocument();
      expect(screen.getByText('Kontakt')).toBeInTheDocument();
    });

    it('renders with English dictionary', () => {
      renderWithLanguage('en');
      
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Process')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('has proper header structure and styling', () => {
      const { container } = renderWithLanguage();
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('sticky', 'top-0', 'z-50', 'w-full', 'border-b');
      expect(header?.querySelector('.container')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive CSS classes for mobile-first design', () => {
      const { container } = renderWithLanguage();
      
      // Check for responsive spacing and typography
      const logoElement = screen.getByText('Maximilian Spitzer');
      expect(logoElement).toHaveClass('text-responsive-lg');
      
      // Check for responsive touch targets
      const langButtons = container.querySelectorAll('button');
      langButtons.forEach(button => {
        if (button.textContent === 'DE' || button.textContent === 'EN') {
          expect(button).toHaveClass('touch-target');
        }
      });
    });

    it('shows mobile menu button on small screens', () => {
      renderWithLanguage();
      
      const mobileMenuButton = screen.getByLabelText('Menü öffnen');
      expect(mobileMenuButton).toHaveClass('md:hidden');
      expect(mobileMenuButton).toHaveClass('touch-target-comfortable');
    });

    it('hides desktop navigation on mobile', () => {
      renderWithLanguage();
      
      const desktopNav = screen.getByText('Über mich').closest('nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });
  });

  describe('Touch Target Accessibility', () => {
    it('has minimum 44px touch targets for all interactive elements', () => {
      const { container } = renderWithLanguage();
      
      // Language switcher buttons
      const deButton = screen.getByText('DE');
      const enButton = screen.getByText('EN');
      
      expect(deButton).toHaveClass('touch-target');
      expect(enButton).toHaveClass('touch-target');
      
      // Mobile menu button
      const menuButton = screen.getByLabelText('Menü öffnen');
      expect(menuButton).toHaveClass('touch-target-comfortable');
      
      // Desktop navigation buttons
      const navButtons = container.querySelectorAll('nav button');
      navButtons.forEach(button => {
        expect(button).toHaveClass('touch-target');
      });
    });

    it('has proper ARIA labels for accessibility', () => {
      renderWithLanguage();
      
      const menuButton = screen.getByLabelText('Menü öffnen');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Mobile Navigation Functionality', () => {
    it('toggles mobile menu when menu button is clicked', async () => {
      renderWithLanguage();
      
      const menuButton = screen.getByLabelText('Menü öffnen');
      
      // Initially closed - check for mobile menu not visible
      expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument();
      
      // Open menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Menü schließen')).toBeInTheDocument();
      });
      
      // Mobile navigation items should be visible
      const mobileNavItems = screen.getAllByText('Über mich');
      expect(mobileNavItems.length).toBeGreaterThan(1); // Desktop + Mobile versions
    });

    it('closes mobile menu when navigation item is clicked', async () => {
      renderWithLanguage();
      
      const menuButton = screen.getByLabelText('Menü öffnen');
      
      // Open menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Menü schließen')).toBeInTheDocument();
      });
      
      // Click a mobile nav item
      const mobileNavItems = screen.getAllByText('Über mich');
      const mobileNavItem = mobileNavItems.find(item => 
        item.closest('div')?.className.includes('md:hidden')
      );
      
      if (mobileNavItem) {
        fireEvent.click(mobileNavItem);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Menü öffnen')).toBeInTheDocument();
        });
      }
    });

    it('shows correct icon based on menu state', async () => {
      renderWithLanguage();
      
      const menuButton = screen.getByLabelText('Menü öffnen');
      
      // Check hamburger icon initially
      expect(menuButton.querySelector('path')).toHaveAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      
      // Open menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Menü schließen');
        expect(closeButton.querySelector('path')).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
      });
    });
  });

  describe('Language Switching', () => {
    it('calls setLanguage when language buttons are clicked', async () => {
      renderWithLanguage();
      
      const enButton = screen.getByText('EN');
      fireEvent.click(enButton);
      
      expect(mockSetLanguage).toHaveBeenCalledWith('en');
    });

    it('shows active state for current language', () => {
      renderWithLanguage('de');
      
      const deButton = screen.getByText('DE');
      const enButton = screen.getByText('EN');
      
      expect(deButton).toHaveClass('bg-foreground', 'text-background');
      expect(enButton).toHaveClass('text-foreground/60');
    });

    it('tracks language change events', async () => {
      renderWithLanguage();
      
      const enButton = screen.getByText('EN');
      fireEvent.click(enButton);
      
      expect(analytics.trackPortfolioEvent.languageChange).toHaveBeenCalledWith('en');
    });
  });

  describe('Navigation Interactions', () => {
    it('scrolls to section when navigation button is clicked', async () => {
      renderWithLanguage();
      
      const aboutButton = screen.getByText('Über mich');
      fireEvent.click(aboutButton);
      
      expect(document.getElementById).toHaveBeenCalledWith('about');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('tracks navigation clicks', async () => {
      renderWithLanguage();
      
      const workButton = screen.getByText('Projekte');
      fireEvent.click(workButton);
      
      expect(analytics.trackPortfolioEvent.navigationClick).toHaveBeenCalledWith('work');
    });
  });

  describe('Analytics Integration', () => {
    it('tracks mobile menu toggle events', async () => {
      renderWithLanguage();
      
      const menuButton = screen.getByLabelText('Menü öffnen');
      fireEvent.click(menuButton);
      
      expect(analytics.trackPortfolioEvent.custom).toHaveBeenCalledWith('mobile_menu_toggle', {
        action: 'open',
        timestamp: expect.any(Number),
      });
    });
  });

  describe('Focus Management', () => {
    it('has proper focus styles for keyboard navigation', () => {
      renderWithLanguage();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('btn-focus');
      });
    });
  });

  describe('Responsive Typography and Spacing', () => {
    it('uses responsive CSS classes for typography', () => {
      renderWithLanguage();
      
      const logo = screen.getByText('Maximilian Spitzer');
      expect(logo).toHaveClass('text-responsive-lg');
      
      const navButtons = screen.getAllByRole('button');
      const desktopNavButtons = navButtons.filter(button => 
        button.closest('nav')?.className.includes('hidden md:flex')
      );
      
      desktopNavButtons.forEach(button => {
        expect(button.closest('nav')).toHaveClass('text-responsive-sm');
      });
    });

    it('uses responsive spacing utilities', () => {
      const { container } = renderWithLanguage();
      
      // Check for responsive spacing classes
      const spacingElements = container.querySelectorAll('[class*="space-responsive"]');
      expect(spacingElements.length).toBeGreaterThan(0);
    });
  });
});