/**
 * Responsive utility functions for mobile-first responsive design
 * Provides core utilities for breakpoint detection, device analysis,
 * and responsive value calculations
 */

import type {
  BreakpointConfig,
  BreakpointKey,
  DeviceInfo,
  GetBreakpointValue,
  IsBreakpointActive,
  GetResponsiveValue,
  ResponsiveError,
} from '@/types/responsive';

// Default breakpoint configuration matching Tailwind CSS defaults
export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Breakpoint order for mobile-first approach
export const BREAKPOINT_ORDER: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Convert breakpoint string value to number (pixels)
 */
export const getBreakpointValue: GetBreakpointValue = (breakpoint: BreakpointKey): number => {
  const value = DEFAULT_BREAKPOINTS[breakpoint];
  return parseInt(value, 10) || 0;
};

/**
 * Check if a breakpoint is currently active based on viewport width
 */
export const isBreakpointActive: IsBreakpointActive = (
  breakpoint: BreakpointKey,
  width: number
): boolean => {
  const breakpointValue = getBreakpointValue(breakpoint);
  const nextBreakpointIndex = BREAKPOINT_ORDER.indexOf(breakpoint) + 1;
  
  if (nextBreakpointIndex >= BREAKPOINT_ORDER.length) {
    // Last breakpoint, no upper bound
    return width >= breakpointValue;
  }
  
  const nextBreakpointValue = getBreakpointValue(BREAKPOINT_ORDER[nextBreakpointIndex]);
  return width >= breakpointValue && width < nextBreakpointValue;
};

/**
 * Get the current active breakpoint based on viewport width
 */
export const getCurrentBreakpoint = (width: number): BreakpointKey => {
  // Start from largest breakpoint and work down (mobile-first)
  for (let i = BREAKPOINT_ORDER.length - 1; i >= 0; i--) {
    const breakpoint = BREAKPOINT_ORDER[i];
    const breakpointValue = getBreakpointValue(breakpoint);
    
    if (width >= breakpointValue) {
      return breakpoint;
    }
  }
  
  return 'xs'; // Default to smallest breakpoint
};

/**
 * Check if viewport is at least the specified breakpoint
 */
export const isAtLeastBreakpoint = (
  targetBreakpoint: BreakpointKey,
  currentWidth: number
): boolean => {
  const targetValue = getBreakpointValue(targetBreakpoint);
  return currentWidth >= targetValue;
};

/**
 * Check if viewport is at most the specified breakpoint
 */
export const isAtMostBreakpoint = (
  targetBreakpoint: BreakpointKey,
  currentWidth: number
): boolean => {
  const nextBreakpointIndex = BREAKPOINT_ORDER.indexOf(targetBreakpoint) + 1;
  
  if (nextBreakpointIndex >= BREAKPOINT_ORDER.length) {
    // Last breakpoint, always true
    return true;
  }
  
  const nextBreakpointValue = getBreakpointValue(BREAKPOINT_ORDER[nextBreakpointIndex]);
  return currentWidth < nextBreakpointValue;
};

/**
 * Get responsive value based on current breakpoint with mobile-first fallback
 */
export const getResponsiveValue: GetResponsiveValue = <T>(
  values: Partial<Record<BreakpointKey, T>>,
  currentBreakpoint: BreakpointKey
): T | undefined => {
  const currentIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint);
  
  // Look for value at current breakpoint or fallback to smaller breakpoints
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = BREAKPOINT_ORDER[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return undefined;
};

/**
 * Detect device capabilities and characteristics
 */
export const getDeviceInfo = (): DeviceInfo => {
  // Server-side rendering safety
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
      orientation: 'landscape',
      pixelRatio: 1,
      supportsHover: true,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Device classification based on viewport size
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Touch capability detection
  const hasTouch = 'ontouchstart' in window || (navigator?.maxTouchPoints && navigator.maxTouchPoints > 0) || false;
  
  // Orientation detection
  const orientation = height > width ? 'portrait' : 'landscape';
  
  // Pixel ratio for high-DPI displays
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Hover capability detection
  const supportsHover = window.matchMedia ? window.matchMedia('(hover: hover)').matches : true;

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    orientation,
    pixelRatio,
    supportsHover,
  };
};

/**
 * Check if browser supports container queries
 */
export const supportsContainerQueries = (): boolean => {
  if (typeof window === 'undefined' || !window.CSS) {
    return false;
  }
  
  return CSS.supports('container-type', 'inline-size');
};

/**
 * Create a debounced function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Get viewport dimensions safely (SSR-compatible)
 */
export const getViewportDimensions = (): { width: number; height: number } => {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 }; // Default dimensions for SSR
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Calculate aspect ratio from dimensions
 */
export const calculateAspectRatio = (width: number, height: number): number => {
  if (height === 0) return 0;
  return Number((width / height).toFixed(2));
};

/**
 * Convert pixel value to rem based on root font size
 */
export const pxToRem = (px: number, rootFontSize: number = 16): string => {
  return `${px / rootFontSize}rem`;
};

/**
 * Convert rem value to pixels based on root font size
 */
export const remToPx = (rem: number, rootFontSize: number = 16): number => {
  return rem * rootFontSize;
};

/**
 * Get optimal image dimensions for current viewport
 */
export const getOptimalImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number
): { width: number; height: number } => {
  const viewport = getViewportDimensions();
  const targetWidth = maxWidth || viewport.width;
  
  if (originalWidth <= targetWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const aspectRatio = originalHeight / originalWidth;
  const scaledHeight = Math.round(targetWidth * aspectRatio);
  
  return {
    width: targetWidth,
    height: scaledHeight,
  };
};

/**
 * Create responsive error with fallback handling
 */
export const createResponsiveError = (
  type: ResponsiveError['type'],
  message: string,
  fallback?: () => void
): ResponsiveError => {
  return {
    type,
    message,
    fallback,
  };
};

/**
 * Handle responsive errors gracefully
 */
export const handleResponsiveError = (error: ResponsiveError): void => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Responsive System Error: ${error.type} - ${error.message}`);
  }
  
  // Execute fallback if provided
  if (error.fallback) {
    try {
      error.fallback();
    } catch (fallbackError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Responsive fallback failed:', fallbackError);
      }
    }
  }
};

/**
 * Check if device is likely low-powered (for performance optimization)
 */
export const isLowPoweredDevice = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  // Check for device memory (if available)
  const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (deviceMemory && deviceMemory <= 2) {
    return true;
  }
  
  // Check for hardware concurrency (CPU cores)
  const hardwareConcurrency = navigator.hardwareConcurrency;
  if (hardwareConcurrency && hardwareConcurrency <= 2) {
    return true;
  }
  
  // Check connection (if available)
  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
  if (connection && connection.effectiveType === 'slow-2g') {
    return true;
  }
  
  return false;
};

/**
 * Get reduced motion preference
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Validate breakpoint key
 */
export const isValidBreakpoint = (breakpoint: string): breakpoint is BreakpointKey => {
  return BREAKPOINT_ORDER.includes(breakpoint as BreakpointKey);
};

/**
 * Get touch-friendly minimum size based on device
 */
export const getTouchTargetSize = (deviceInfo: DeviceInfo): number => {
  if (!deviceInfo.hasTouch) {
    return 32; // Regular click target
  }
  
  // iOS and Android guidelines recommend 44px minimum
  return deviceInfo.isMobile ? 44 : 36;
};