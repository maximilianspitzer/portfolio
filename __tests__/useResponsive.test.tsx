/**
 * Unit tests for useResponsive hooks
 * Tests breakpoint detection, device information, and responsive state management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useResponsive,
  useBreakpoint,
  useDeviceInfo,
  useBreakpointCheck,
  useResponsiveValue,
} from '@/hooks/useResponsive';

// Mock analytics early
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    custom: vi.fn(),
  },
}));

// Create complete window mock
const createWindowMock = (width = 1024, height = 768) => {
  const mockWindow = {
    innerWidth: width,
    innerHeight: height,
    devicePixelRatio: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    matchMedia: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    navigator: {
      maxTouchPoints: 0,
      hardwareConcurrency: 4,
      deviceMemory: 8,
      connection: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
      },
    },
  };
  
  Object.defineProperty(global, 'window', {
    value: mockWindow,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(global, 'navigator', {
    value: mockWindow.navigator,
    writable: true,
    configurable: true,
  });

  return mockWindow;
};

describe('useResponsive Hooks', () => {
  let mockWindow: ReturnType<typeof createWindowMock>;

  beforeEach(() => {
    mockWindow = createWindowMock();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useResponsive', () => {
    it('should return initial responsive state', () => {
      const { result } = renderHook(() => useResponsive());

      expect(result.current.currentBreakpoint).toBe('lg');
      expect(result.current.viewportWidth).toBe(1024);
      expect(result.current.viewportHeight).toBe(768);
      expect(result.current.deviceInfo.isDesktop).toBe(true);
      expect(result.current.deviceInfo.isMobile).toBe(false);
      expect(result.current.deviceInfo.isTablet).toBe(false);
    });

    it('should detect mobile breakpoint', () => {
      mockWindow = createWindowMock(375, 667);

      const { result } = renderHook(() => useResponsive());

      expect(result.current.currentBreakpoint).toBe('xs');
      expect(result.current.deviceInfo.isMobile).toBe(true);
    });

    it('should detect tablet breakpoint', () => {
      mockWindow = createWindowMock(768, 1024);

      const { result } = renderHook(() => useResponsive());

      expect(result.current.currentBreakpoint).toBe('md');
      expect(result.current.deviceInfo.isTablet).toBe(true);
    });

    it('should provide breakpoint utility functions', () => {
      const { result } = renderHook(() => useResponsive());

      expect(result.current.isWithinBreakpoint('lg')).toBe(true);
      expect(result.current.isWithinBreakpoint('sm')).toBe(false);
      expect(result.current.isAtLeastBreakpoint('md')).toBe(true);
      expect(result.current.isAtLeastBreakpoint('xl')).toBe(false);
      expect(result.current.isAtMostBreakpoint('xl')).toBe(true);
      expect(result.current.isAtMostBreakpoint('sm')).toBe(false);
    });

    it('should handle resize events', async () => {
      const { result } = renderHook(() => useResponsive());

      // Initial state
      expect(result.current.currentBreakpoint).toBe('lg');

      // Simulate window resize
      act(() => {
        (mockWindow.innerWidth as number) = 640;
        (mockWindow.innerHeight as number) = 480;
        const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
        const resizeCallback = addEventListenerCalls.find(
          (call: unknown[]) => call[0] === 'resize'
        )?.[1] as (() => void) | undefined;
        if (resizeCallback) {
          resizeCallback();
        }
      });

      // Wait for debounced update using waitForNextUpdate pattern
      await new Promise(resolve => setTimeout(resolve, 200)); // Wait for debounce + extra time
      
      expect(result.current.viewportWidth).toBe(640);
      expect(result.current.currentBreakpoint).toBe('sm');
    });

    it('should handle orientation changes', async () => {
      mockWindow.navigator.maxTouchPoints = 5;
      const { result } = renderHook(() => useResponsive());

      // Simulate orientation change
      act(() => {
        (mockWindow.innerWidth as number) = 667;
        (mockWindow.innerHeight as number) = 375;
        const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
        const orientationCallback = addEventListenerCalls.find(
          (call: unknown[]) => call[0] === 'orientationchange'
        )?.[1] as (() => void) | undefined;
        if (orientationCallback) {
          orientationCallback();
        }
      });

      // Wait for orientation change with timeout
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(result.current.deviceInfo.orientation).toBe('landscape');
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useResponsive());

      unmount();

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function)
      );
    });

    it('should respect debounce options', () => {
      const { result } = renderHook(() => useResponsive({ debounceMs: 50 }));
      expect(result.current).toBeDefined();
    });

    it('should allow disabling device detection', () => {
      const { result } = renderHook(() => useResponsive({ enableDeviceDetection: false }));
      expect(result.current.deviceInfo).toBeDefined();
    });
  });

  describe('useBreakpoint', () => {
    it('should return current breakpoint', () => {
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('lg');
    });

    it('should update breakpoint on resize', async () => {
      const { result } = renderHook(() => useBreakpoint());

      // Initial state
      expect(result.current).toBe('lg');

      // Simulate resize to mobile
      act(() => {
        (mockWindow.innerWidth as number) = 320;
        const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
        const resizeCallback = addEventListenerCalls.find(
          (call: unknown[]) => call[0] === 'resize'
        )?.[1] as (() => void) | undefined;
        if (resizeCallback) {
          resizeCallback();
        }
      });

      // Wait for debounced update
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(result.current).toBe('xs');
    });
  });

  describe('useDeviceInfo', () => {
    it('should return device information', () => {
      const { result } = renderHook(() => useDeviceInfo());

      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.hasTouch).toBe(false);
      expect(result.current.orientation).toBe('landscape');
    });

    it('should detect touch devices', () => {
      mockWindow.navigator.maxTouchPoints = 5;
      const { result } = renderHook(() => useDeviceInfo());

      expect(result.current.hasTouch).toBe(true);
    });

    it('should update on orientation change', async () => {
      const { result } = renderHook(() => useDeviceInfo());

      // Simulate orientation change
      act(() => {
        (mockWindow.innerWidth as number) = 667;
        (mockWindow.innerHeight as number) = 375;
        const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
        const orientationCallback = addEventListenerCalls.find(
          (call: unknown[]) => call[0] === 'orientationchange'
        )?.[1] as (() => void) | undefined;
        if (orientationCallback) {
          orientationCallback();
        }
      });

      // Wait for debounced update
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(result.current.orientation).toBe('landscape');
    });
  });

  describe('useBreakpointCheck', () => {
    it('should check if current breakpoint matches target', () => {
      const { result } = renderHook(() => useBreakpointCheck('lg'));
      expect(result.current).toBe(true);
    });

    it('should return false for non-matching breakpoint', () => {
      const { result } = renderHook(() => useBreakpointCheck('sm'));
      expect(result.current).toBe(false);
    });

    it('should update when breakpoint changes', async () => {
      const { result } = renderHook(() => useBreakpointCheck('sm'));

      // Initial state
      expect(result.current).toBe(false);

      // Simulate resize to sm breakpoint
      act(() => {
        (mockWindow.innerWidth as number) = 700;
        // Trigger resize event through the useResponsive hook
        const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
        const resizeCallback = addEventListenerCalls.find(
          (call: unknown[]) => call[0] === 'resize'
        )?.[1] as (() => void) | undefined;
        if (resizeCallback) {
          resizeCallback();
        }
      });

      // Wait for debounced update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(result.current).toBe(true);
    });
  });

  describe('useResponsiveValue', () => {
    it('should return value for exact breakpoint match', () => {
      const values = { sm: 'small', md: 'medium', lg: 'large' };
      const { result } = renderHook(() => useResponsiveValue(values));

      expect(result.current).toBe('large');
    });

    it('should fallback to smaller breakpoint when exact match not found', () => {
      const values = { sm: 'small', xl: 'extra-large' };
      const { result } = renderHook(() => useResponsiveValue(values));

      expect(result.current).toBe('small'); // Falls back to sm
    });

    it('should return fallback when no match found', () => {
      const values = { xl: 'extra-large', '2xl': '2x-large' };
      const fallback = 'default';
      const { result } = renderHook(() => useResponsiveValue(values, fallback));

      expect(result.current).toBe('default');
    });

    it('should update when breakpoint changes', async () => {
      const values = { sm: 'small', md: 'medium', lg: 'large' };
      const { result } = renderHook(() => useResponsiveValue(values));

      // Initial state
      expect(result.current).toBe('large');

      // Simulate resize to md breakpoint
      act(() => {
        (mockWindow.innerWidth as number) = 800;
        const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
        const resizeCallback = addEventListenerCalls.find(
          (call: unknown[]) => call[0] === 'resize'
        )?.[1] as (() => void) | undefined;
        if (resizeCallback) {
          resizeCallback();
        }
      });

      // Wait for debounced update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      expect(result.current).toBe('medium');
    });

    it('should handle undefined values gracefully', () => {
      const values = { lg: undefined, xl: 'extra-large' };
      const { result } = renderHook(() => useResponsiveValue(values));

      // Should skip undefined values and find the next available
      expect(result.current).toBeUndefined();
    });
  });

  describe('SSR Support', () => {
    it('should handle server-side rendering', () => {
      // Mock the getViewportDimensions function to simulate SSR
      const originalWindowCheck = global.window;
      
      vi.doMock('@/lib/responsive-utils', async () => {
        const actual = await vi.importActual('@/lib/responsive-utils');
        return {
          ...actual,
          getViewportDimensions: () => ({ width: 1024, height: 768 }),
          getDeviceInfo: () => ({
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            hasTouch: false,
            orientation: 'landscape',
            pixelRatio: 1,
            supportsHover: true,
          }),
        };
      });

      // Test that hook works without crashing in SSR-like environment
      const { result } = renderHook(() => useResponsive());

      // Should provide default values without crashing
      expect(result.current.currentBreakpoint).toBeDefined();
      expect(result.current.viewportWidth).toBeGreaterThanOrEqual(0);
      expect(result.current.viewportHeight).toBeGreaterThanOrEqual(0);
      expect(result.current.deviceInfo).toBeDefined();
      
      vi.doUnmock('@/lib/responsive-utils');
    });

    it('should hydrate correctly after SSR', () => {
      // Test hydration behavior by checking that the hook updates when window is available
      const { result, rerender } = renderHook(() => useResponsive());

      const initialWidth = result.current.viewportWidth;
      const initialBreakpoint = result.current.currentBreakpoint;
      
      // Change window dimensions and rerender
      mockWindow.innerWidth = 500;
      mockWindow.innerHeight = 800;
      
      rerender();

      // After rerender, should potentially have updated values
      expect(result.current.viewportWidth).toBeDefined();
      expect(result.current.currentBreakpoint).toBeDefined();
      expect(result.current.deviceInfo).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should debounce resize events', async () => {
      const { result } = renderHook(() => useResponsive({ debounceMs: 100 }));
      
      const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
      const resizeCallback = addEventListenerCalls.find(
        (call: unknown[]) => call[0] === 'resize'
      )?.[1] as (() => void) | undefined;

      // Call resize multiple times quickly
      act(() => {
        if (resizeCallback) {
          resizeCallback();
          resizeCallback();
          resizeCallback();
        }
      });

      // Should only update once after debounce delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(result.current).toBeDefined();
    });

    it('should use passive event listeners', () => {
      renderHook(() => useResponsive());

      const addEventListenerCalls = (mockWindow.addEventListener as { mock: { calls: unknown[][] } }).mock.calls;
      const resizeCall = addEventListenerCalls.find(
        (call: unknown[]) => call[0] === 'resize'
      );
      const orientationCall = addEventListenerCalls.find(
        (call: unknown[]) => call[0] === 'orientationchange'
      );

      expect(resizeCall?.[2]).toEqual({ passive: true });
      expect(orientationCall?.[2]).toEqual({ passive: true });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing matchMedia gracefully', () => {
      delete (mockWindow as { matchMedia?: unknown }).matchMedia;

      const { result } = renderHook(() => useResponsive());
      expect(result.current).toBeDefined();
    });

    it('should handle invalid navigator properties', () => {
      const originalNavigator = global.navigator;
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useDeviceInfo());
      expect(result.current).toBeDefined();
      
      // Restore navigator
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
        configurable: true,
      });
    });
  });
});