'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';

export default function Services() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('services');

  return (
    <section ref={sectionRef} id="services" className="py-12 xs:py-16 sm:py-20 bg-muted">
      <div className="container mx-auto">
        {/* Mobile-first responsive header */}
        <div className="text-center mb-8 xs:mb-12 sm:mb-16">
          <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-foreground mb-3 xs:mb-4">
            {dictionary.services.title}
          </h2>
          <p className="text-base xs:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {dictionary.services.subtitle}
          </p>
        </div>

        {/* Mobile-first responsive grid with proper spacing */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
          {dictionary.services.items.map((service, index) => (
            <div
              key={index}
              className="bg-background p-4 xs:p-6 rounded-lg border border-border hover:shadow-lg transition-all duration-300 group focus-within:ring-2 focus-within:ring-foreground/20 focus-within:ring-offset-2 focus-within:ring-offset-muted"
              role="article"
              aria-labelledby={`service-${index}-title`}
            >
              {/* Touch-friendly icon container */}
              <div className="mb-3 xs:mb-4">
                <div className="w-12 h-12 xs:w-14 xs:h-14 bg-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {/* Service icons */}
                  {index === 0 && (
                    <svg
                      className="w-6 h-6 xs:w-7 xs:h-7 text-background"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg
                      className="w-6 h-6 xs:w-7 xs:h-7 text-background"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg
                      className="w-6 h-6 xs:w-7 xs:h-7 text-background"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg
                      className="w-6 h-6 xs:w-7 xs:h-7 text-background"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Responsive typography with proper hierarchy */}
              <h3 
                id={`service-${index}-title`}
                className="text-lg xs:text-xl font-semibold text-foreground mb-2 xs:mb-3 leading-tight"
              >
                {service.title}
              </h3>

              <p className="text-sm xs:text-base text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
