import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ParticlesConfigurationManager } from '@/lib/particles-config';

interface TestLinksConfig {
  enable?: boolean;
  distance?: number;
  opacity?: number;
  width?: number;
}

const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

const mockGetComputedStyle = (properties: Record<string, string>) => {
  return vi.fn().mockImplementation(() => ({
    getPropertyValue: vi
      .fn()
      .mockImplementation((prop) => properties[prop] || ''),
  }));
};

describe('ParticlesConfigurationManager', () => {
  let configManager: ParticlesConfigurationManager;

  beforeEach(() => {
    vi.clearAllMocks();
    configManager = ParticlesConfigurationManager.getInstance();

    // Mock window.matchMedia
    window.matchMedia = mockMatchMedia(false);

    // Mock getComputedStyle
    window.getComputedStyle = mockGetComputedStyle({
      '--foreground': '#ffffff',
      '--muted-foreground': '#a3a3a3',
      '--accent': '#171717',
    });
  });

  describe('getInstance', () => {
    it('returns a singleton instance', () => {
      const instance1 = ParticlesConfigurationManager.getInstance();
      const instance2 = ParticlesConfigurationManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getThemeAwareColors', () => {
    it('returns default colors on server side', () => {
      // Mock server-side environment
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally deleting window for SSR test
      delete global.window;

      const colors = configManager.getThemeAwareColors();

      expect(colors).toEqual({
        particle: '#ffffff',
        links: 'rgba(163, 163, 163, 0.2)',
        background: 'transparent',
        hover: 'rgba(255, 255, 255, 0.1)',
      });

      global.window = originalWindow;
    });

    it('returns colors from CSS custom properties', () => {
      const colors = configManager.getThemeAwareColors();

      expect(colors.particle).toBe('#ffffff');
      expect(colors.links).toBe('rgba(163, 163, 163, 0.3)');
      expect(colors.background).toBe('transparent');
      expect(colors.hover).toBe('#171717');
    });

    it('falls back to defaults when CSS properties are empty', () => {
      window.getComputedStyle = mockGetComputedStyle({});

      const colors = configManager.getThemeAwareColors();

      expect(colors.particle).toBe('#ffffff');
      expect(colors.hover).toBe('#171717');
    });
  });

  describe('getBaseConfig', () => {
    it('returns valid base configuration', () => {
      const config = configManager.getBaseConfig();

      expect(config).toMatchObject({
        background: {
          color: {
            value: 'transparent',
          },
          opacity: 0,
        },
        fpsLimit: 60,
        detectRetina: true,
        pauseOnBlur: true,
      });

      expect(config.particles).toBeDefined();
      expect(config.particles?.number?.value).toBe(60);
      expect(config.particles?.opacity?.value).toBe(0.6);
    });

    it('includes proper interactivity settings', () => {
      const config = configManager.getBaseConfig();

      expect(config.interactivity).toMatchObject({
        detectsOn: 'parent',
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          onClick: {
            enable: false,
            mode: 'push',
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      });
    });

    it('sets particle appearance correctly', () => {
      const config = configManager.getBaseConfig();

      expect(config.particles?.color?.value).toBe('#ffffff');

      const links = config.particles?.links as TestLinksConfig;
      expect(links?.enable).toBe(true);
      expect(links?.distance).toBe(150);
      expect(links?.opacity).toBe(0.3);
      expect(links?.width).toBe(1);
    });

    it('configures particle movement', () => {
      const config = configManager.getBaseConfig();

      expect(config.particles?.move).toMatchObject({
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 1,
        straight: false,
      });
    });
  });

  describe('getResponsiveConfig', () => {
    it('returns responsive breakpoints', () => {
      const responsive = configManager.getResponsiveConfig();

      expect(responsive).toHaveLength(2);

      // Tablet breakpoint
      expect(responsive[0]).toMatchObject({
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
      });

      // Mobile breakpoint
      expect(responsive[1]).toMatchObject({
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
      });
    });
  });

  describe('getAccessibilityConfig', () => {
    it('returns minimal config when reduced motion is preferred', () => {
      window.matchMedia = mockMatchMedia(true);

      const config = configManager.getAccessibilityConfig();

      expect(config).toMatchObject({
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
      });
    });

    it('returns empty config when reduced motion is not preferred', () => {
      window.matchMedia = mockMatchMedia(false);

      const config = configManager.getAccessibilityConfig();

      expect(config).toEqual({});
    });

    it('respects explicit reducedMotion parameter', () => {
      window.matchMedia = mockMatchMedia(false);

      const config = configManager.getAccessibilityConfig(true);

      expect(config.particles?.move?.enable).toBe(false);
    });

    it('uses media query when no explicit parameter', () => {
      window.matchMedia = mockMatchMedia(true);

      const config = configManager.getAccessibilityConfig();

      expect(config.particles?.move?.enable).toBe(false);
    });
  });

  describe('getFinalConfig', () => {
    it('combines base, responsive, and accessibility configs', () => {
      const finalConfig = configManager.getFinalConfig();

      expect(finalConfig).toBeDefined();
      expect(finalConfig.responsive).toHaveLength(2);
      expect(finalConfig.particles?.number?.value).toBe(60);
      expect(finalConfig.fpsLimit).toBe(60);
    });

    it('applies accessibility config when reduced motion is enabled', () => {
      const finalConfig = configManager.getFinalConfig(true);

      expect(finalConfig.particles?.move?.enable).toBe(false);
      expect(finalConfig.interactivity?.events?.onHover?.enable).toBe(false);
    });

    it('maintains base config when reduced motion is disabled', () => {
      const finalConfig = configManager.getFinalConfig(false);

      expect(finalConfig.particles?.move?.enable).toBe(true);
      expect(finalConfig.interactivity?.events?.onHover?.enable).toBe(true);
    });
  });

  describe('getTestConfig', () => {
    it('returns minimal config for testing', () => {
      const testConfig = configManager.getTestConfig();

      expect(testConfig.particles?.number?.value).toBe(10);
      expect(testConfig.fpsLimit).toBe(1);
      expect(testConfig.interactivity?.events?.onHover?.enable).toBe(false);
      expect(testConfig.interactivity?.events?.onClick?.enable).toBe(false);
    });

    it('maintains base structure for testing', () => {
      const testConfig = configManager.getTestConfig();

      expect(testConfig.particles?.color?.value).toBeDefined();

      const links = testConfig.particles?.links as TestLinksConfig;
      expect(links?.enable).toBe(true);
      expect(testConfig.background).toBeDefined();
    });
  });
});
