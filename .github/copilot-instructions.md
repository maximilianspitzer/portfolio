# Copilot Instructions

## Project Overview
This is a modern portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The site features a monochrome design system, multilingual support (German/English), comprehensive analytics tracking, and Docker deployment.

## Architecture & Core Patterns

### Internationalization Structure
- **Context Pattern**: `contexts/LanguageContext.tsx` provides app-wide language state
- **Dictionary System**: Translations in `content/dictionaries/{de,en}.ts` with typed structure
- **Usage**: Components access translations via `const { dictionary } = useLanguage()`
- Default language is German (`'de'`), with HTML lang attribute auto-updating

### Analytics & Tracking
- **Provider Pattern**: `components/analytics-provider.tsx` handles Umami script loading
- **Event Tracking**: Centralized in `lib/analytics.ts` with `trackPortfolioEvent` functions
- **Custom Hooks**: `hooks/useAnalyticsTracking.ts` for scroll depth, section views, external links
- **Configuration**: Environment-based with cookieless mode support
- Track meaningful events: project modal interactions, contact clicks, scroll milestones

### Design System
- **CSS Variables**: Monochrome theme in `app/globals.css` with auto dark mode
- **Tailwind Extension**: Custom colors map to CSS variables for consistent theming
- **Typography**: Inter font with `--font-inter` variable, container max-width 1200px
- **Responsive**: Mobile-first approach with standard Tailwind breakpoints

## Component Architecture

### Layout & Navigation
- **Root Layout**: `app/layout.tsx` wraps everything in LanguageProvider, includes SEO metadata
- **Component Structure**: Header → Main → Footer with SkipToContent for accessibility
- **Page Structure**: Home page (`app/page.tsx`) is client component with section-based layout

### Data Management
- **Projects**: Static data in `content/projects.ts` with TypeScript interfaces
- **Modal Pattern**: `components/project-modal.tsx` for project details with analytics tracking
- **Grid Display**: `components/work-grid.tsx` handles project listing and modal state

### Performance Patterns
- **Client Components**: Mark with `'use client'` only when needed (analytics, modals, interactions)
- **Static Content**: Server components by default for better performance
- **Asset Strategy**: Public folder for images, placeholder content for demo projects

## Development Workflows

### Commands
```bash
pnpm dev --turbopack    # Development with Turbopack
pnpm build --turbopack  # Production build
pnpm type-check         # TypeScript validation
pnpm lint              # ESLint (configured with Next.js rules)
pnpm format            # Prettier formatting
```

### Environment Setup
- **Node.js**: Version 20+ required
- **Package Manager**: Uses pnpm with frozen lockfile
- **Path Aliases**: `@/*` maps to project root via tsconfig paths

### Docker Deployment
- **Multi-stage**: deps → builder → runner stages
- **Standalone Output**: Next.js standalone mode for smaller containers
- **Non-root**: Runs as nextjs user (uid 1001) for security
- **Port**: Exposes 3000, uses HOSTNAME="0.0.0.0"

## Key Files & Patterns

### Component Creation
- Place components in `/components` directory
- Use `'use client'` only for interactive components
- Import hooks from `@/hooks/`, contexts from `@/contexts/`
- Follow pattern: import dependencies → define interfaces → export default component

### Adding New Sections
1. Create component in `/components`
2. Add translations to both `content/dictionaries/de.ts` and `content/dictionaries/en.ts`
3. Use `useSectionTracking('section-name')` hook for analytics
4. Import and add to page layout

### Styling Conventions
- Use Tailwind utility classes with semantic color variables
- Container classes: `container mx-auto px-4` for consistent spacing
- Responsive text: `text-3xl md:text-4xl` pattern for headings
- Dark mode: Automatic via CSS variables, no manual dark: prefixes needed

### Analytics Events
- Use `trackPortfolioEvent.*` functions for user interactions
- Custom hooks handle automatic tracking (scroll, section views, external links)
- Check `isAnalyticsEnabled()` before complex tracking logic

## Code Conventions
- **TypeScript**: Strict mode enabled, prefer explicit types for props and data
- **Import Order**: External packages → internal modules → relative imports
- **File Naming**: kebab-case for components, PascalCase for exports
- **Error Handling**: Use error boundaries for client components, proper fallbacks

## Testing & Validation
- Type checking with `pnpm type-check` before commits
- ESLint configured with Next.js and accessibility rules
- Manual testing across German/English languages for i18n
- Verify analytics events in browser dev tools network tab