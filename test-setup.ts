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

// Add global vi function for test files
global.vi = vi;

// Define window globally for browser APIs
Object.defineProperty(global, 'window', {
  writable: true,
  value: {
    ...window,
    navigator: {
      ...navigator,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      },
    },
  },
});
