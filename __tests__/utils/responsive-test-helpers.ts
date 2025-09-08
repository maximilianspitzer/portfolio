/**
 * Comprehensive responsive testing utilities
 * Provides helpers for viewport testing, layout validation, touch targets, and accessibility
 */

import { vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';

// Standard responsive breakpoints for testing
export const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  mobileLarge: { width: 414, height: 896, name: 'iPhone 11 Pro' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  tabletLandscape: { width: 1024, height: 768, name: 'iPad Landscape' },
  desktop: { width: 1440, height: 900, name: 'Desktop' },
  desktopLarge: { width: 1920, height: 1080, name: 'Large Desktop' },
  ultrawide: { width: 2560, height: 1440, name: 'Ultrawide' },
} as const;

export type ViewportName = keyof typeof TEST_VIEWPORTS;

// Touch target size constants based on accessibility guidelines
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // WCAG 2.1 AA minimum
  comfortable: 48, // Recommended comfortable size
  large: 56, // Large touch targets for better usability
} as const;

// Layout validation thresholds
export const LAYOUT_THRESHOLDS = {
  horizontalScroll: 0, // No horizontal scrolling allowed
  contentWidth: 0.95, // Content should use at least 95% of available width
  touchTargetSpacing: 8, // Minimum spacing between touch targets
} as const;

/**
 * Mock window dimensions for responsive testing
 */
export class ResponsiveTestEnvironment {
  private originalWindow: typeof window;
  private mockMatchMedia = vi.fn();

  constructor() {
    this.originalWindow = global.window;
  }

  /**
   * Set viewport dimensions and update window object
   */
  setViewport(viewport: ViewportName | { width: number; height: number }) {
    const dimensions = typeof viewport === 'string' ? TEST_VIEWPORTS[viewport] : viewport;
    
    // Mock window dimensions
    Object.defineProperty(global.window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: dimensions.width,
    });

    Object.defineProperty(global.window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: dimensions.height,
    });

    // Mock matchMedia for responsive queries
    this.mockMatchMedia.mockImplementation((query: string) => {
      // Parse media query to determine if it matches current viewport
      const matches = this.matchesMediaQuery(query, dimensions.width);
      
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });

    Object.defineProperty(global.window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: this.mockMatchMedia,
    });

    // Trigger resize event
    const resizeEvent = new Event('resize');
    global.window.dispatchEvent(resizeEvent);
  }

  /**
   * Parse and evaluate media query against current viewport width
   */
  private matchesMediaQuery(query: string, viewportWidth: number): boolean {
    // Simple media query parsing - extend as needed
    const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
    const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);

    if (minWidthMatch) {
      const minWidth = parseInt(minWidthMatch[1], 10);
      return viewportWidth >= minWidth;
    }

    if (maxWidthMatch) {
      const maxWidth = parseInt(maxWidthMatch[1], 10);
      return viewportWidth <= maxWidth;
    }

    // Default to matching if we can't parse the query
    return false;
  }

  /**
   * Simulate device with touch capability
   */
  setTouchDevice(hasTouch = true) {
    Object.defineProperty(global.navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: hasTouch ? 5 : 0,
    });

    // Mock touch events
    if (hasTouch) {
      Object.defineProperty(global.window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: {},
      });
    } else {
      delete (global.window as unknown as { ontouchstart?: unknown }).ontouchstart;
    }
  }

  /**
   * Simulate reduced motion preference
   */
  setPrefersReducedMotion(prefers = true) {
    this.mockMatchMedia.mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? prefers : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  /**
   * Cleanup and restore original window
   */
  cleanup() {
    if (this.originalWindow) {
      global.window = this.originalWindow;
    }
    vi.clearAllMocks();
  }
}

/**
 * Test component rendering at multiple viewports
 */
export async function testAtViewports(
  component: ReactElement,
  viewports: ViewportName[] = ['mobile', 'tablet', 'desktop'],
  testFn?: (viewport: ViewportName) => void | Promise<void>
) {
  const env = new ResponsiveTestEnvironment();
  const results: Array<{ viewport: ViewportName; success: boolean; error?: string }> = [];

  for (const viewport of viewports) {
    try {
      env.setViewport(viewport);
      
      const { unmount } = render(component);
      
      // Wait for any responsive effects to settle
      await waitFor(() => {});

      if (testFn) {
        await testFn(viewport);
      }

      results.push({ viewport, success: true });
      unmount();
    } catch (error) {
      results.push({ 
        viewport, 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  env.cleanup();
  return results;
}

/**
 * Validate touch target sizes meet accessibility requirements
 */
export function validateTouchTargets(
  container: HTMLElement = document.body,
  minimumSize: number = TOUCH_TARGET_SIZES.minimum
): { valid: boolean; violations: Array<{ element: Element; width: number; height: number }> } {
  const violations: Array<{ element: Element; width: number; height: number }> = [];

  // Interactive elements that should meet touch target requirements
  const interactiveSelectors = [
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[tabindex="0"]',
    '[onclick]',
    '.cursor-pointer'
  ];

  const interactiveElements = container.querySelectorAll(interactiveSelectors.join(', '));

  interactiveElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element as HTMLElement);
    
    // Consider padding in touch target calculation
    const paddingTop = parseInt(computedStyle.paddingTop, 10) || 0;
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0;
    const paddingLeft = parseInt(computedStyle.paddingLeft, 10) || 0;
    const paddingRight = parseInt(computedStyle.paddingRight, 10) || 0;

    const effectiveWidth = rect.width + paddingLeft + paddingRight;
    const effectiveHeight = rect.height + paddingTop + paddingBottom;

    if (effectiveWidth < minimumSize || effectiveHeight < minimumSize) {
      violations.push({
        element,
        width: effectiveWidth,
        height: effectiveHeight,
      });
    }
  });

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Check for horizontal scrolling (layout overflow)
 */
export function validateNoHorizontalScroll(container: HTMLElement = document.body): boolean {
  const bodyRect = container.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  
  // Check if content width exceeds viewport
  return bodyRect.width <= viewportWidth;
}

/**
 * Validate responsive typography scaling
 */
export function validateTypographyScaling(
  element: HTMLElement,
  expectedSizes: Record<ViewportName, string>
): { valid: boolean; actual: Record<ViewportName, string> } {
  const env = new ResponsiveTestEnvironment();
  const actual: Record<ViewportName, string> = {} as Record<ViewportName, string>;

  Object.keys(expectedSizes).forEach(viewport => {
    env.setViewport(viewport as ViewportName);
    const computedStyle = getComputedStyle(element);
    actual[viewport as ViewportName] = computedStyle.fontSize;
  });

  env.cleanup();

  const valid = Object.entries(expectedSizes).every(
    ([viewport, expected]) => actual[viewport as ViewportName] === expected
  );

  return { valid, actual };
}

/**
 * Test component layout stability across breakpoints
 */
export async function validateLayoutStability(
  component: ReactElement,
  viewports: ViewportName[] = ['mobile', 'tablet', 'desktop']
): Promise<{ stable: boolean; measurements: Record<ViewportName, DOMRect> }> {
  const env = new ResponsiveTestEnvironment();
  const measurements: Record<ViewportName, DOMRect> = {} as Record<ViewportName, DOMRect>;

  for (const viewport of viewports) {
    env.setViewport(viewport);
    
    const { container, unmount } = render(component);
    
    // Wait for layout to settle
    await waitFor(() => {});
    
    measurements[viewport] = container.getBoundingClientRect();
    unmount();
  }

  env.cleanup();

  // Check for layout consistency (no unexpected overflow or shifts)
  const stable = Object.values(measurements).every(rect => 
    rect.width <= window.innerWidth && rect.height > 0
  );

  return { stable, measurements };
}

/**
 * Performance testing for responsive components
 */
export class ResponsivePerformanceTester {
  private performanceEntries: PerformanceEntry[] = [];

  startMeasuring(name: string) {
    performance.mark(`${name}-start`);
  }

  endMeasuring(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const entries = performance.getEntriesByName(name, 'measure');
    this.performanceEntries.push(...entries);
  }

  getResults() {
    return this.performanceEntries.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
    }));
  }

  validatePerformanceBudget(budgets: Record<string, number>): boolean {
    return Object.entries(budgets).every(([name, budget]) => {
      const entry = this.performanceEntries.find(e => e.name === name);
      return entry ? entry.duration <= budget : true;
    });
  }

  cleanup() {
    this.performanceEntries = [];
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Custom matcher for touch target size validation
 */
export function toHaveValidTouchTargets(
  received: HTMLElement,
  minimumSize: number = TOUCH_TARGET_SIZES.minimum
) {
  const result = validateTouchTargets(received, minimumSize);
  
  if (result.valid) {
    return {
      message: () => `Expected element to have invalid touch targets`,
      pass: true,
    };
  } else {
    const violationMessages = result.violations.map(v => 
      `Element ${v.element.tagName.toLowerCase()} has size ${v.width}x${v.height}px (minimum: ${minimumSize}px)`
    );
    
    return {
      message: () => 
        `Expected all touch targets to be at least ${minimumSize}px:\n${violationMessages.join('\n')}`,
      pass: false,
    };
  }
}

/**
 * Custom matcher for responsive layout validation
 */
export function toHaveResponsiveLayout(received: HTMLElement) {
  const noHorizontalScroll = validateNoHorizontalScroll(received);
  
  if (noHorizontalScroll) {
    return {
      message: () => `Expected element to have layout issues`,
      pass: true,
    };
  } else {
    return {
      message: () => `Expected responsive layout without horizontal scrolling`,
      pass: false,
    };
  }
}

/**
 * Simulate user interactions for touch devices
 */
export const touchInteractions = {
  async tap(element: HTMLElement) {
    const user = userEvent.setup();
    await user.click(element);
  },

  async swipe(element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down') {
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    let endX = startX;
    let endY = startY;

    switch (direction) {
      case 'left':
        endX = startX - 100;
        break;
      case 'right':
        endX = startX + 100;
        break;
      case 'up':
        endY = startY - 100;
        break;
      case 'down':
        endY = startY + 100;
        break;
    }

    fireEvent.touchStart(element, {
      touches: [{ clientX: startX, clientY: startY }],
    });

    fireEvent.touchMove(element, {
      touches: [{ clientX: endX, clientY: endY }],
    });

    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: endX, clientY: endY }],
    });
  },

  async pinch(element: HTMLElement, scale: number) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = 50;

    fireEvent.touchStart(element, {
      touches: [
        { clientX: centerX - distance, clientY: centerY },
        { clientX: centerX + distance, clientY: centerY },
      ],
    });

    fireEvent.touchMove(element, {
      touches: [
        { clientX: centerX - distance * scale, clientY: centerY },
        { clientX: centerX + distance * scale, clientY: centerY },
      ],
    });

    fireEvent.touchEnd(element);
  },
};

// Extend vitest matchers
declare module 'vitest' {
  interface AsymmetricMatchersContaining {
    toHaveValidTouchTargets: (minimumSize?: number) => unknown;
    toHaveResponsiveLayout: () => unknown;
  }
}