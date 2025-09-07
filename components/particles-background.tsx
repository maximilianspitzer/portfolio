'use client';

import { useCallback, useEffect, useState } from 'react';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, Container } from '@tsparticles/engine';

import { ParticlesConfigurationManager } from '@/lib/particles-config';
import { shouldEnableParticles } from '@/lib/particles-utils';
import type { ParticlesBackgroundProps } from '@/types/particles';

/**
 * ParticlesBackground Component
 * 
 * Renders an interactive particle background using tsParticles with:
 * - ~60 semi-transparent particles with connecting lines
 * - Mouse repulsion interaction
 * - Responsive design (fewer particles on mobile)
 * - Accessibility compliance (respects prefers-reduced-motion)
 * - Theme-aware colors
 * - Performance optimization
 */
export default function ParticlesBackground({
  className = '',
  id = 'particles-background',
  reducedMotion,
}: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize tsParticles engine
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
      } catch (err) {
        setError('Failed to initialize particles engine');
        console.warn('tsParticles initialization error:', err);
      }
    };

    initEngine();
  }, []);

  // Handle particles loaded callback
  const particlesLoaded = useCallback(async (container?: Container): Promise<void> => {
    if (container) {
      // Optional: Add performance monitoring or custom initialization logic
      console.debug('Particles loaded successfully');
    }
  }, []);

  // Generate configuration using the configuration manager
  const configManager = ParticlesConfigurationManager.getInstance();
  const particleOptions = configManager.getFinalConfig(reducedMotion);

  // Handle graceful fallback
  if (error || !init) {
    // Return null to render nothing - hero section works fine without particles
    return null;
  }

  // Render particles with proper CSS positioning - fully contained within hero section
  return (
    <Particles
      id={id}
      particlesLoaded={particlesLoaded}
      options={particleOptions}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ 
        zIndex: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
      aria-hidden="true"
    />
  );
}