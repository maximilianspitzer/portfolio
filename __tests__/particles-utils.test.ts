import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  supportsCanvas,
  supportsWebGL,
  prefersReducedMotion,
  prefersHighContrast,
  isMobileDevice,
  getDeviceCapabilities,
  shouldEnableParticles,
  PerformanceMonitor,
  cleanup,
} from '@/lib/particles-utils';

// Mock global objects
const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

const mockNavigator = (userAgent: string, hardwareConcurrency = 4) => {
  Object.defineProperty(window, 'navigator', {
    writable: true,
    value: {
      userAgent,
      hardwareConcurrency,
    },
  });
};

const mockScreen = (width: number) => {
  Object.defineProperty(window, 'screen', {
    writable: true,
    value: {
      width,
    },
  });
};

describe('particles-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset window.matchMedia
    window.matchMedia = mockMatchMedia(false);
    
    // Reset navigator
    mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Reset screen
    mockScreen(1920);
  });

  describe('supportsCanvas', () => {
    it('returns true when Canvas API is supported', () => {
      expect(supportsCanvas()).toBe(true);
    });

    it('returns false when Canvas API is not supported', () => {
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => ({
        getContext: null,
      }));

      expect(supportsCanvas()).toBe(false);

      document.createElement = originalCreateElement;
    });

    it('returns false when document.createElement throws', () => {
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => {
        throw new Error('Canvas not supported');
      });

      expect(supportsCanvas()).toBe(false);

      document.createElement = originalCreateElement;
    });
  });

  describe('supportsWebGL', () => {
    it('returns true when WebGL is supported', () => {
      expect(supportsWebGL()).toBe(true);
    });

    it('returns false when WebGL is not supported', () => {
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => ({
        getContext: vi.fn().mockReturnValue(null),
      }));

      expect(supportsWebGL()).toBe(false);

      document.createElement = originalCreateElement;
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns true when user prefers reduced motion', () => {
      window.matchMedia = mockMatchMedia(true);
      expect(prefersReducedMotion()).toBe(true);
    });

    it('returns false when user does not prefer reduced motion', () => {
      window.matchMedia = mockMatchMedia(false);
      expect(prefersReducedMotion()).toBe(false);
    });

    it('returns false when matchMedia throws', () => {
      window.matchMedia = vi.fn().mockImplementation(() => {
        throw new Error('matchMedia not supported');
      });
      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('prefersHighContrast', () => {
    it('returns true when user prefers high contrast', () => {
      window.matchMedia = mockMatchMedia(true);
      expect(prefersHighContrast()).toBe(true);
    });

    it('returns false when user does not prefer high contrast', () => {
      window.matchMedia = mockMatchMedia(false);
      expect(prefersHighContrast()).toBe(false);
    });
  });

  describe('isMobileDevice', () => {
    it('returns true for mobile user agents', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      expect(isMobileDevice()).toBe(true);
    });

    it('returns true for Android devices', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 10; SM-G973F)');
      expect(isMobileDevice()).toBe(true);
    });

    it('returns true for small screen widths', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      mockScreen(600);
      expect(isMobileDevice()).toBe(true);
    });

    it('returns false for desktop devices with large screens', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      mockScreen(1920);
      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('getDeviceCapabilities', () => {
    it('returns good performance for desktop devices', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 8);
      mockScreen(1920);

      const capabilities = getDeviceCapabilities();

      expect(capabilities.hasGoodPerformance).toBe(true);
      expect(capabilities.supportsHighFPS).toBe(true);
      expect(capabilities.memoryInfo).toBeDefined();
    });

    it('returns limited performance for mobile devices', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 2);
      mockScreen(400);

      const capabilities = getDeviceCapabilities();

      expect(capabilities.hasGoodPerformance).toBe(false);
    });

    it('handles missing hardware concurrency', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      // @ts-expect-error - Intentionally removing hardwareConcurrency
      delete navigator.hardwareConcurrency;

      const capabilities = getDeviceCapabilities();

      expect(capabilities).toBeDefined();
    });
  });

  describe('shouldEnableParticles', () => {
    it('returns false when user prefers reduced motion', () => {
      window.matchMedia = mockMatchMedia(true);
      expect(shouldEnableParticles()).toBe(false);
    });

    it('returns false when Canvas is not supported', () => {
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => ({
        getContext: null,
      }));

      expect(shouldEnableParticles()).toBe(false);

      document.createElement = originalCreateElement;
    });

    it('returns false for very old Chrome versions on mobile', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 Chrome/59.0.3071.125', 2);
      mockScreen(400);

      expect(shouldEnableParticles()).toBe(false);
    });

    it('returns true for capable devices', () => {
      window.matchMedia = mockMatchMedia(false);
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 8);
      mockScreen(1920);

      expect(shouldEnableParticles()).toBe(true);
    });
  });

  describe('PerformanceMonitor', () => {
    it('initializes with default FPS', () => {
      const monitor = new PerformanceMonitor();
      expect(monitor.getFPS()).toBe(60);
    });

    it('calls callback when FPS is updated', () => {
      const callback = vi.fn();
      
      // Mock performance.now before creating the monitor
      const originalNow = performance.now;
      let time = 0;
      performance.now = vi.fn(() => time);

      const monitor = new PerformanceMonitor(callback);
      
      // Simulate 60 frames
      for (let i = 0; i < 60; i++) {
        monitor.update();
      }
      
      // Advance time by 1000ms and call update to trigger callback
      time = 1000;
      monitor.update();

      expect(callback).toHaveBeenCalledWith(expect.any(Number));
      expect(callback.mock.calls[0][0]).toBeGreaterThan(50);

      performance.now = originalNow;
    });

    it('reports good performance for high FPS', () => {
      const monitor = new PerformanceMonitor();
      expect(monitor.isPerformanceGood()).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('cleans up event listeners', () => {
      const mockElement = {
        removeEventListener: vi.fn(),
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
      const mockHandler = vi.fn();

      cleanup({
        eventListeners: [
          {
            element: mockElement as EventTarget,
            event: 'click',
            handler: mockHandler,
          },
        ],
      });

      expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', mockHandler);
    });

    it('clears intervals and timeouts', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      cleanup({
        intervals: [123],
        timeouts: [456],
      });

      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
      expect(clearTimeoutSpy).toHaveBeenCalledWith(456);

      clearIntervalSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    });

    it('handles cleanup errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      cleanup({
        eventListeners: [
          {
            element: null as unknown as EventTarget,
            event: 'click',
            handler: vi.fn(),
          },
        ],
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error during cleanup:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});