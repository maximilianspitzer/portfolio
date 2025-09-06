'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { trackPortfolioEvent } from '@/lib/analytics';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';

export default function Services() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('services');

  const handleServiceClick = (serviceName: string) => {
    trackPortfolioEvent.serviceClick(serviceName);
  };

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {dictionary.services.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dictionary.services.items.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="bg-background p-6 rounded-lg border border-border hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {/* Service icons */}
                  {index === 0 && (
                    <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}