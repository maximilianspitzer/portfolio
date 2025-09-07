/**
 * TypeScript interfaces for Hero Particles Background
 * tsParticles configuration types and component interfaces
 */

import type { ISourceOptions } from '@tsparticles/engine';

export interface ParticlesBackgroundProps {
  className?: string;
  id?: string;
  reducedMotion?: boolean;
}

export interface ResponsiveOption {
  maxWidth: number;
  options: Partial<ISourceOptions>;
}

export interface AccessibilityConfig {
  respectsReducedMotion: boolean;
  enableInteractivity: boolean;
  animationIntensity: 'none' | 'minimal' | 'full';
}

export interface ThemeColors {
  particle: string;
  links: string;
  background: string;
  hover: string;
}

export interface ConfigurationManager {
  getBaseConfig(): ISourceOptions;
  getResponsiveConfig(): ResponsiveOption[];
  getAccessibilityConfig(reducedMotion: boolean): Partial<ISourceOptions>;
  getThemeAwareColors(): ThemeColors;
}