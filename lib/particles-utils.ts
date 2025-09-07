/**
 * Utility functions for particles background
 * Handles feature detection, browser compatibility, and performance monitoring
 */

/**
 * Detects if the browser supports Canvas API
 */
export function supportsCanvas(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch {
    return false;
  }
}

/**
 * Detects if the browser supports WebGL
 */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Detects if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Detects if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.matchMedia('(prefers-contrast: high)').matches;
  } catch {
    return false;
  }
}

/**
 * Checks if device is mobile based on screen size and user agent
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const screenWidth = window.screen.width;
    
    return mobileRegex.test(userAgent) || screenWidth < 768;
  } catch {
    return false;
  }
}

/**
 * Detects device performance capabilities
 */
export function getDeviceCapabilities(): {
  hasGoodPerformance: boolean;
  supportsHighFPS: boolean;
  memoryInfo?: {
    used: number;
    total: number;
    limit: number;
  };
} {
  if (typeof window === 'undefined') {
    return {
      hasGoodPerformance: true,
      supportsHighFPS: false,
    };
  }
  
  try {
    const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const isMobile = isMobileDevice();
    
    const hasGoodPerformance = !isMobile && hardwareConcurrency >= 4;
    const supportsHighFPS = hasGoodPerformance && 
      (memory ? memory.jsHeapSizeLimit > 1000000000 : true); // 1GB heap limit
    
    return {
      hasGoodPerformance,
      supportsHighFPS,
      memoryInfo: memory ? {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      } : undefined,
    };
  } catch {
    return {
      hasGoodPerformance: true,
      supportsHighFPS: false,
    };
  }
}

/**
 * Checks if particles should be enabled based on user preferences and device capabilities
 */
export function shouldEnableParticles(): boolean {
  // Respect user's reduced motion preference
  if (prefersReducedMotion()) {
    return false;
  }
  
  // Check browser capabilities
  if (!supportsCanvas()) {
    return false;
  }
  
  // For very low-end devices, disable particles
  const capabilities = getDeviceCapabilities();
  if (!capabilities.hasGoodPerformance && isMobileDevice()) {
    const userAgent = navigator.userAgent;
    // Disable on very old browsers/devices
    if (userAgent.includes('Chrome/') && parseInt(userAgent.split('Chrome/')[1]) < 60) {
      return false;
    }
  }
  
  return true;
}

/**
 * Performance monitor for frame rate tracking
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private callback?: (fps: number) => void;
  
  constructor(callback?: (fps: number) => void) {
    this.callback = callback;
  }
  
  public update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= 1000) { // Update every second
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      if (this.callback) {
        this.callback(this.fps);
      }
    }
  }
  
  public getFPS(): number {
    return this.fps;
  }
  
  public isPerformanceGood(): boolean {
    return this.fps >= 30;
  }
}

/**
 * Cleanup utility for event listeners and resources
 */
export function cleanup(elements: {
  mediaQueries?: MediaQueryList[];
  eventListeners?: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
  }>;
  intervals?: number[];
  timeouts?: number[];
}): void {
  try {
    // Clean up media query listeners
    if (elements.mediaQueries) {
      elements.mediaQueries.forEach(mq => {
        if (mq && typeof mq.removeEventListener === 'function') {
          // Remove any listeners (implementation would depend on specific usage)
        }
      });
    }
    
    // Clean up event listeners
    if (elements.eventListeners) {
      elements.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }
    
    // Clean up intervals
    if (elements.intervals) {
      elements.intervals.forEach(id => clearInterval(id));
    }
    
    // Clean up timeouts
    if (elements.timeouts) {
      elements.timeouts.forEach(id => clearTimeout(id));
    }
  } catch (error) {
    console.warn('Error during cleanup:', error);
  }
}