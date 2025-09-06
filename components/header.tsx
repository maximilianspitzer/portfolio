'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { dictionary, language, setLanguage } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold tracking-tight">
            Maximilian Spitzer
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button
            onClick={() => scrollToSection('about')}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {dictionary.nav.about}
          </button>
          <button
            onClick={() => scrollToSection('work')}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {dictionary.nav.work}
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {dictionary.nav.services}
          </button>
          <button
            onClick={() => scrollToSection('process')}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {dictionary.nav.process}
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {dictionary.nav.contact}
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Language toggle */}
          <div className="flex items-center space-x-1 bg-accent rounded-md p-1">
            <button
              onClick={() => setLanguage('de')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                language === 'de' 
                  ? 'bg-foreground text-background' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                language === 'en' 
                  ? 'bg-foreground text-background' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>

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
      </div>
    </header>
  );
}