/**
 * tsParticles Configuration Manager
 * Handles particle system configuration with theme integration, accessibility, and responsive design
 */

import type { ISourceOptions } from '@tsparticles/engine';
import type { ResponsiveOption, ThemeColors } from '@/types/particles';

export class ParticlesConfigurationManager {
  private static instance: ParticlesConfigurationManager;
  private performanceMonitor?: {
    frameCount: number;
    startTime: number;
    avgFps: number;
  };

  private constructor() {
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
  }
  
  /**
   * Initialize performance monitoring for automatic particle adjustment
   */
  private initPerformanceMonitoring() {
    if (typeof window === 'undefined') return;
    
    this.performanceMonitor = {
      frameCount: 0,
      startTime: Date.now(),
      avgFps: 60,
    };
    
    // Monitor FPS and adjust particle count automatically
    const monitorFps = () => {
      if (!this.performanceMonitor) return;
      
      this.performanceMonitor.frameCount++;
      const elapsed = Date.now() - this.performanceMonitor.startTime;
      
      if (elapsed > 2000) { // Check every 2 seconds
        this.performanceMonitor.avgFps = (this.performanceMonitor.frameCount / elapsed) * 1000;
        
        // If FPS is too low on mobile, we should reduce particles further
        if (window.innerWidth < 768 && this.performanceMonitor.avgFps < 20) {
          console.warn('Low FPS detected on mobile, consider reducing particle count');
        }
        
        // Reset counters
        this.performanceMonitor.frameCount = 0;
        this.performanceMonitor.startTime = Date.now();
      }
      
      requestAnimationFrame(monitorFps);
    };
    
    // Start monitoring after a short delay
    setTimeout(() => {
      requestAnimationFrame(monitorFps);
    }, 1000);
  }
  
  /**
   * Get current performance metrics
   */
  public getPerformanceMetrics() {
    return this.performanceMonitor;
  }

  public static getInstance(): ParticlesConfigurationManager {
    if (!ParticlesConfigurationManager.instance) {
      ParticlesConfigurationManager.instance =
        new ParticlesConfigurationManager();
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
   * Gets theme-aware colors from CSS custom properties with mobile optimization
   */
  public getThemeAwareColors(): ThemeColors {
    if (typeof window === 'undefined') {
      // Server-side fallback
      return {
        particle: '#ffffff',
        links: 'rgba(163, 163, 163, 0.2)',
        background: 'transparent',
        hover: 'rgba(255, 255, 255, 0.1)',
      };
    }

    const computedStyle = getComputedStyle(document.documentElement);
    const isMobile = window.innerWidth < 768;
    
    // Reduce opacity on mobile for better performance and less visual noise
    const linkOpacity = isMobile ? 0.15 : 0.3;
    // const particleOpacity = isMobile ? 0.4 : 0.6; // Reserved for future use

    return {
      particle:
        computedStyle.getPropertyValue('--foreground').trim() || '#ffffff',
      links: `rgba(163, 163, 163, ${linkOpacity})`,
      background: 'transparent',
      hover: computedStyle.getPropertyValue('--accent').trim() || '#171717',
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
        opacity: 0,
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
          triangles: {
            enable: true,
            opacity: 0.015,
          },
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
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
          value: 100,
        },
        opacity: {
          value: 0.6,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 2, max: 4 },
        },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          onClick: {
            enable: true,
            mode: 'push',
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
          },
        },
      },
    };
  }

  /**
   * Generates responsive configuration for different screen sizes with mobile optimization
   * CRITICAL: Mobile devices get max 30 particles, desktop gets 100
   */
  public getResponsiveConfig(): ResponsiveOption[] {
    return [
      // Large desktop (1200px+)
      {
        minWidth: 1200,
        options: {
          particles: {
            number: {
              value: 100, // Full desktop experience
              density: {
                enable: true,
                width: 1920,
                height: 1080,
              },
            },
            links: {
              distance: 150,
              opacity: 0.3,
            },
            move: {
              enable: true, // Explicitly enable movement
              speed: 2,
            },
            size: {
              value: { min: 3, max: 5 },
            },
          },
          fpsLimit: 60,
        },
      },
      // Desktop (1024px - 1199px)
      {
        minWidth: 1024,
        maxWidth: 1199,
        options: {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                width: 1200,
                height: 900,
              },
            },
            links: {
              distance: 140,
              opacity: 0.25,
            },
            move: {
              enable: true, // Explicitly enable movement
              speed: 1.5,
            },
            size: {
              value: { min: 2, max: 4 },
            },
          },
          fpsLimit: 60,
        },
      },
      // Tablet (768px - 1023px)
      {
        minWidth: 768,
        maxWidth: 1023,
        options: {
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                width: 1024,
                height: 768,
              },
            },
            links: {
              distance: 120,
              opacity: 0.2,
            },
            move: {
              enable: true, // Explicitly enable movement
              speed: 1,
            },
            size: {
              value: { min: 2, max: 3 },
            },
          },
          fpsLimit: 45,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'repulse',
              },
            },
            modes: {
              repulse: {
                distance: 80,
                duration: 0.3,
              },
            },
          },
        },
      },
      // Large mobile (640px - 767px)
      {
        minWidth: 640,
        maxWidth: 767,
        options: {
          particles: {
            number: {
              value: 30, // CRITICAL: Max 30 particles on mobile
              density: {
                enable: true,
                width: 800,
                height: 600,
              },
            },
            links: {
              distance: 100,
              opacity: 0.15,
            },
            move: {
              enable: true, // Explicitly enable movement
              speed: 0.8,
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          fpsLimit: 30,
          interactivity: {
            events: {
              onHover: {
                enable: false, // Disable hover on mobile
              },
              onClick: {
                enable: true,
                mode: 'push',
              },
            },
            modes: {
              push: {
                quantity: 1, // Reduce push quantity on mobile
              },
            },
          },
        },
      },
      // Small mobile (320px - 639px)
      {
        maxWidth: 639,
        options: {
          particles: {
            number: {
              value: 20, // Even fewer particles for small screens
              density: {
                enable: true,
                width: 400,
                height: 600,
              },
            },
            links: {
              distance: 80,
              opacity: 0.1,
            },
            move: {
              enable: true, // Explicitly enable movement
              speed: 0.5,
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          fpsLimit: 24,
          interactivity: {
            events: {
              onHover: {
                enable: false,
              },
              onClick: {
                enable: false, // Disable all interactions on very small screens
              },
            },
          },
        },
      },
    ];
  }

  /**
   * Detects low-powered device for additional performance optimization
   */
  private detectLowPoweredDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    // Check device memory (if available)
    const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    if (deviceMemory && deviceMemory <= 2) {
      return true;
    }
    
    // Check hardware concurrency (CPU cores)
    const hardwareConcurrency = navigator.hardwareConcurrency;
    if (hardwareConcurrency && hardwareConcurrency <= 2) {
      return true;
    }
    
    return false;
  }

  /**
   * Generates accessibility-aware configuration with enhanced mobile optimization
   */
  public getAccessibilityConfig(
    reducedMotion?: boolean
  ): Partial<ISourceOptions> {
    const shouldReduceMotion = reducedMotion ?? this.detectReducedMotion();
    const isLowPowered = this.detectLowPoweredDevice();

    // ONLY disable motion if user explicitly prefers reduced motion
    if (shouldReduceMotion) {
      return {
        particles: {
          move: {
            enable: false, // Completely disable motion for reduced motion preference
          },
          opacity: {
            value: 0.4, // Reduced opacity for less visual noise
          },
          number: {
            value: 15, // Even fewer particles for reduced motion
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
        fpsLimit: 15, // Very low FPS for reduced motion
      };
    }

    // For low-powered devices, reduce performance but keep motion enabled
    if (isLowPowered) {
      return {
        particles: {
          number: {
            value: 15, // Minimal particles for low-powered devices
          },
          move: {
            speed: 0.2, // Slower movement, but still enabled
            enable: true, // Keep movement enabled
          },
          links: {
            opacity: 0.1,
          },
        },
        fpsLimit: 20,
        interactivity: {
          events: {
            onHover: {
              enable: false, // Disable hover for performance
            },
          },
        },
      };
    }

    return {};
  }

  /**
   * Get performance-optimized config based on device capabilities
   */
  public getPerformanceConfig(): Partial<ISourceOptions> {
    if (typeof window === 'undefined') return {};
    
    const isMobile = window.innerWidth < 768;
    const isLowPowered = this.detectLowPoweredDevice();
    
    if (isMobile || isLowPowered) {
      return {
        particles: {
          move: {
            outModes: {
              default: 'out', // Particles disappear instead of bouncing (better performance)
            },
          },
          links: {
            triangles: {
              enable: false, // Disable triangles on mobile for better performance
            },
          },
        },
        detectRetina: false, // Disable retina detection on mobile
        pauseOnBlur: true, // Always pause when not visible
      };
    }
    
    return {};
  }

  /**
   * Combines all configurations into final options with performance optimization
   */
  public getFinalConfig(reducedMotion?: boolean): ISourceOptions {
    const baseConfig = this.getBaseConfig();
    const responsiveConfig = this.getResponsiveConfig();
    const accessibilityConfig = this.getAccessibilityConfig(reducedMotion);
    const performanceConfig = this.getPerformanceConfig();

    return {
      ...baseConfig,
      ...performanceConfig,
      ...accessibilityConfig,
      responsive: responsiveConfig,
    };
  }

  /**
   * Get configuration optimized for specific breakpoint
   */
  public getBreakpointOptimizedConfig(breakpoint: string, reducedMotion?: boolean): ISourceOptions {
    const baseConfig = this.getFinalConfig(reducedMotion);
    
    // Apply specific optimizations based on breakpoint
    const breakpointOptimizations = {
      xs: { particleCount: 15, fps: 20, speed: 0.3 },
      sm: { particleCount: 20, fps: 24, speed: 0.5 },
      md: { particleCount: 50, fps: 45, speed: 1.0 },
      lg: { particleCount: 80, fps: 60, speed: 1.5 },
      xl: { particleCount: 100, fps: 60, speed: 2.0 },
      '2xl': { particleCount: 100, fps: 60, speed: 2.0 },
    };
    
    const optimization = breakpointOptimizations[breakpoint as keyof typeof breakpointOptimizations] 
      || breakpointOptimizations.md;
    
    return {
      ...baseConfig,
      particles: {
        ...baseConfig.particles,
        number: {
          ...baseConfig.particles?.number,
          value: optimization.particleCount,
        },
        move: {
          ...baseConfig.particles?.move,
          enable: true, // Explicitly enable movement for mobile
          speed: optimization.speed,
        },
      },
      fpsLimit: optimization.fps,
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
          value: 5, // Minimal particles for testing
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
