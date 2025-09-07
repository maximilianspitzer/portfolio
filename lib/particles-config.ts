/**
 * tsParticles Configuration Manager
 * Handles particle system configuration with theme integration, accessibility, and responsive design
 */

import type { ISourceOptions } from '@tsparticles/engine';
import type { ResponsiveOption, ThemeColors } from '@/types/particles';
import { group } from 'console';

export class ParticlesConfigurationManager {
  private static instance: ParticlesConfigurationManager;

  private constructor() {}

  public static getInstance(): ParticlesConfigurationManager {
    if (!ParticlesConfigurationManager.instance) {
      ParticlesConfigurationManager.instance = new ParticlesConfigurationManager();
    }
    return ParticlesConfigurationManager.instance;
  }

  /**
   * Detects if user prefers reduced motion
   */
  private detectReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Gets theme-aware colors from CSS custom properties
   */
  public getThemeAwareColors(): ThemeColors {
    if (typeof window === 'undefined') {
      // Server-side fallback
      return {
        particle: '#ffffff',
        links: 'rgba(163, 163, 163, 0.3)',
        background: 'transparent',
        hover: 'rgba(255, 255, 255, 0.1)'
      };
    }

    const computedStyle = getComputedStyle(document.documentElement);
    
    return {
      particle: computedStyle.getPropertyValue('--foreground').trim() || '#ffffff',
      links: `rgba(163, 163, 163, 0.3)`, // Using muted-foreground with opacity
      background: 'transparent',
      hover: computedStyle.getPropertyValue('--accent').trim() || '#171717'
    };
  }

  /**
   * Generates base tsParticles configuration
   */
  public getBaseConfig(): ISourceOptions {
    const colors = this.getThemeAwareColors();
    
    return {
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
      background: {
        color: {
          value: colors.background,
        },
        opacity: 0
      },
      fpsLimit: 60,
      detectRetina: true,
      pauseOnBlur: true,
      particles: {
        color: {
          value: colors.particle,
        },
        links: {
          color: colors.links,
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
          value: 60,
        },
        opacity: {
          value: 0.6,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 2, max: 4 },
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
          push: {
            groups: [],
            quantity: 2,
          }
        },
      },
    };
  }

  /**
   * Generates responsive configuration for different screen sizes
   */
  public getResponsiveConfig(): ResponsiveOption[] {
    return [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: {
              value: 30,
            },
            links: {
              distance: 120,
            },
            move: {
              speed: 0.5,
            },
          },
          fpsLimit: 30,
        },
      },
      {
        maxWidth: 480,
        options: {
          particles: {
            number: {
              value: 20,
            },
            links: {
              distance: 100,
            },
            move: {
              speed: 0.3,
            },
          },
          fpsLimit: 24,
          interactivity: {
            events: {
              onHover: {
                enable: false,
              },
            },
          },
        },
      },
    ];
  }

  /**
   * Generates accessibility-aware configuration
   */
  public getAccessibilityConfig(reducedMotion?: boolean): Partial<ISourceOptions> {
    const shouldReduceMotion = reducedMotion ?? this.detectReducedMotion();

    if (shouldReduceMotion) {
      return {
        particles: {
          move: {
            enable: false,
          },
          opacity: {
            value: 0.6,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
          },
        },
      };
    }

    return {};
  }

  /**
   * Combines all configurations into final options
   */
  public getFinalConfig(reducedMotion?: boolean): ISourceOptions {
    const baseConfig = this.getBaseConfig();
    const responsiveConfig = this.getResponsiveConfig();
    const accessibilityConfig = this.getAccessibilityConfig(reducedMotion);

    return {
      ...baseConfig,
      ...accessibilityConfig,
      responsive: responsiveConfig,
    };
  }

  /**
   * Configuration for testing environment
   */
  public getTestConfig(): ISourceOptions {
    const baseConfig = this.getBaseConfig();
    
    return {
      ...baseConfig,
      particles: {
        ...baseConfig.particles,
        number: {
          ...baseConfig.particles?.number,
          value: 10, // Fewer particles for testing
        },
      },
      fpsLimit: 1, // Minimal FPS for testing
      interactivity: {
        ...baseConfig.interactivity,
        events: {
          onHover: {
            enable: false,
          },
          onClick: {
            enable: false,
          },
        },
      },
    };
  }
}