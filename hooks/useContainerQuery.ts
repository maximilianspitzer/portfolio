'use client';

/**
 * useContainerQuery Hook - Container-based responsive design
 * 
 * Provides component-scoped responsive behavior using ResizeObserver.
 * Includes fallback support for browsers without container query support
 * and graceful degradation to viewport-based queries.
 * 
 * Features:
 * - ResizeObserver-based container dimension tracking
 * - Automatic fallback to media queries when needed
 * - Performance optimized with debounced resize handling
 * - TypeScript support with comprehensive type definitions
 * - Error handling with graceful degradation
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  supportsContainerQueries,
  calculateAspectRatio,
  debounce,
  createResponsiveError,
  handleResponsiveError,
} from '@/lib/responsive-utils';
import type {
  ContainerDimensions,
  UseContainerQueryOptions,
  ResponsiveError,
} from '@/types/responsive';

// Default container query breakpoints
const DEFAULT_QUERIES = {
  small: '400px',
  medium: '800px',
  large: '1200px',
};

/**
 * Custom hook for container queries with ResizeObserver
 */
export const useContainerQuery = (
  options: UseContainerQueryOptions = {}
): {
  containerRef: React.RefObject<HTMLElement | null>;
  dimensions: ContainerDimensions;
  isSupported: boolean;
  error: ResponsiveError | null;
} => {
  const {
    fallback = 'media-query',
    debounceMs = 100,
    queries = DEFAULT_QUERIES,
  } = options;

  // Ref to track the container element
  const containerRef = useRef<HTMLElement>(null);
  
  // State for container dimensions
  const [dimensions, setDimensions] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
    isSmall: false,
    isMedium: false,
    isLarge: false,
    aspectRatio: 0,
  });
  
  // Track feature support and errors
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<ResponsiveError | null>(null);

  // ResizeObserver ref
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Parse query values to numbers
  const queryValues = useMemo(() => ({
    small: parseInt(queries.small || DEFAULT_QUERIES.small, 10),
    medium: parseInt(queries.medium || DEFAULT_QUERIES.medium, 10),
    large: parseInt(queries.large || DEFAULT_QUERIES.large, 10),
  }), [queries]);

  // Calculate container state based on dimensions
  const calculateContainerState = useCallback((width: number, height: number): ContainerDimensions => {
    const aspectRatio = calculateAspectRatio(width, height);
    
    return {
      width,
      height,
      isSmall: width < queryValues.small,
      isMedium: width >= queryValues.small && width < queryValues.medium,
      isLarge: width >= queryValues.medium,
      aspectRatio,
    };
  }, [queryValues]);

  // Debounced resize handler
  const handleResize = useMemo(() => 
    debounce((...args: unknown[]) => {
      const entries = args[0] as ResizeObserverEntry[];
      if (!entries || entries.length === 0) return;

      const entry = entries[0];
      const { width, height } = entry.contentRect;
      
      const newDimensions = calculateContainerState(width, height);
      
      setDimensions(prevDimensions => {
        // Track container size changes for analytics
        if (prevDimensions.width !== width || prevDimensions.height !== height) {
          trackPortfolioEvent.custom('container_resize', {
            previous_width: prevDimensions.width,
            previous_height: prevDimensions.height,
            new_width: width,
            new_height: height,
            aspect_ratio: newDimensions.aspectRatio,
            is_small: newDimensions.isSmall,
            is_medium: newDimensions.isMedium,
            is_large: newDimensions.isLarge,
            timestamp: Date.now(),
          });
        }
        
        return newDimensions;
      });
    }, debounceMs),
    [calculateContainerState, debounceMs]
  );

  // Fallback handler for unsupported browsers
  const setupFallback = useCallback(() => {
    if (fallback === 'media-query') {
      // Use viewport dimensions as fallback
      const updateFromViewport = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDimensions(calculateContainerState(width, height));
      };

      updateFromViewport();
      
      const debouncedUpdate = debounce(updateFromViewport, debounceMs);
      window.addEventListener('resize', debouncedUpdate, { passive: true });
      
      return () => {
        window.removeEventListener('resize', debouncedUpdate);
      };
    } else {
      // JavaScript-based fallback
      const updateFromContainer = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDimensions(calculateContainerState(rect.width, rect.height));
        }
      };

      updateFromContainer();
      
      const debouncedUpdate = debounce(updateFromContainer, debounceMs);
      window.addEventListener('resize', debouncedUpdate, { passive: true });
      
      return () => {
        window.removeEventListener('resize', debouncedUpdate);
      };
    }
  }, [fallback, calculateContainerState, debounceMs]);

  // Setup ResizeObserver
  useEffect(() => {
    // Check for ResizeObserver support
    if (typeof ResizeObserver === 'undefined') {
      const error = createResponsiveError(
        'UNSUPPORTED_FEATURE',
        'ResizeObserver is not supported in this browser',
        setupFallback
      );
      setError(error);
      handleResponsiveError(error);
      setIsSupported(false);
      return;
    }

    // Check for container query support (informational)
    setIsSupported(supportsContainerQueries());

    // Setup ResizeObserver
    resizeObserverRef.current = new ResizeObserver((entries) => handleResize(entries));

    // Observe container when it becomes available
    const observeContainer = () => {
      if (containerRef.current && resizeObserverRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
        
        // Initial measurement
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions(calculateContainerState(rect.width, rect.height));
      } else if (!containerRef.current) {
        // Container not found, set up fallback
        const error = createResponsiveError(
          'CONTAINER_NOT_FOUND',
          'Container element is not available',
          setupFallback
        );
        setError(error);
        handleResponsiveError(error);
      }
    };

    // Delay observation to ensure component is mounted
    const timeoutId = setTimeout(observeContainer, 0);

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [handleResize, calculateContainerState, setupFallback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return {
    containerRef,
    dimensions,
    isSupported,
    error,
  };
};

/**
 * Simplified hook for basic container dimension tracking
 */
export const useContainerDimensions = (
  debounceMs: number = 100
): {
  containerRef: React.RefObject<HTMLElement | null>;
  width: number;
  height: number;
} => {
  const containerRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const updateDimensions = useMemo(() => 
    debounce(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setWidth(rect.width);
        setHeight(rect.height);
      }
    }, debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(updateDimensions);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updateDimensions(); // Initial measurement
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateDimensions]);

  return { containerRef, width, height };
};

/**
 * Hook for container-based breakpoint checking
 */
export const useContainerBreakpoint = (
  breakpoint: number,
  options: { debounceMs?: number } = {}
): {
  containerRef: React.RefObject<HTMLElement | null>;
  isAboveBreakpoint: boolean;
  isBelowBreakpoint: boolean;
} => {
  const { debounceMs = 100 } = options;
  const { containerRef, width } = useContainerDimensions(debounceMs);

  const isAboveBreakpoint = width >= breakpoint;
  const isBelowBreakpoint = width < breakpoint;

  return {
    containerRef,
    isAboveBreakpoint,
    isBelowBreakpoint,
  };
};

/**
 * Hook for container aspect ratio tracking
 */
export const useContainerAspectRatio = (
  debounceMs: number = 100
): {
  containerRef: React.RefObject<HTMLElement | null>;
  aspectRatio: number;
  isLandscape: boolean;
  isPortrait: boolean;
  isSquare: boolean;
} => {
  const { containerRef, width, height } = useContainerDimensions(debounceMs);

  const aspectRatio = useMemo(() => calculateAspectRatio(width, height), [width, height]);
  
  const isLandscape = aspectRatio > 1.1;
  const isPortrait = aspectRatio < 0.9;
  const isSquare = aspectRatio >= 0.9 && aspectRatio <= 1.1;

  return {
    containerRef,
    aspectRatio,
    isLandscape,
    isPortrait,
    isSquare,
  };
};