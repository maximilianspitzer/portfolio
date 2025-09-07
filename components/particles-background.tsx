'use client';

import { useCallback, useEffect, useState } from 'react';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, Container } from '@tsparticles/engine';

import { ParticlesConfigurationManager } from '@/lib/particles-config';
import { shouldEnableParticles } from '@/lib/particles-utils';
import { useResponsive } from '@/hooks/useResponsive';
import { prefersReducedMotion, isLowPoweredDevice } from '@/lib/responsive-utils';
import { trackPortfolioEvent } from '@/lib/analytics';
import type { ParticlesBackgroundProps } from '@/types/particles';

/**
 * ParticlesBackground Component - Mobile-First Responsive
 *
 * Renders an interactive particle background optimized for mobile performance:
 * - Mobile: Max 30 particles with reduced complexity
 * - Tablet: 50 particles with moderate complexity 
 * - Desktop: 80-100 particles with full effects
 * - Respects prefers-reduced-motion and low-powered device detection
 * - Automatic performance monitoring and adjustment
 * - Theme-aware colors with mobile optimizations
 */
export default function ParticlesBackground({
  className = '',
  id = 'particles-background',
  reducedMotion,
}: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performanceOptimized, setPerformanceOptimized] = useState(false);
  
  // Get responsive state for mobile-first optimization
  const { currentBreakpoint, deviceInfo, viewportWidth } = useResponsive();
  const { isMobile } = deviceInfo;
  
  // Performance optimization flags
  const shouldReduceMotion = reducedMotion ?? prefersReducedMotion();
  const isLowPowered = isLowPoweredDevice();
  const shouldOptimizeForPerformance = isMobile || isLowPowered;

  // Initialize tsParticles engine with responsive optimization
  useEffect(() => {
    // Check if particles should be enabled based on user preferences and capabilities
    if (!shouldEnableParticles()) {
      return;
    }

    const initEngine = async () => {
      try {
        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine);
        });
        setInit(true);
        
        // Track particle initialization for analytics
        trackPortfolioEvent.custom('particles_initialized', {
          breakpoint: currentBreakpoint,
          is_mobile: isMobile,
          is_low_powered: isLowPowered,
          reduced_motion: shouldReduceMotion,
          viewport_width: viewportWidth,
          timestamp: Date.now(),
        });
      } catch (err) {
        setError('Failed to initialize particles engine');
        console.warn('tsParticles initialization error:', err);
        
        // Track initialization errors
        trackPortfolioEvent.custom('particles_init_error', {
          error_message: err instanceof Error ? err.message : 'Unknown error',
          breakpoint: currentBreakpoint,
          is_mobile: isMobile,
          timestamp: Date.now(),
        });
      }
    };

    initEngine();
  }, [currentBreakpoint, isMobile, isLowPowered, shouldReduceMotion, shouldOptimizeForPerformance, viewportWidth]);

  // Handle particles loaded callback with performance monitoring
  const particlesLoaded = useCallback(
    async (container?: Container): Promise<void> => {
      if (container) {
        console.debug(`Particles loaded successfully - ${currentBreakpoint} breakpoint`);
        
        // Start performance monitoring for mobile devices
        if (isMobile) {
          const startTime = performance.now();
          let frameCount = 0;
          
          const monitorPerformance = () => {
            frameCount++;
            const elapsed = performance.now() - startTime;
            
            // Check FPS every 3 seconds on mobile
            if (elapsed > 3000) {
              const avgFps = (frameCount / elapsed) * 1000;
              
              if (avgFps < 15 && !performanceOptimized) {
                console.warn('Low FPS detected on mobile, optimizing particles');
                setPerformanceOptimized(true);
                
                trackPortfolioEvent.custom('particles_performance_optimized', {
                  avg_fps: avgFps,
                  breakpoint: currentBreakpoint,
                  viewport_width: viewportWidth,
                  timestamp: Date.now(),
                });
              }
              
              trackPortfolioEvent.custom('particles_performance_check', {
                avg_fps: avgFps,
                breakpoint: currentBreakpoint,
                frame_count: frameCount,
                elapsed_time: elapsed,
                is_optimized: performanceOptimized,
                timestamp: Date.now(),
              });
              
              return; // Stop monitoring after first check
            }
            
            requestAnimationFrame(monitorPerformance);
          };
          
          requestAnimationFrame(monitorPerformance);
        }
      }
    },
    [currentBreakpoint, isMobile, viewportWidth, performanceOptimized]
  );

  // Generate responsive configuration using the configuration manager
  const configManager = ParticlesConfigurationManager.getInstance();
  
  // Use breakpoint-optimized configuration for better mobile performance
  // Only disable motion if user explicitly prefers reduced motion, not just for performance optimization
  const particleOptions = configManager.getBreakpointOptimizedConfig(
    currentBreakpoint, 
    shouldReduceMotion // Only pass true reduced motion preference, not performance optimization
  );
  
  // Apply additional performance optimizations if needed
  if (performanceOptimized && particleOptions.particles?.number) {
    // Further reduce particle count if performance is poor
    particleOptions.particles.number.value = Math.floor(
      (particleOptions.particles.number.value as number) * 0.7
    );
    particleOptions.fpsLimit = Math.min(particleOptions.fpsLimit || 30, 20);
  }

  // Handle graceful fallback with analytics
  if (error || !init) {
    // Track fallback usage for monitoring
    if (error) {
      trackPortfolioEvent.custom('particles_fallback_used', {
        reason: 'initialization_error',
        breakpoint: currentBreakpoint,
        is_mobile: isMobile,
        error_message: error,
        timestamp: Date.now(),
      });
    }
    
    // Return null to render nothing - hero section works fine without particles
    return null;
  }

  // Render particles with responsive optimizations
  return (
    <Particles
      id={id}
      particlesLoaded={particlesLoaded}
      options={particleOptions}
      className={`absolute inset-0 w-full h-full pointer-events-none ${
        shouldOptimizeForPerformance ? 'will-change-auto' : 'will-change-transform'
      } ${className}`}
      style={{
        zIndex: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // Mobile-specific performance optimizations
        ...(isMobile && {
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        }),
      }}
      aria-hidden="true"
      aria-label={`Interactive particle background - ${isMobile ? 'mobile optimized' : 'desktop'} version`}
    />
  );
}

// Export performance monitoring hook for testing
export const useParticlesPerformance = () => {
  const configManager = ParticlesConfigurationManager.getInstance();
  return configManager.getPerformanceMetrics();
};