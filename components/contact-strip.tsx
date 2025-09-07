'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { trackPortfolioEvent } from '@/lib/analytics';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';

export default function ContactStrip() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('contact');

  const handleEmailClick = () => {
    trackPortfolioEvent.contactMethodClick('email', dictionary.contact.email);
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            {dictionary.contact.title}
          </h2>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            {dictionary.contact.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`mailto:${dictionary.contact.email}`}
              onClick={() => handleEmailClick()}
              className="inline-flex items-center px-8 py-3 bg-background text-foreground rounded-md font-medium hover:bg-background/90 transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {dictionary.contact.cta}
            </a>

            <a
              href={`mailto:${dictionary.contact.email}`}
              onClick={() => handleEmailClick()}
              className="text-background/80 hover:text-background transition-colors text-sm"
            >
              {dictionary.contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
