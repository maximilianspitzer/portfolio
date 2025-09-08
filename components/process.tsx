'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';
import { useResponsive } from '@/hooks/useResponsive';

export default function Process() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('process');
  const { deviceInfo } = useResponsive();

  return (
    <section ref={sectionRef} id="process" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 max-w-4xl mx-auto">
            {dictionary.process.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {dictionary.process.subtitle}
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Timeline - Only render when NOT mobile */}
          {!deviceInfo.isMobile && (
            <>
              {/* Vertical timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />
              
              {/* Desktop alternating layout */}
              <div className="space-y-16 lg:space-y-20">
                {dictionary.process.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Content Card */}
                    <div className="flex-1 max-w-lg">
                      <div className="bg-accent p-6 lg:p-8 rounded-lg border border-border hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-transform group-hover:scale-110">
                            {index + 1}
                          </div>
                          <h3 className="text-xl lg:text-2xl font-semibold text-foreground">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg lg:text-xl z-10 shadow-lg border-4 border-background">
                      {index + 1}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 max-w-lg" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Mobile Timeline - Only render when mobile */}
          {deviceInfo.isMobile && (
            <div className="relative">
              {/* Vertical timeline line for mobile */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Mobile vertical layout */}
              <div className="space-y-8">
                {dictionary.process.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-6">
                    {/* Mobile timeline node with 48px touch target */}
                    <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg border-2 border-background relative z-10">
                      {index + 1}
                    </div>
                    
                    {/* Mobile content card */}
                    <div className="bg-accent p-6 rounded-lg border border-border flex-1 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
