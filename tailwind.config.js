/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Enhanced breakpoint system with xs breakpoint for mobile-first approach
      screens: {
        xs: '475px',
        // sm: '640px' (default)
        // md: '768px' (default)
        // lg: '1024px' (default)
        // xl: '1280px' (default)
        // 2xl: '1536px' (default)
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
      },
      // Enhanced container configuration with responsive padding and max-width constraints
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          xs: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
        screens: {
          xs: '100%',
          sm: '100%',
          md: '100%',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1200px', // Max container width as per spec
        },
      },
      // Responsive spacing scale for consistent mobile-first scaling
      spacing: {
        // Responsive spacing utilities using CSS custom properties
        'responsive-xs': 'var(--spacing-xs, 0.5rem)',
        'responsive-sm': 'var(--spacing-sm, 1rem)',
        'responsive-md': 'var(--spacing-md, 1.5rem)',
        'responsive-lg': 'var(--spacing-lg, 2rem)',
        'responsive-xl': 'var(--spacing-xl, 3rem)',
        'responsive-2xl': 'var(--spacing-2xl, 4rem)',
        // Touch-friendly minimum sizes
        'touch-target': '44px',
        'touch-target-lg': '48px',
      },
      // Responsive typography scale for mobile-first typography
      fontSize: {
        // Responsive text sizes using CSS custom properties
        'responsive-xs': ['var(--text-xs, 0.75rem)', { lineHeight: '1.5' }],
        'responsive-sm': ['var(--text-sm, 0.875rem)', { lineHeight: '1.5' }],
        'responsive-base': ['var(--text-base, 1rem)', { lineHeight: '1.6' }],
        'responsive-lg': ['var(--text-lg, 1.125rem)', { lineHeight: '1.6' }],
        'responsive-xl': ['var(--text-xl, 1.25rem)', { lineHeight: '1.5' }],
        'responsive-2xl': ['var(--text-2xl, 1.5rem)', { lineHeight: '1.4' }],
        'responsive-3xl': ['var(--text-3xl, 2rem)', { lineHeight: '1.3' }],
        'responsive-4xl': ['var(--text-4xl, 2.5rem)', { lineHeight: '1.2' }],
      },
      // Enhanced line height scale for better mobile readability
      lineHeight: {
        mobile: '1.6',
        tablet: '1.7',
        desktop: '1.8',
      },
      // Responsive layout utilities
      maxWidth: {
        'prose-mobile': '320px',
        'prose-tablet': '640px',
        'prose-desktop': '768px',
      },
      // Animation duration with reduced motion support
      animationDuration: {
        mobile: '200ms',
        tablet: '250ms',
        desktop: '300ms',
      },
    },
  },
  plugins: [],
};
