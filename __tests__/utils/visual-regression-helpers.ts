/**
 * Visual regression testing utilities for responsive components
 * Provides screenshot comparison and visual diff testing capabilities
 */

import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import { TEST_VIEWPORTS, ViewportName, ResponsiveTestEnvironment } from './responsive-test-helpers';

// Visual testing configuration
export const VISUAL_TEST_CONFIG = {
  screenshotDir: '__tests__/visual-regression/screenshots',
  baselineDir: '__tests__/visual-regression/baselines',
  diffDir: '__tests__/visual-regression/diffs',
  threshold: 0.1, // 10% difference threshold
  pixelThreshold: 100, // Maximum different pixels allowed
} as const;

/**
 * Screenshot data structure
 */
export interface Screenshot {
  name: string;
  viewport: ViewportName;
  timestamp: number;
  dimensions: { width: number; height: number };
  data?: string; // Base64 encoded image data (mocked in tests)
}

/**
 * Visual diff result
 */
export interface VisualDiff {
  passed: boolean;
  diffPercentage: number;
  diffPixelCount: number;
  baseline?: Screenshot;
  current?: Screenshot;
  message: string;
}

/**
 * Mock visual regression testing utilities
 * In a real implementation, this would integrate with tools like Playwright or Puppeteer
 */
export class VisualRegressionTester {
  private mockScreenshots: Map<string, Screenshot> = new Map();
  private baselines: Map<string, Screenshot> = new Map();

  constructor() {
    this.setupMockBaselines();
  }

  /**
   * Setup mock baseline screenshots for testing
   */
  private setupMockBaselines() {
    // Mock baseline data - in real implementation, these would be actual screenshots
    const mockBaselines: Array<{ name: string; viewport: ViewportName }> = [
      { name: 'hero-component', viewport: 'mobile' },
      { name: 'hero-component', viewport: 'tablet' },
      { name: 'hero-component', viewport: 'desktop' },
      { name: 'work-grid-component', viewport: 'mobile' },
      { name: 'work-grid-component', viewport: 'tablet' },
      { name: 'work-grid-component', viewport: 'desktop' },
      { name: 'project-modal', viewport: 'mobile' },
      { name: 'project-modal', viewport: 'tablet' },
      { name: 'project-modal', viewport: 'desktop' },
    ];

    mockBaselines.forEach(baseline => {
      const key = this.getScreenshotKey(baseline.name, baseline.viewport);
      this.baselines.set(key, {
        name: baseline.name,
        viewport: baseline.viewport,
        timestamp: Date.now() - 86400000, // 24 hours ago
        dimensions: TEST_VIEWPORTS[baseline.viewport],
        data: `mock-baseline-${key}`,
      });
    });
  }

  /**
   * Generate screenshot key for consistent naming
   */
  private getScreenshotKey(name: string, viewport: ViewportName): string {
    return `${name}-${viewport}`;
  }

  /**
   * Take screenshot of component at specified viewport
   */
  async takeScreenshot(
    component: ReactElement,
    name: string,
    viewport: ViewportName,
    options: {
      waitFor?: () => Promise<void>;
      fullPage?: boolean;
      selector?: string;
    } = {}
  ): Promise<Screenshot> {
    const env = new ResponsiveTestEnvironment();
    
    try {
      env.setViewport(viewport);
      
      render(component);
      
      // Wait for component to render and any animations to complete
      await waitFor(() => {});
      
      if (options.waitFor) {
        await options.waitFor();
      }

      // Simulate taking screenshot
      const screenshot: Screenshot = {
        name,
        viewport,
        timestamp: Date.now(),
        dimensions: TEST_VIEWPORTS[viewport],
        data: `mock-screenshot-${this.getScreenshotKey(name, viewport)}-${Date.now()}`,
      };

      const key = this.getScreenshotKey(name, viewport);
      this.mockScreenshots.set(key, screenshot);

      return screenshot;
    } finally {
      env.cleanup();
    }
  }

  /**
   * Compare current screenshot with baseline
   */
  async compareWithBaseline(
    component: ReactElement,
    name: string,
    viewport: ViewportName,
    options: {
      threshold?: number;
      pixelThreshold?: number;
      updateBaseline?: boolean;
    } = {}
  ): Promise<VisualDiff> {
    const current = await this.takeScreenshot(component, name, viewport);
    const key = this.getScreenshotKey(name, viewport);
    const baseline = this.baselines.get(key);

    if (!baseline) {
      return {
        passed: false,
        diffPercentage: 100,
        diffPixelCount: 0,
        current,
        message: `No baseline found for ${name} at ${viewport}. Run with updateBaseline: true to create one.`,
      };
    }

    // Mock visual comparison - in real implementation, this would use image comparison
    const diffResult = this.mockVisualComparison(baseline, current, options);

    if (options.updateBaseline && !diffResult.passed) {
      this.baselines.set(key, current);
      return {
        ...diffResult,
        passed: true,
        message: `Baseline updated for ${name} at ${viewport}`,
      };
    }

    return diffResult;
  }

  /**
   * Mock visual comparison logic
   */
  private mockVisualComparison(
    baseline: Screenshot,
    current: Screenshot,
    options: { threshold?: number; pixelThreshold?: number } = {}
  ): VisualDiff {
    const threshold = options.threshold ?? VISUAL_TEST_CONFIG.threshold;
    const pixelThreshold = options.pixelThreshold ?? VISUAL_TEST_CONFIG.pixelThreshold;

    // Mock comparison - in reality, this would analyze actual image pixels
    const mockDiffPercentage = Math.random() * 0.2; // 0-20% difference
    const mockPixelDiff = Math.floor(mockDiffPercentage * 1000);

    const passed = mockDiffPercentage <= threshold && mockPixelDiff <= pixelThreshold;

    return {
      passed,
      diffPercentage: mockDiffPercentage,
      diffPixelCount: mockPixelDiff,
      baseline,
      current,
      message: passed 
        ? `Visual comparison passed (${(mockDiffPercentage * 100).toFixed(1)}% difference)`
        : `Visual comparison failed: ${(mockDiffPercentage * 100).toFixed(1)}% difference exceeds ${(threshold * 100).toFixed(1)}% threshold`,
    };
  }

  /**
   * Test component across multiple viewports
   */
  async testResponsiveVisuals(
    component: ReactElement,
    name: string,
    viewports: ViewportName[] = ['mobile', 'tablet', 'desktop'],
    options: {
      threshold?: number;
      updateBaseline?: boolean;
      skipOnFail?: boolean;
    } = {}
  ): Promise<Array<{ viewport: ViewportName; result: VisualDiff }>> {
    const results: Array<{ viewport: ViewportName; result: VisualDiff }> = [];

    for (const viewport of viewports) {
      try {
        const result = await this.compareWithBaseline(component, name, viewport, options);
        results.push({ viewport, result });

        if (!result.passed && options.skipOnFail) {
          break;
        }
      } catch (error) {
        results.push({
          viewport,
          result: {
            passed: false,
            diffPercentage: 100,
            diffPixelCount: 0,
            message: `Error during visual test: ${error instanceof Error ? error.message : String(error)}`,
          },
        });
      }
    }

    return results;
  }

  /**
   * Generate visual test report
   */
  generateReport(results: Array<{ viewport: ViewportName; result: VisualDiff }>): {
    passed: boolean;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    summary: string;
  } {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.result.passed).length;
    const failedTests = totalTests - passedTests;
    const passed = failedTests === 0;

    const summary = `Visual Regression Test Results:
    Total: ${totalTests}
    Passed: ${passedTests}
    Failed: ${failedTests}
    
    ${results.map(r => `${r.viewport}: ${r.result.passed ? '✅' : '❌'} ${r.result.message}`).join('\n    ')}`;

    return {
      passed,
      totalTests,
      passedTests,
      failedTests,
      summary,
    };
  }

  /**
   * Clean up test artifacts
   */
  cleanup() {
    this.mockScreenshots.clear();
    vi.clearAllMocks();
  }
}

/**
 * Animation state tracking interface
 */
interface AnimationState {
  name: string;
  element: HTMLElement;
  startTime: number;
  duration: number;
  completed: boolean;
}

/**
 * Responsive animation testing utilities
 */
export class ResponsiveAnimationTester {
  private animationStates: Map<string, AnimationState> = new Map();

  /**
   * Test animation performance across viewports
   */
  async testAnimationPerformance(
    component: ReactElement,
    animationTrigger: (element: HTMLElement) => void,
    viewports: ViewportName[] = ['mobile', 'tablet', 'desktop']
  ): Promise<Array<{ viewport: ViewportName; fps: number; duration: number }>> {
    const results: Array<{ viewport: ViewportName; fps: number; duration: number }> = [];
    const env = new ResponsiveTestEnvironment();

    for (const viewport of viewports) {
      env.setViewport(viewport);
      
      const { container } = render(component);
      const animationElement = container.querySelector('[data-testid="animated-element"]') as HTMLElement;

      if (animationElement) {
        const performanceData = await this.measureAnimationPerformance(
          animationElement, 
          animationTrigger
        );
        
        results.push({
          viewport,
          fps: performanceData.fps,
          duration: performanceData.duration,
        });
      }
    }

    env.cleanup();
    return results;
  }

  /**
   * Mock animation performance measurement
   */
  private async measureAnimationPerformance(
    element: HTMLElement,
    trigger: (element: HTMLElement) => void
  ): Promise<{ fps: number; duration: number }> {
    const startTime = performance.now();
    let frameCount = 0;

    // Mock animation frame counting
    const frameCounter = () => {
      frameCount++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(frameCounter);
      }
    };

    trigger(element);
    requestAnimationFrame(frameCounter);

    // Wait for animation to complete (mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const endTime = performance.now();
    const duration = endTime - startTime;
    const fps = Math.round((frameCount / duration) * 1000);

    return { fps, duration };
  }

  /**
   * Test reduced motion preference handling
   */
  async testReducedMotionSupport(
    component: ReactElement,
    expectedBehavior: 'disable' | 'reduce' | 'maintain' = 'disable'
  ): Promise<boolean> {
    const env = new ResponsiveTestEnvironment();
    env.setPrefersReducedMotion(true);

    const { container } = render(component);
    await waitFor(() => {});

    // Check if animations respect reduced motion preference
    const animatedElements = container.querySelectorAll('[data-testid*="animated"]');
    
    // Mock checking for reduced motion compliance
    const hasReducedMotion = Array.from(animatedElements).every(element => {
      const computedStyle = getComputedStyle(element as HTMLElement);
      
      switch (expectedBehavior) {
        case 'disable':
          return computedStyle.animationPlayState === 'paused' || 
                 computedStyle.animationDuration === '0s';
        case 'reduce':
          return parseFloat(computedStyle.animationDuration) < 0.5; // Less than 500ms
        case 'maintain':
          return true; // Always passes for components that maintain animations
        default:
          return false;
      }
    });

    env.cleanup();
    return hasReducedMotion;
  }

  cleanup() {
    this.animationStates.clear();
  }
}

/**
 * Create visual test utilities for components
 */
export function createVisualTestSuite(componentName: string) {
  const visualTester = new VisualRegressionTester();
  const animationTester = new ResponsiveAnimationTester();

  return {
    /**
     * Test component visuals across all standard breakpoints
     */
    async testAllBreakpoints(
      component: ReactElement,
      options: { updateBaseline?: boolean; threshold?: number } = {}
    ) {
      return visualTester.testResponsiveVisuals(component, componentName, undefined, options);
    },

    /**
     * Test specific viewport
     */
    async testViewport(
      component: ReactElement,
      viewport: ViewportName,
      options: { updateBaseline?: boolean; threshold?: number } = {}
    ) {
      return visualTester.compareWithBaseline(component, componentName, viewport, options);
    },

    /**
     * Test animations
     */
    async testAnimations(
      component: ReactElement,
      trigger: (element: HTMLElement) => void
    ) {
      return animationTester.testAnimationPerformance(component, trigger);
    },

    /**
     * Test reduced motion support
     */
    async testReducedMotion(component: ReactElement) {
      return animationTester.testReducedMotionSupport(component);
    },

    /**
     * Generate comprehensive report
     */
    generateReport(visualResults: Array<{ viewport: ViewportName; result: VisualDiff }>) {
      return visualTester.generateReport(visualResults);
    },

    /**
     * Cleanup test resources
     */
    cleanup() {
      visualTester.cleanup();
      animationTester.cleanup();
    },
  };
}

/**
 * Visual test matchers
 */
export const visualMatchers = {
  toMatchVisualSnapshot: (
    received: VisualDiff,
    threshold: number = VISUAL_TEST_CONFIG.threshold
  ) => {
    if (received.passed) {
      return {
        message: () => `Expected visual snapshot to not match within ${(threshold * 100).toFixed(1)}% threshold`,
        pass: true,
      };
    } else {
      return {
        message: () => 
          `Expected visual snapshot to match within ${(threshold * 100).toFixed(1)}% threshold. ` +
          `Actual difference: ${(received.diffPercentage * 100).toFixed(1)}%. ` +
          `${received.message}`,
        pass: false,
      };
    }
  },

  toHaveGoodAnimationPerformance: (
    received: Array<{ viewport: ViewportName; fps: number; duration: number }>,
    minFps: number = 30
  ) => {
    const failing = received.filter(result => result.fps < minFps);
    
    if (failing.length === 0) {
      return {
        message: () => `Expected some animations to have poor performance`,
        pass: true,
      };
    } else {
      const failingDetails = failing.map(f => `${f.viewport}: ${f.fps}fps`).join(', ');
      return {
        message: () => 
          `Expected all animations to maintain at least ${minFps}fps. ` +
          `Failing viewports: ${failingDetails}`,
        pass: false,
      };
    }
  },
};