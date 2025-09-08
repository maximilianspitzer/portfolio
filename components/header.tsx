'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackPortfolioEvent } from '@/lib/analytics';

export default function Header() {
  const { dictionary, language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });

    // Track navigation click
    trackPortfolioEvent.navigationClick(sectionId);
  };

  const handleLanguageChange = (newLanguage: 'de' | 'en') => {
    setLanguage(newLanguage);

    // Track language change
    trackPortfolioEvent.languageChange(newLanguage);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Track mobile menu interaction
    trackPortfolioEvent.custom('mobile_menu_toggle', {
      action: isMobileMenuOpen ? 'close' : 'open',
      timestamp: Date.now(),
    });
  };

  const handleMobileNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex min-h-[var(--touch-target-comfortable)] items-center justify-between py-2">
        <div className="flex items-center space-responsive-xs">
          <h1 className="text-responsive-lg font-bold tracking-tight">
            Maximilian Spitzer
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-responsive-md text-responsive-sm font-medium">
          <button
            onClick={() => scrollToSection('about')}
            className="touch-target transition-colors hover:text-foreground/80 text-foreground/60 btn-focus rounded-md"
          >
            {dictionary.nav.about}
          </button>
          <button
            onClick={() => scrollToSection('work')}
            className="touch-target transition-colors hover:text-foreground/80 text-foreground/60 btn-focus rounded-md"
          >
            {dictionary.nav.work}
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="touch-target transition-colors hover:text-foreground/80 text-foreground/60 btn-focus rounded-md"
          >
            {dictionary.nav.services}
          </button>
          <button
            onClick={() => scrollToSection('process')}
            className="touch-target transition-colors hover:text-foreground/80 text-foreground/60 btn-focus rounded-md"
          >
            {dictionary.nav.process}
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="touch-target transition-colors hover:text-foreground/80 text-foreground/60 btn-focus rounded-md"
          >
            {dictionary.nav.contact}
          </button>
        </nav>

        <div className="flex items-center space-responsive-sm">
          {/* Language toggle */}
          <div className="flex items-center bg-accent rounded-md p-1 space-x-1">
            <button
              onClick={() => handleLanguageChange('de')}
              className={`touch-target text-responsive-sm font-medium rounded transition-colors btn-focus ${
                language === 'de'
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`touch-target text-responsive-sm font-medium rounded transition-colors btn-focus ${
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
            onClick={toggleMobileMenu}
            className="md:hidden touch-target-comfortable rounded-md hover:bg-accent btn-focus active:scale-98"
            aria-label={isMobileMenuOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container mx-auto py-4">
            <div className="flex flex-col space-responsive-sm">
              <button
                onClick={() => handleMobileNavClick('about')}
                className="touch-target-comfortable text-left text-responsive-base font-medium text-foreground/80 hover:text-foreground transition-colors btn-focus rounded-md active:scale-98"
              >
                {dictionary.nav.about}
              </button>
              <button
                onClick={() => handleMobileNavClick('work')}
                className="touch-target-comfortable text-left text-responsive-base font-medium text-foreground/80 hover:text-foreground transition-colors btn-focus rounded-md active:scale-98"
              >
                {dictionary.nav.work}
              </button>
              <button
                onClick={() => handleMobileNavClick('services')}
                className="touch-target-comfortable text-left text-responsive-base font-medium text-foreground/80 hover:text-foreground transition-colors btn-focus rounded-md active:scale-98"
              >
                {dictionary.nav.services}
              </button>
              <button
                onClick={() => handleMobileNavClick('process')}
                className="touch-target-comfortable text-left text-responsive-base font-medium text-foreground/80 hover:text-foreground transition-colors btn-focus rounded-md active:scale-98"
              >
                {dictionary.nav.process}
              </button>
              <button
                onClick={() => handleMobileNavClick('contact')}
                className="touch-target-comfortable text-left text-responsive-base font-medium text-foreground/80 hover:text-foreground transition-colors btn-focus rounded-md active:scale-98"
              >
                {dictionary.nav.contact}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
