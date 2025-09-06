'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold tracking-tight">
            Maximilian Spitzer
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a
            href="#about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Über mich
          </a>
          <a
            href="#projects"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Projekte
          </a>
          <a
            href="#experience"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Erfahrung
          </a>
          <a
            href="#contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Kontakt
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          aria-label="Menu öffnen"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}