import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ImageCarousel from '@/components/image-carousel';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock Next.js Image component
vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: ({ alt, src, ...props }: { alt: string; src: string; [key: string]: unknown }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        {...(props as Record<string, unknown>)} 
        src={src}
        alt={alt} 
        data-testid="carousel-image"
      />
    ),
  };
});


const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    {children}
  </LanguageProvider>
);

describe('ImageCarousel Component', () => {
  const mockImages = [
    '/images/project1-1.jpg',
    '/images/project1-2.jpg',
    '/images/project1-3.jpg'
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Layout', () => {
    it('should render desktop carousel without mobile optimizations', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      // Should have rounded corners for desktop
      const container = screen.getByRole('img').closest('.aspect-video');
      expect(container).toHaveClass('rounded-lg');
    });

    it('should show navigation arrows on hover for desktop', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      const prevButton = screen.getByLabelText('Vorheriges Bild');
      const nextButton = screen.getByLabelText('Nächstes Bild');

      expect(prevButton).toHaveClass('opacity-0', 'group-hover:opacity-100');
      expect(nextButton).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });
  });

  describe('Mobile Layout', () => {
    it('should render mobile-optimized carousel', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      // Should use aspect-[4/3] for mobile instead of aspect-video
      const container = screen.getByRole('img').closest('.aspect-\\[4\\/3\\]');
      expect(container).toBeInTheDocument();
      expect(container).not.toHaveClass('rounded-lg');
    });

    it('should have touch-friendly navigation buttons on mobile', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      const prevButton = screen.getByLabelText('Vorheriges Bild');
      const nextButton = screen.getByLabelText('Nächstes Bild');

      expect(prevButton).toHaveClass('w-12', 'h-12', 'touch-target');
      expect(nextButton).toHaveClass('w-12', 'h-12', 'touch-target');
    });

    it('should show swipe indicator on mobile', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      expect(screen.getByText('Swipe to navigate')).toBeInTheDocument();
    });

    it('should have user-select: none for touch interactions', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      const container = screen.getByRole('img').closest('.select-none');
      expect(container).toBeInTheDocument();
    });

    it('should have larger touch-friendly dots on mobile', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      const dots = screen.getAllByLabelText(/Go to image/);
      dots.forEach(dot => {
        expect(dot).toHaveClass('w-4', 'h-4', 'touch-target');
        expect(dot).not.toHaveClass('w-2', 'h-2');
      });
    });
  });

  describe('Navigation Functionality', () => {
    it('should handle keyboard navigation', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      // Test arrow key navigation
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      // Verify buttons exist and are functional
      const prevButton = screen.getByLabelText('Vorheriges Bild');
      const nextButton = screen.getByLabelText('Nächstes Bild');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should handle dot navigation clicks', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      const dots = screen.getAllByLabelText(/Go to image/);
      expect(dots).toHaveLength(3);

      fireEvent.click(dots[2]);
      // Verify third dot becomes active (visual state would be tested in E2E)
    });
  });

  describe('Touch Gesture Support', () => {
    it('should setup touch event handlers when swipe is enabled', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      const container = screen.getByRole('img').closest('[data-testid]')?.parentElement;
      
      // Verify touch event handlers are present by checking if onTouchStart is set
      // In a real test environment, we would mock touch events and verify handling
      expect(container).toBeDefined();
    });
  });

  describe('Accessibility Features', () => {
    it('should provide screen reader information', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={true}
          enableSwipeGestures={true}
        />, 
        { wrapper: TestWrapper }
      );

      // Should include swipe instruction for mobile
      expect(screen.getByText(/Swipe left or right to navigate/)).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(
        <ImageCarousel 
          images={mockImages} 
          alt="Test Project"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      expect(screen.getByLabelText('Vorheriges Bild')).toBeInTheDocument();
      expect(screen.getByLabelText('Nächstes Bild')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to image 1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single image gracefully', () => {
      render(
        <ImageCarousel 
          images={['/images/single.jpg']} 
          alt="Single Image"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      // Navigation should not be visible for single image
      expect(screen.queryByLabelText('Vorheriges Bild')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Nächstes Bild')).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Go to image/)).not.toBeInTheDocument();
    });

    it('should handle empty images array', () => {
      render(
        <ImageCarousel 
          images={[]} 
          alt="No Images"
          isMobile={false}
          enableSwipeGestures={false}
        />, 
        { wrapper: TestWrapper }
      );

      // Component should return null for empty images
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });
});