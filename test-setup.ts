import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

// Ensure HTMLElement is available before setting up prototype methods
if (typeof global.HTMLElement === 'undefined') {
  global.HTMLElement = class HTMLElement {
    scrollIntoView = vi.fn();
  } as any;
}

// Mock scrollIntoView for HTMLElement prototype
if (global.HTMLElement && global.HTMLElement.prototype) {
  Object.defineProperty(global.HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
}

// Mock matchMedia with responsive testing support
const mockMatchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
});

// Make matchMedia available globally
Object.defineProperty(global, 'matchMedia', {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
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
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  hardwareConcurrency: 4,
  deviceMemory: 8,
  maxTouchPoints: 0,
  connection: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  platform: 'MacIntel',
  language: 'en-US',
  languages: ['en-US', 'en'],
  onLine: true,
  cookieEnabled: true,
};

Object.defineProperty(global, 'navigator', {
  writable: true,
  value: mockNavigator,
});

Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  configurable: true,
  value: 4,
});

Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  configurable: true,
  value: 8,
});

Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  configurable: true,
  value: 0,
});

Object.defineProperty(navigator, 'connection', {
  writable: true,
  configurable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
});

// Mock clipboard API for container query tests
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
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
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Add global vi function for test files
(global as any).vi = vi;

// Ensure window object is available globally
if (typeof global.window === 'undefined') {
  (global as any).window = {};
}

// Define comprehensive window object for browser APIs
Object.defineProperty(global, 'window', {
  writable: true,
  configurable: true,
  value: {
    ...window,
    navigator: mockNavigator,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    getComputedStyle: vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue(''),
    }),
    document: document,
    screen: {
      width: 1024,
      height: 768,
    },
    innerWidth: 1024,
    innerHeight: 768,
    devicePixelRatio: 1,
    location: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000',
    },
    matchMedia: mockMatchMedia,
    requestAnimationFrame: vi.fn().mockImplementation((callback) => {
      return setTimeout(callback, 16);
    }),
    cancelAnimationFrame: vi.fn().mockImplementation((id) => {
      clearTimeout(id);
    }),
  },
});

// Ensure window.window points to itself (some libraries check this)
if (global.window) {
  global.window.window = global.window;
}

// Also ensure the window is available on the global object
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window, 'dispatchEvent', {
  writable: true,
  configurable: true,
  value: vi.fn(),
});
