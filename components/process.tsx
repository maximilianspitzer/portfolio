'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';

export default function Process() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('process');

  return (
    <section ref={sectionRef} id="process" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {dictionary.process.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.process.subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Process timeline */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-border"></div>

          <div className="space-y-12 md:space-y-16">
            {dictionary.process.steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 md:max-w-md">
                  <div className="bg-accent p-6 rounded-lg border border-border hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Timeline node */}
                <div className="hidden md:flex w-12 h-12 bg-foreground rounded-full items-center justify-center text-background font-bold text-lg z-10 relative">
                  {index + 1}
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden mt-12">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
            <div className="space-y-8">
              {dictionary.process.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="bg-accent p-4 rounded-lg border border-border flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}