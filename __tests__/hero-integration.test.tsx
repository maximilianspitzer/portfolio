import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Hero from '@/components/hero';

// Mock the context and hooks
const mockDictionary = {
  hero: {
    headline: 'Test Headline',
    subhead: 'Test Subhead',
    cta_primary: 'View Work',
    cta_secondary: 'Get in Touch',
  },
};

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    dictionary: mockDictionary,
  }),
}));

vi.mock('@/hooks/useAnalyticsTracking', () => ({
  useSectionTracking: () => null,
}));

vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    heroCtaClick: vi.fn(),
  },
}));

// Mock ParticlesBackground component
vi.mock('@/components/particles-background', () => ({
  default: ({ className = '', ...props }: Record<string, unknown>) => (
    <div
      data-testid="particles-background"
      className={`particles-mock ${className}`}
      {...props}
    >
      Particles Background Mock
    </div>
  ),
}));

// Mock tsParticles modules to avoid initialization issues in tests
vi.mock('@tsparticles/react', () => ({
  Particles: ({ id }: { id: string }) => (
    <div data-testid={`particles-${id}`} />
  ),
  initParticlesEngine: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/particles-utils', () => ({
  shouldEnableParticles: vi.fn().mockReturnValue(true),
}));

describe('Hero Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Structure and Layout', () => {
    it('should render hero section with proper structure', () => {
      const { container } = render(<Hero />);

      const heroSection = container.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
      expect(screen.getByText('Test Headline')).toBeInTheDocument();
      expect(screen.getByText('Test Subhead')).toBeInTheDocument();
    });

    it('should include particles background component', () => {
      render(<Hero />);

      expect(screen.getByTestId('particles-background')).toBeInTheDocument();
    });

    it('should have proper CSS layering with particles behind content', () => {
      const { container } = render(<Hero />);

      const heroSection = container.querySelector('section');
      expect(heroSection).toHaveClass('relative');

      const particlesBackground = screen.getByTestId('particles-background');
      expect(particlesBackground).toBeInTheDocument();

      // Content should have relative z-index positioning
      const contentDiv = container.querySelector('.relative.z-10');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should maintain responsive layout classes', () => {
      const { container } = render(<Hero />);

      const heroSection = container.querySelector('section');
      expect(heroSection).toHaveClass(
        'relative',
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center',
        'bg-background',
        'overflow-hidden'
      );
    });
  });

  describe('Content Rendering', () => {
    it('should display content from language context', () => {
      render(<Hero />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Test Headline'
      );
      expect(screen.getByText('Test Subhead')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'View Work' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Get in Touch' })
      ).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Test Headline');
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl');
    });

    it('should have proper button styling and accessibility', () => {
      render(<Hero />);

      const primaryButton = screen.getByRole('button', { name: 'View Work' });
      const secondaryButton = screen.getByRole('button', {
        name: 'Get in Touch',
      });

      expect(primaryButton).toHaveClass(
        'px-8',
        'py-3',
        'bg-foreground',
        'text-background'
      );
      expect(secondaryButton).toHaveClass(
        'px-8',
        'py-3',
        'border',
        'border-border'
      );
    });
  });

  describe('Interactive Functionality', () => {
    it('should handle primary CTA click and scroll to work section', () => {
      // Mock getElementById to return a mock element
      const mockWorkElement = { scrollIntoView: vi.fn() };
      vi.spyOn(document, 'getElementById').mockReturnValue(
        mockWorkElement as unknown as HTMLElement
      );

      render(<Hero />);

      const primaryButton = screen.getByRole('button', { name: 'View Work' });
      fireEvent.click(primaryButton);

      expect(document.getElementById).toHaveBeenCalledWith('work');
      expect(mockWorkElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    });

    it('should handle secondary CTA click and scroll to contact section', () => {
      const mockContactElement = { scrollIntoView: vi.fn() };
      vi.spyOn(document, 'getElementById').mockReturnValue(
        mockContactElement as unknown as HTMLElement
      );

      render(<Hero />);

      const secondaryButton = screen.getByRole('button', {
        name: 'Get in Touch',
      });
      fireEvent.click(secondaryButton);

      expect(document.getElementById).toHaveBeenCalledWith('contact');
      expect(mockContactElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      });
    });

    it('should track analytics events for CTA clicks', async () => {
      const mockWorkElement = { scrollIntoView: vi.fn() };
      const mockContactElement = { scrollIntoView: vi.fn() };

      vi.spyOn(document, 'getElementById').mockImplementation((id) => {
        if (id === 'work') return mockWorkElement as unknown as HTMLElement;
        if (id === 'contact')
          return mockContactElement as unknown as HTMLElement;
        return null;
      });

      const { trackPortfolioEvent } = await import('@/lib/analytics');

      render(<Hero />);

      // Test primary CTA
      const primaryButton = screen.getByRole('button', { name: 'View Work' });
      fireEvent.click(primaryButton);
      expect(trackPortfolioEvent.heroCtaClick).toHaveBeenCalledWith(
        'view_work'
      );

      // Test secondary CTA
      const secondaryButton = screen.getByRole('button', {
        name: 'Get in Touch',
      });
      fireEvent.click(secondaryButton);
      expect(trackPortfolioEvent.heroCtaClick).toHaveBeenCalledWith('contact');
    });
  });

  describe('Particles Background Integration', () => {
    it('should render particles background with default props', () => {
      render(<Hero />);

      const particlesBackground = screen.getByTestId('particles-background');
      expect(particlesBackground).toBeInTheDocument();
      expect(particlesBackground).toHaveClass('particles-mock');
    });

    it('should not interfere with content interaction', async () => {
      const mockElement = { scrollIntoView: vi.fn() };
      vi.spyOn(document, 'getElementById').mockReturnValue(
        mockElement as unknown as HTMLElement
      );

      render(<Hero />);

      // Particles should be present
      expect(screen.getByTestId('particles-background')).toBeInTheDocument();

      // But buttons should still be clickable
      const primaryButton = screen.getByRole('button', { name: 'View Work' });
      fireEvent.click(primaryButton);

      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });

    it('should maintain proper z-index layering', () => {
      const { container } = render(<Hero />);

      // Hero section should be relative
      const heroSection = container.querySelector('section');
      expect(heroSection).toHaveClass('relative');

      // Content should have z-10
      const contentDiv = container.querySelector('.relative.z-10');
      expect(contentDiv).toBeInTheDocument();

      // Particles should be present (z-index handled by particles component)
      expect(screen.getByTestId('particles-background')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should maintain responsive button layout', () => {
      const { container } = render(<Hero />);

      const buttonContainer = container.querySelector(
        '.flex.flex-col.sm\\:flex-row'
      );
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass(
        'gap-4',
        'justify-center',
        'items-center'
      );
    });

    it('should have responsive typography classes', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl');

      const subhead = screen.getByText('Test Subhead');
      expect(subhead).toHaveClass('text-lg', 'md:text-xl');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<Hero />);

      // Should have main heading
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      // Should have interactive buttons
      expect(
        screen.getByRole('button', { name: 'View Work' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Get in Touch' })
      ).toBeInTheDocument();
    });

    it('should have proper focus management', () => {
      render(<Hero />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeVisible();
        button.focus();
        expect(button).toHaveFocus();
      });
    });

    it('should work with particles background accessibility features', () => {
      render(<Hero />);

      // Particles should be present and not interfere with accessibility
      const particlesBackground = screen.getByTestId('particles-background');
      expect(particlesBackground).toBeInTheDocument();

      // Content should still be accessible
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();
      expect(heading).toHaveAccessibleName('Test Headline');
    });
  });

  describe('Animation and Styling', () => {
    it('should have animation classes for content', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('animate-fade-in');

      const subhead = screen.getByText('Test Subhead');
      expect(subhead).toHaveClass('animate-fade-in-delay');

      const { container } = render(<Hero />);
      const buttonContainer = container.querySelector('.animate-slide-up');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should have hover effects on buttons', () => {
      render(<Hero />);

      const primaryButton = screen.getByRole('button', { name: 'View Work' });
      expect(primaryButton).toHaveClass(
        'hover:bg-foreground/90',
        'transition-all',
        'hover:scale-105'
      );

      const secondaryButton = screen.getByRole('button', {
        name: 'Get in Touch',
      });
      expect(secondaryButton).toHaveClass(
        'hover:bg-accent',
        'transition-all',
        'hover:scale-105'
      );
    });
  });
});
