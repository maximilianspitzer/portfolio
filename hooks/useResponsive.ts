'use client';

/**
 * useResponsive Hook - Mobile-first responsive design utilities
 * 
 * Provides comprehensive breakpoint detection, device information,
 * and responsive state management for React components.
 * 
 * Features:
 * - Mobile-first breakpoint detection
 * - Device capability detection (touch, hover, etc.)
 * - Performance optimized with debounced resize handling
 * - SSR-safe with proper hydration
 * - Analytics integration for responsive events
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackPortfolioEvent } from '@/lib/analytics';
import {
  getCurrentBreakpoint,
  getDeviceInfo,
  isAtLeastBreakpoint,
  isAtMostBreakpoint,
  getViewportDimensions,
  debounce,
} from '@/lib/responsive-utils';
import type {
  ResponsiveState,
  BreakpointKey,
  DeviceInfo,
  UseResponsiveOptions,
} from '@/types/responsive';

/**
 * Custom hook for responsive design state management
 */
export const useResponsive = (options: UseResponsiveOptions = {}): ResponsiveState => {
  const {
    debounceMs = 150,
    enableDeviceDetection = true,
  } = options;

  // Initialize state with SSR-safe defaults
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    orientation: 'landscape',
    pixelRatio: 1,
    supportsHover: true,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Calculate current breakpoint
  const currentBreakpoint = useMemo((): BreakpointKey => {
    if (!isHydrated) return 'lg'; // SSR default
    return getCurrentBreakpoint(viewportWidth);
  }, [viewportWidth, isHydrated]);

  // Track breakpoint changes for analytics
  const [previousBreakpoint, setPreviousBreakpoint] = useState<BreakpointKey>(currentBreakpoint);

  // Breakpoint utility functions
  const isWithinBreakpoint = useCallback((breakpoint: BreakpointKey): boolean => {
    if (!isHydrated) return false;
    return currentBreakpoint === breakpoint;
  }, [currentBreakpoint, isHydrated]);

  const isAtLeastBreakpointCallback = useCallback((breakpoint: BreakpointKey): boolean => {
    if (!isHydrated) return false;
    return isAtLeastBreakpoint(breakpoint, viewportWidth);
  }, [viewportWidth, isHydrated]);

  const isAtMostBreakpointCallback = useCallback((breakpoint: BreakpointKey): boolean => {
    if (!isHydrated) return false;
    return isAtMostBreakpoint(breakpoint, viewportWidth);
  }, [viewportWidth, isHydrated]);

  // Handle viewport resize with debouncing
  const handleResize = useMemo(
    () => debounce(() => {
      const dimensions = getViewportDimensions();
      setViewportWidth(dimensions.width);
      setViewportHeight(dimensions.height);

      if (enableDeviceDetection) {
        setDeviceInfo(getDeviceInfo());
      }
    }, debounceMs),
    [debounceMs, enableDeviceDetection]
  );

  // Handle orientation change
  const handleOrientationChange = useCallback(() => {
    // Small delay to ensure viewport dimensions are updated
    setTimeout(() => {
      const dimensions = getViewportDimensions();
      setViewportWidth(dimensions.width);
      setViewportHeight(dimensions.height);
      
      if (enableDeviceDetection) {
        const newDeviceInfo = getDeviceInfo();
        setDeviceInfo(prevInfo => {
          // Track orientation change if it actually changed
          if (prevInfo.orientation !== newDeviceInfo.orientation) {
            trackPortfolioEvent.custom('responsive_orientation_change', {
              from_orientation: prevInfo.orientation,
              to_orientation: newDeviceInfo.orientation,
              viewport_width: dimensions.width,
              viewport_height: dimensions.height,
              timestamp: Date.now(),
            });
          }
          return newDeviceInfo;
        });
      }
    }, 100);
  }, [enableDeviceDetection]);

  // Initialize and setup event listeners
  useEffect(() => {
    // Initial setup on client side
    const dimensions = getViewportDimensions();
    setViewportWidth(dimensions.width);
    setViewportHeight(dimensions.height);
    
    if (enableDeviceDetection) {
      setDeviceInfo(getDeviceInfo());
    }
    
    setIsHydrated(true);

    // Setup event listeners with error handling for test environments
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
      
      // iOS Safari fix for orientation change
      window.addEventListener('load', handleOrientationChange, { passive: true });
    }

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('load', handleOrientationChange);
      }
    };
  }, [handleResize, handleOrientationChange, enableDeviceDetection]);

  // Track breakpoint changes for analytics
  useEffect(() => {
    if (isHydrated && currentBreakpoint !== previousBreakpoint) {
      trackPortfolioEvent.custom('responsive_breakpoint_change', {
        from_breakpoint: previousBreakpoint,
        to_breakpoint: currentBreakpoint,
        viewport_width: viewportWidth,
        viewport_height: viewportHeight,
        device_type: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop',
        has_touch: deviceInfo.hasTouch,
        orientation: deviceInfo.orientation,
        timestamp: Date.now(),
      });
      
      setPreviousBreakpoint(currentBreakpoint);
    }
  }, [currentBreakpoint, previousBreakpoint, viewportWidth, viewportHeight, deviceInfo, isHydrated]);

  // Return responsive state object
  return {
    currentBreakpoint,
    viewportWidth,
    viewportHeight,
    deviceInfo,
    isWithinBreakpoint,
    isAtLeastBreakpoint: isAtLeastBreakpointCallback,
    isAtMostBreakpoint: isAtMostBreakpointCallback,
  };
};

/**
 * Simplified hook for just breakpoint detection (lighter weight)
 */
export const useBreakpoint = (): BreakpointKey => {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>('lg');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const dimensions = getViewportDimensions();
      setBreakpoint(getCurrentBreakpoint(dimensions.width));
    };

    updateBreakpoint();
    setIsHydrated(true);

    const handleResize = debounce(updateBreakpoint, 100);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isHydrated ? breakpoint : 'lg';
};

/**
 * Hook for device-specific information only
 */
export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    orientation: 'landscape',
    pixelRatio: 1,
    supportsHover: true,
  });

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());

    const handleOrientationChange = debounce(() => {
      setDeviceInfo(getDeviceInfo());
    }, 100);

    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    window.addEventListener('resize', handleOrientationChange, { passive: true });

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

/**
 * Hook to check if viewport is at specific breakpoint
 */
export const useBreakpointCheck = (targetBreakpoint: BreakpointKey): boolean => {
  const { isWithinBreakpoint } = useResponsive({ enableDeviceDetection: false });
  return isWithinBreakpoint(targetBreakpoint);
};

/**
 * Hook to get responsive value based on current breakpoint
 */
export const useResponsiveValue = <T>(
  values: Partial<Record<BreakpointKey, T>>,
  fallback?: T
): T | undefined => {
  const { currentBreakpoint } = useResponsive({ enableDeviceDetection: false });
  
  return useMemo(() => {
    // Look for value at current breakpoint or fallback to smaller breakpoints
    const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }
    
    return fallback;
  }, [values, currentBreakpoint, fallback]);
};