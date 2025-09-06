'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { dictionary } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            {dictionary.hero.headline}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            {dictionary.hero.subhead}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button
              onClick={() => scrollToSection('work')}
              className="px-8 py-3 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 transition-all duration-200 hover:scale-105"
            >
              {dictionary.hero.cta_primary}
            </button>
            
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border border-border text-foreground rounded-md font-medium hover:bg-accent transition-all duration-200 hover:scale-105"
            >
              {dictionary.hero.cta_secondary}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}