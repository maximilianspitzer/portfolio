/**
 * TypeScript interfaces for the mobile-first responsive design system
 * Provides comprehensive type definitions for breakpoint detection,
 * container queries, and responsive component state management
 */

// Breakpoint system configuration
export interface BreakpointConfig {
  xs: string;     // 0px - Extra small (mobile)
  sm: string;     // 640px - Small (large mobile)
  md: string;     // 768px - Medium (tablet)
  lg: string;     // 1024px - Large (desktop)
  xl: string;     // 1280px - Extra large
  '2xl': string;  // 1536px - 2X large
}

export type BreakpointKey = keyof BreakpointConfig;

// Responsive spacing scale
export interface SpacingScale {
  xs: {
    container: string;
    section: string;
    component: string;
  };
  sm: {
    container: string;
    section: string;
    component: string;
  };
  md: {
    container: string;
    section: string;
    component: string;
  };
  lg: {
    container: string;
    section: string;
    component: string;
  };
  xl: {
    container: string;
    section: string;
    component: string;
  };
}

// Typography responsive system
export interface TypographyScale {
  headings: {
    h1: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    h2: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    h3: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  };
  body: {
    base: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    large: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  };
  lineHeight: {
    mobile: string;
    desktop: string;
  };
}

// Device and viewport information
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  supportsHover: boolean;
}

// Component responsive state
export interface ResponsiveState {
  currentBreakpoint: BreakpointKey;
  viewportWidth: number;
  viewportHeight: number;
  containerWidth?: number;
  deviceInfo: DeviceInfo;
  isWithinBreakpoint: (breakpoint: BreakpointKey) => boolean;
  isAtLeastBreakpoint: (breakpoint: BreakpointKey) => boolean;
  isAtMostBreakpoint: (breakpoint: BreakpointKey) => boolean;
}

// Container query configuration
export interface ContainerQueryConfig {
  element: HTMLElement | null;
  queries: {
    small: string;    // < 400px
    medium: string;   // 400px - 800px
    large: string;    // > 800px
  };
  fallback: 'media-query' | 'javascript';
}

// Container query state
export interface ContainerDimensions {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  aspectRatio: number;
}

// Responsive configuration options
export interface ResponsiveConfig {
  breakpoints: BreakpointConfig;
  spacing: SpacingScale;
  typography: TypographyScale;
  debounceMs?: number;
  enableContainerQueries?: boolean;
}

// Hook options
export interface UseResponsiveOptions {
  debounceMs?: number;
  enableDeviceDetection?: boolean;
}

export interface UseContainerQueryOptions {
  fallback?: 'media-query' | 'javascript';
  debounceMs?: number;
  queries?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

// Analytics integration for responsive events
export interface ResponsiveAnalyticsEvent {
  eventType: 'breakpoint_change' | 'orientation_change' | 'container_resize';
  fromValue?: string;
  toValue: string;
  component?: string;
  timestamp: number;
  deviceInfo: DeviceInfo;
}

// Responsive component props
export interface ResponsiveComponentProps {
  breakpoint?: BreakpointKey;
  mobileFirst?: boolean;
  enableAnalytics?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Utility function types
export type GetBreakpointValue = (breakpoint: BreakpointKey) => number;
export type IsBreakpointActive = (breakpoint: BreakpointKey, width: number) => boolean;
export type GetResponsiveValue = <T>(values: Partial<Record<BreakpointKey, T>>, currentBreakpoint: BreakpointKey) => T | undefined;

// Error types for responsive system
export interface ResponsiveError {
  type: 'UNSUPPORTED_FEATURE' | 'INVALID_BREAKPOINT' | 'CONTAINER_NOT_FOUND';
  message: string;
  fallback?: () => void;
}