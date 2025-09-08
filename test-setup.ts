import '@testing-library/jest-dom';

// Import responsive testing utilities and extend matchers
import { 
  toHaveValidTouchTargets, 
  toHaveResponsiveLayout 
} from './__tests__/utils/responsive-test-helpers';
import { visualMatchers } from './__tests__/utils/visual-regression-helpers';
import { i18nMatchers } from './__tests__/utils/i18n-responsive-helpers';
import { performanceMatchers } from './__tests__/utils/performance-test-helpers';

// Extend vitest matchers with custom responsive testing matchers
expect.extend({
  toHaveValidTouchTargets,
  toHaveResponsiveLayout,
  ...visualMatchers,
  ...i18nMatchers,
  ...performanceMatchers,
});

// Mock matchMedia with responsive testing support
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock performance.memory for testing
Object.defineProperty(performance, 'memory', {
  writable: true,
  value: {
    usedJSHeapSize: 16777216,
    totalJSHeapSize: 33554432,
    jsHeapSizeLimit: 2147483648,
  },
});

// Mock ResizeObserver for container query testing
class MockResizeObserver {
  callback: ResizeObserverCallback;
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  
  observe() {
    // Mock implementation
  }
  
  unobserve() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
}

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock IntersectionObserver for lazy loading testing
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  
  observe() {
    // Mock implementation
  }
  
  unobserve() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
}

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock touch events for mobile testing
Object.defineProperty(global, 'TouchEvent', {
  writable: true,
  value: class MockTouchEvent extends Event {
    touches: Touch[];
    changedTouches: Touch[];
    targetTouches: Touch[];
    
    constructor(type: string, options?: TouchEventInit) {
      super(type, options);
      this.touches = options?.touches ? Array.from(options.touches) : [];
      this.changedTouches = options?.changedTouches ? Array.from(options.changedTouches) : [];
      this.targetTouches = options?.targetTouches ? Array.from(options.targetTouches) : [];
    }
  },
});

// Mock navigator for device capability testing
Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 4,
});

Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  value: 8,
});

Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
});

// Mock maxTouchPoints for touch device testing
Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  value: 0,
});

// Mock CSS.supports for container query testing
Object.defineProperty(global, 'CSS', {
  writable: true,
  value: {
    supports: vi.fn().mockImplementation((property: string) => {
      // Mock container query support
      if (property.includes('container')) return true;
      return false;
    }),
  },
});

// Mock requestAnimationFrame for animation testing
global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
  return setTimeout(callback, 16); // ~60fps
});

global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
  clearTimeout(id);
});

// Mock Canvas and WebGL API
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((type) => {
  if (type === 'webgl' || type === 'experimental-webgl') {
    return {
      getExtension: vi.fn(),
      getSupportedExtensions: vi.fn(() => []),
      getParameter: vi.fn(),
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      createProgram: vi.fn(),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      useProgram: vi.fn(),
    };
  }
  if (type === '2d') {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(16),
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(16),
      })),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    };
  }
  return null;
});

// Mock getBoundingClientRect for layout testing
Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(() => ({
  width: 100,
  height: 50,
  top: 0,
  left: 0,
  bottom: 50,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => {},
}));

// Mock clipboard API for container query tests
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Global analytics mock to ensure all tests have access to properly mocked analytics
// Global analytics mock
vi.mock('@/lib/analytics', () => ({
  trackPortfolioEvent: {
    hero_cta_click: vi.fn(),
    hero_section_view: vi.fn(),
    work_grid_view: vi.fn(),
    work_grid_project_open: vi.fn(),
    project_modal_close: vi.fn(),
    contact_section_view: vi.fn(),
    about_section_view: vi.fn(),
    newsletter_signup: vi.fn(),
    social_link_click: vi.fn(),
    error_boundary_triggered: vi.fn(),
    scroll_to_section: vi.fn(),
    responsive_breakpoint_change: vi.fn(),
    custom: vi.fn(),
  },
  initializeAnalytics: vi.fn(),
  isAnalyticsEnabled: vi.fn(() => true),
}));

// Global particles configuration mock
vi.mock('@/lib/particles-config', () => ({
  ParticlesConfigurationManager: {
    getInstance: vi.fn(() => ({
      getThemeAwareColors: vi.fn(() => ({
        particle: '#ffffff',
        links: 'rgba(163, 163, 163, 0.2)',
        background: 'transparent',
        hover: 'rgba(255, 255, 255, 0.1)',
      })),
      getBaseConfig: vi.fn(() => ({
        fullScreen: { enable: false, zIndex: 0 },
        background: { color: { value: 'transparent' }, opacity: 0 },
        fpsLimit: 60,
        detectRetina: true,
        pauseOnBlur: true,
        particles: {
          color: { value: '#ffffff' },
          links: {
            color: 'rgba(163, 163, 163, 0.2)',
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
            triangles: { enable: true, opacity: 0.015 },
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: { default: 'bounce' },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: { enable: true, width: 1920, height: 1080 },
            value: 100,
          },
          opacity: { value: 0.6 },
          shape: { type: 'circle' },
          size: { value: { min: 2, max: 4 } },
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { groups: [], quantity: 2 },
          },
        },
      })),
      getResponsiveConfig: vi.fn(() => [
        {
          minWidth: 1200,
          options: {
            particles: {
              number: { value: 100, density: { enable: true, width: 1920, height: 1080 } },
              links: { distance: 150, opacity: 0.3 },
              move: { enable: true, speed: 2 },
              size: { value: { min: 3, max: 5 } },
            },
            fpsLimit: 60,
          },
        },
        {
          minWidth: 1024,
          maxWidth: 1199,
          options: {
            particles: {
              number: { value: 80, density: { enable: true, width: 1200, height: 900 } },
              links: { distance: 140, opacity: 0.25 },
              move: { enable: true, speed: 1.5 },
              size: { value: { min: 2, max: 4 } },
            },
            fpsLimit: 60,
          },
        },
        {
          minWidth: 768,
          maxWidth: 1023,
          options: {
            particles: {
              number: { value: 50, density: { enable: true, width: 1024, height: 768 } },
              links: { distance: 120, opacity: 0.2 },
              move: { enable: true, speed: 1 },
              size: { value: { min: 2, max: 3 } },
            },
            fpsLimit: 45,
            interactivity: {
              events: { onHover: { enable: true, mode: 'repulse' } },
              modes: { repulse: { distance: 80, duration: 0.3 } },
            },
          },
        },
        {
          minWidth: 640,
          maxWidth: 767,
          options: {
            particles: {
              number: { value: 30, density: { enable: true, width: 800, height: 600 } },
              links: { distance: 100, opacity: 0.15 },
              move: { enable: true, speed: 0.8 },
              size: { value: { min: 1, max: 2 } },
            },
            fpsLimit: 30,
            interactivity: {
              events: { onHover: { enable: false }, onClick: { enable: true, mode: 'push' } },
              modes: { push: { quantity: 1 } },
            },
          },
        },
        {
          maxWidth: 639,
          options: {
            particles: {
              number: { value: 20, density: { enable: true, width: 400, height: 600 } },
              links: { distance: 80, opacity: 0.1 },
              move: { enable: true, speed: 0.5 },
              size: { value: { min: 1, max: 2 } },
            },
            fpsLimit: 24,
            interactivity: {
              events: { onHover: { enable: false }, onClick: { enable: false } },
            },
          },
        },
      ]),
      getAccessibilityConfig: vi.fn(() => ({})),
      getPerformanceConfig: vi.fn(() => ({})),
      getFinalConfig: vi.fn(() => ({
        fullScreen: { enable: false, zIndex: 0 },
        particles: { number: { value: 100 } },
        fpsLimit: 60,
        responsive: [],
      })),
      getBreakpointOptimizedConfig: vi.fn((breakpoint) => ({
        fullScreen: { enable: false, zIndex: 0 },
        particles: {
          number: { value: breakpoint === 'xs' ? 15 : breakpoint === 'sm' ? 20 : 50 },
          move: { enable: true, speed: 1 },
        },
        fpsLimit: 60,
      })),
      getTestConfig: vi.fn(() => ({
        particles: { number: { value: 5 } },
        fpsLimit: 1,
        interactivity: {
          events: { onHover: { enable: false }, onClick: { enable: false } },
        },
      })),
    })),
  },
}));

// Define window globally for browser APIs with comprehensive browser environment
Object.defineProperty(global, 'window', {
  writable: true,
  value: {
    ...window,
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    requestAnimationFrame: vi.fn().mockImplementation((callback) => setTimeout(callback, 16)),
    cancelAnimationFrame: vi.fn().mockImplementation((id) => clearTimeout(id)),
    navigator: {
      ...navigator,
      maxTouchPoints: 0,
      hardwareConcurrency: 4,
      deviceMemory: 8,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
      connection: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
      },
    },
  },
});
