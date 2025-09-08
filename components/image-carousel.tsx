'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  isMobile?: boolean;
  enableSwipeGestures?: boolean;
}

export default function ImageCarousel({ 
  images, 
  alt, 
  isMobile = false, 
  enableSwipeGestures = false 
}: ImageCarouselProps) {
  const { dictionary } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  // Handle swipe gestures for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    touchStartX.current = e.targetTouches[0].clientX;
  }, [enableSwipeGestures]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    touchEndX.current = e.targetTouches[0].clientX;
  }, [enableSwipeGestures]);

  const handleTouchEnd = useCallback(() => {
    if (!enableSwipeGestures) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    } else if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  }, [enableSwipeGestures, goToNext, goToPrevious, images.length, minSwipeDistance]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images.length) return null;

  return (
    <div 
      ref={containerRef}
      className={`relative group ${
        isMobile ? 'select-none' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main image display */}
      <div className={`${
        isMobile 
          ? 'aspect-[4/3] bg-muted overflow-hidden'
          : 'aspect-video bg-muted rounded-lg overflow-hidden'
      }`}>
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          sizes={isMobile 
            ? '100vw' 
            : '(max-width: 768px) 100vw, 800px'
          }
          className="object-cover"
          priority={currentIndex === 0}
        />
        
        {/* Mobile swipe indicator */}
        {isMobile && enableSwipeGestures && images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 text-white text-xs rounded-md">
            Swipe to navigate
          </div>
        )}
      </div>

      {/* Navigation arrows - enhanced for mobile */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`${
              isMobile
                ? 'absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white touch-target active:scale-95 transition-all'
                : 'absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70'
            }`}
            aria-label={dictionary.work.previous_image}
          >
            <svg
              className={`${
                isMobile ? 'w-6 h-6' : 'w-5 h-5'
              } mx-auto`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className={`${
              isMobile
                ? 'absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white touch-target active:scale-95 transition-all'
                : 'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70'
            }`}
            aria-label={dictionary.work.next_image}
          >
            <svg
              className={`${
                isMobile ? 'w-6 h-6' : 'w-5 h-5'
              } mx-auto`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator - enhanced for mobile touch */}
      {images.length > 1 && (
        <div className={`${
          isMobile 
            ? 'flex justify-center space-x-3 mt-4 px-4'
            : 'flex justify-center space-x-2 mt-4'
        }`}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${
                isMobile
                  ? 'w-4 h-4 rounded-full touch-target'
                  : 'w-2 h-2 rounded-full'
              } transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-foreground scale-110'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 active:scale-95'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader information and mobile gesture hint */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isMobile && enableSwipeGestures 
          ? `Image ${currentIndex + 1} of ${images.length}. Swipe left or right to navigate.`
          : `Image ${currentIndex + 1} of ${images.length}`
        }
      </div>
    </div>
  );
}
