'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { trackPortfolioEvent } from '@/lib/analytics';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';
import ParticlesBackground from '@/components/particles-background';

export default function Hero() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrimaryCTA = () => {
    scrollToSection('work');
    trackPortfolioEvent.heroCtaClick('view_work');
  };

  const handleSecondaryCTA = () => {
    scrollToSection('contact');
    trackPortfolioEvent.heroCtaClick('contact');
  };

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center bg-background"
    >
      {/* Particles Background Layer */}
      <ParticlesBackground />
      
      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 text-center pointer-events-none">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            {dictionary.hero.headline}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            {dictionary.hero.subhead}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button
              onClick={handlePrimaryCTA}
              className="px-8 py-3 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 transition-all duration-200 hover:scale-105 pointer-events-auto"
            >
              {dictionary.hero.cta_primary}
            </button>
            
            <button
              onClick={handleSecondaryCTA}
              className="px-8 py-3 border border-border text-foreground rounded-md font-medium hover:bg-accent transition-all duration-200 hover:scale-105 pointer-events-auto"
            >
              {dictionary.hero.cta_secondary}
            </button>
          </div>
        </div>
      </div>
      {/* Fade overlay at bottom of hero - same technique as your other project */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-40"
        style={{
          background: `linear-gradient(to top, 
            #0a0a0a 0%,
            #050505 25%,
            #020202 50%,
            #010101 75%,
            transparent 100%)`
        }}
      />
    </section>
  );
}