import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactStrip from '@/components/contact-strip';
import { useLanguage } from '@/contexts/LanguageContext';
import { en } from '@/content/dictionaries/en';
import { de } from '@/content/dictionaries/de';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    contactMethodClick: vi.fn(),
  },
}));

// Mock analytics tracking hook
vi.mock('@/hooks/useAnalyticsTracking', () => ({
  useSectionTracking: vi.fn(() => ({ current: null })),
}));

// Mock useLanguage hook
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

const renderWithLanguage = (language: 'de' | 'en' = 'en') => {
  const dictionary = language === 'de' ? de : en;
  const mockUseLanguage = vi.mocked(useLanguage);
  
  mockUseLanguage.mockReturnValue({
    dictionary,
    language,
    setLanguage: vi.fn(),
  });
  
  return render(<ContactStrip />);
};

describe('ContactStrip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile-First Responsive Design', () => {
    it('renders with mobile-first responsive classes', () => {
      renderWithLanguage();
      
      const section = screen.getByRole('region');
      expect(section).toHaveClass('py-12', 'xs:py-16', 'sm:py-20');
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-2xl', 'xs:text-3xl', 'md:text-4xl');
    });

    it('applies responsive spacing to layout elements', () => {
      renderWithLanguage();
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('mb-3', 'xs:mb-4');
      
      const subtitle = screen.getByText(en.contact.subtitle);
      expect(subtitle).toHaveClass('mb-6', 'xs:mb-8');
    });

    it('uses flexible layout for button container', () => {
      renderWithLanguage();
      
      const buttonContainer = screen.getByRole('heading', { level: 2 }).parentElement?.querySelector('div:last-child');
      expect(buttonContainer).toHaveClass('flex', 'flex-col', 'xs:flex-row', 'gap-3', 'xs:gap-4');
    });
  });

  describe('Touch-Friendly Interactions', () => {
    it('ensures primary CTA button meets minimum 48px height requirement', () => {
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      expect(primaryButton).toHaveClass('min-h-[48px]');
    });

    it('ensures email link meets minimum 44px height requirement', () => {
      renderWithLanguage();
      
      const emailLinks = screen.getAllByRole('link');
      const emailLink = emailLinks.find(link => link.textContent === en.contact.email);
      
      expect(emailLink).toHaveClass('min-h-[44px]');
    });

    it('provides full-width buttons on mobile with responsive width on larger screens', () => {
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      expect(primaryButton).toHaveClass('w-full', 'xs:w-auto');
    });
  });

  describe('Accessibility Compliance', () => {
    it('provides proper ARIA labels for interactive elements', () => {
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      expect(primaryButton).toHaveAttribute('aria-label', `${en.contact.cta} - ${en.contact.email}`);
      
      const emailLink = screen.getByRole('link', { name: new RegExp(`Email address: ${en.contact.email}`) });
      expect(emailLink).toHaveAttribute('aria-label', `Email address: ${en.contact.email}`);
    });

    it('includes proper focus management with visible focus indicators', () => {
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      expect(primaryButton).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-background/50',
        'focus:ring-offset-2',
        'focus:ring-offset-foreground'
      );
    });

    it('provides aria-hidden attribute for decorative icons', () => {
      renderWithLanguage();
      
      const icon = screen.getByRole('link', { name: new RegExp(en.contact.cta) }).querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('uses semantic HTML structure with proper heading hierarchy', () => {
      renderWithLanguage();
      
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Typography and Content Scaling', () => {
    it('applies responsive typography scaling with proper line heights', () => {
      renderWithLanguage();
      
      const subtitle = screen.getByText(en.contact.subtitle);
      expect(subtitle).toHaveClass('text-base', 'xs:text-lg', 'leading-relaxed');
    });

    it('handles text truncation for long content', () => {
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      const buttonText = primaryButton.querySelector('span');
      expect(buttonText).toHaveClass('truncate');
      
      const emailLink = screen.getByRole('link', { name: new RegExp(`Email address: ${en.contact.email}`) });
      const emailText = emailLink.querySelector('span');
      expect(emailText).toHaveClass('truncate');
    });

    it('maintains proper content hierarchy with max-width constraints', () => {
      renderWithLanguage();
      
      const subtitle = screen.getByText(en.contact.subtitle);
      expect(subtitle).toHaveClass('max-w-2xl', 'mx-auto');
    });
  });

  describe('German Language Support', () => {
    it('renders correctly with German content and handles text expansion', () => {
      renderWithLanguage('de');
      
      expect(screen.getByText(de.contact.title)).toBeInTheDocument();
      expect(screen.getByText(de.contact.subtitle)).toBeInTheDocument();
      expect(screen.getByText(de.contact.cta)).toBeInTheDocument();
    });

    it('maintains layout stability with longer German text', () => {
      renderWithLanguage('de');
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(de.contact.cta) });
      expect(primaryButton).toHaveClass('justify-center');
      
      const buttonText = primaryButton.querySelector('span');
      expect(buttonText).toHaveClass('truncate');
    });
  });

  describe('Performance and Interaction', () => {
    it('calls analytics tracking when email links are clicked', async () => {
      const { trackPortfolioEvent } = await import('@/lib/analytics');
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      fireEvent.click(primaryButton);
      
      expect(trackPortfolioEvent.contactMethodClick).toHaveBeenCalledWith('email', en.contact.email);
    });

    it('maintains proper semantic structure for screen readers', () => {
      renderWithLanguage();
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('id', 'contact');
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent(en.contact.title);
    });

    it('provides smooth transitions with proper animation classes', () => {
      renderWithLanguage();
      
      const primaryButton = screen.getByRole('link', { name: new RegExp(en.contact.cta) });
      expect(primaryButton).toHaveClass('transition-all', 'duration-200', 'hover:scale-105');
      
      const emailLink = screen.getByRole('link', { name: new RegExp(`Email address: ${en.contact.email}`) });
      expect(emailLink).toHaveClass('transition-colors');
    });
  });
});