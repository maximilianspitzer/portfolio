import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Services from '@/components/services';
import { useLanguage } from '@/contexts/LanguageContext';
import { en } from '@/content/dictionaries/en';
import { de } from '@/content/dictionaries/de';

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
  
  return render(<Services />);
};

describe('Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile-First Responsive Design', () => {
    it('renders with mobile-first responsive spacing classes', () => {
      renderWithLanguage();
      
      const section = screen.getByRole('region');
      expect(section).toHaveClass('py-12', 'xs:py-16', 'sm:py-20');
    });

    it('applies responsive typography to header elements', () => {
      renderWithLanguage();
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-2xl', 'xs:text-3xl', 'md:text-4xl');
      expect(title).toHaveClass('mb-3', 'xs:mb-4');
      
      const subtitle = screen.getByText(en.services.subtitle);
      expect(subtitle).toHaveClass('text-base', 'xs:text-lg', 'leading-relaxed');
    });

    it('uses responsive grid layout with proper breakpoints', () => {
      renderWithLanguage();
      
      const gridContainer = screen.getByRole('heading', { level: 2 }).parentElement?.querySelector('div:last-child');
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'xs:grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-4'
      );
      expect(gridContainer).toHaveClass('gap-4', 'xs:gap-6');
    });

    it('applies responsive spacing to header container', () => {
      renderWithLanguage();
      
      const headerContainer = screen.getByRole('heading', { level: 2 }).parentElement;
      expect(headerContainer).toHaveClass('mb-8', 'xs:mb-12', 'sm:mb-16');
    });
  });

  describe('Service Cards Responsive Design', () => {
    it('renders service cards with responsive padding', () => {
      renderWithLanguage();
      
      const serviceCards = screen.getAllByRole('article');
      serviceCards.forEach(card => {
        expect(card).toHaveClass('p-4', 'xs:p-6');
      });
    });

    it('applies responsive sizing to service icons', () => {
      renderWithLanguage();
      
      const iconContainers = screen.getAllByRole('article').map(card => 
        card.querySelector('div > div')
      );
      
      iconContainers.forEach((container) => {
        expect(container).toHaveClass('w-12', 'h-12', 'xs:w-14', 'xs:h-14');
      });
    });

    it('uses responsive icon sizes within containers', () => {
      renderWithLanguage();
      
      const icons = screen.getAllByRole('article').map(card => 
        card.querySelector('svg')
      );
      
      icons.forEach(icon => {
        expect(icon).toHaveClass('w-6', 'h-6', 'xs:w-7', 'xs:h-7');
      });
    });

    it('applies responsive typography to service titles and descriptions', () => {
      renderWithLanguage();
      
      const serviceTitles = screen.getAllByRole('heading', { level: 3 });
      serviceTitles.forEach(title => {
        expect(title).toHaveClass('text-lg', 'xs:text-xl');
        expect(title).toHaveClass('mb-2', 'xs:mb-3');
        expect(title).toHaveClass('leading-tight');
      });
      
      // Check service descriptions
      en.services.items.forEach(service => {
        const description = screen.getByText(service.description);
        expect(description).toHaveClass('text-sm', 'xs:text-base', 'leading-relaxed');
      });
    });

    it('applies responsive spacing to icon containers', () => {
      renderWithLanguage();
      
      const iconContainerWrappers = screen.getAllByRole('article').map(card => 
        card.querySelector('div:first-child')
      );
      
      iconContainerWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('mb-3', 'xs:mb-4');
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('provides proper semantic structure with ARIA attributes', () => {
      renderWithLanguage();
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('id', 'services');
      
      const serviceCards = screen.getAllByRole('article');
      expect(serviceCards).toHaveLength(en.services.items.length);
    });

    it('assigns unique IDs and proper labeling to service titles', () => {
      renderWithLanguage();
      
      const serviceTitles = screen.getAllByRole('heading', { level: 3 });
      serviceTitles.forEach((title, index) => {
        expect(title).toHaveAttribute('id', `service-${index}-title`);
      });
      
      const serviceCards = screen.getAllByRole('article');
      serviceCards.forEach((card, index) => {
        expect(card).toHaveAttribute('aria-labelledby', `service-${index}-title`);
      });
    });

    it('includes proper focus management for interactive elements', () => {
      renderWithLanguage();
      
      const serviceCards = screen.getAllByRole('article');
      serviceCards.forEach(card => {
        expect(card).toHaveClass(
          'focus-within:ring-2',
          'focus-within:ring-foreground/20',
          'focus-within:ring-offset-2',
          'focus-within:ring-offset-muted'
        );
      });
    });

    it('hides decorative icons from screen readers', () => {
      renderWithLanguage();
      
      const icons = screen.getAllByRole('article').map(card => 
        card.querySelector('svg')
      );
      
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('maintains proper heading hierarchy', () => {
      renderWithLanguage();
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent(en.services.title);
      
      const serviceHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(serviceHeadings).toHaveLength(en.services.items.length);
    });
  });

  describe('Content and Layout Stability', () => {
    it('renders all expected service items with correct content', () => {
      renderWithLanguage();
      
      en.services.items.forEach((service) => {
        expect(screen.getByText(service.title)).toBeInTheDocument();
        expect(screen.getByText(service.description)).toBeInTheDocument();
      });
    });

    it('maintains consistent card styling and hover effects', () => {
      renderWithLanguage();
      
      const serviceCards = screen.getAllByRole('article');
      serviceCards.forEach(card => {
        expect(card).toHaveClass(
          'bg-background',
          'rounded-lg',
          'border',
          'border-border',
          'hover:shadow-lg',
          'transition-all',
          'duration-300',
          'group'
        );
      });
    });

    it('applies proper hover animations to icon containers', () => {
      renderWithLanguage();
      
      const iconContainers = screen.getAllByRole('article').map(card => 
        card.querySelector('div > div')
      );
      
      iconContainers.forEach(container => {
        expect(container).toHaveClass(
          'group-hover:scale-110',
          'transition-transform',
          'duration-300'
        );
      });
    });

    it('maintains proper container constraints and centering', () => {
      renderWithLanguage();
      
      const subtitle = screen.getByText(en.services.subtitle);
      expect(subtitle).toHaveClass('max-w-2xl', 'mx-auto');
    });
  });

  describe('German Language Support', () => {
    it('renders correctly with German content', () => {
      renderWithLanguage('de');
      
      expect(screen.getByText(de.services.title)).toBeInTheDocument();
      expect(screen.getByText(de.services.subtitle)).toBeInTheDocument();
      
      de.services.items.forEach(service => {
        expect(screen.getByText(service.title)).toBeInTheDocument();
        expect(screen.getByText(service.description)).toBeInTheDocument();
      });
    });

    it('maintains layout stability with German text expansion', () => {
      renderWithLanguage('de');
      
      const serviceTitles = screen.getAllByRole('heading', { level: 3 });
      serviceTitles.forEach(title => {
        expect(title).toHaveClass('leading-tight');
      });
      
      // Verify descriptions maintain proper line height
      de.services.items.forEach(service => {
        const description = screen.getByText(service.description);
        expect(description).toHaveClass('leading-relaxed');
      });
    });

    it('provides consistent responsive behavior across languages', () => {
      // Test English layout
      renderWithLanguage('en');
      let gridContainer = screen.getByRole('heading', { level: 2 }).parentElement?.querySelector('div:last-child');
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
      
      // Test German layout  
      renderWithLanguage('de');
      gridContainer = screen.getByRole('heading', { level: 2 }).parentElement?.querySelector('div:last-child');
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
    });
  });

  describe('Performance and Animation', () => {
    it('uses efficient CSS classes for animations', () => {
      renderWithLanguage();
      
      const serviceCards = screen.getAllByRole('article');
      serviceCards.forEach(card => {
        expect(card).toHaveClass('transition-all', 'duration-300');
      });
    });

    it('applies proper transform animations without JavaScript dependencies', () => {
      renderWithLanguage();
      
      const iconContainers = screen.getAllByRole('article').map(card => 
        card.querySelector('div > div')
      );
      
      iconContainers.forEach(container => {
        expect(container).toHaveClass('transition-transform');
      });
    });

    it('maintains semantic structure for optimal rendering', () => {
      renderWithLanguage();
      
      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
      
      const articles = screen.getAllByRole('article');
      articles.forEach(article => {
        expect(article.tagName).toBe('DIV');
        expect(article).toHaveAttribute('role', 'article');
      });
    });
  });
});