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

  const handleLinkedInClick = () => {
    trackPortfolioEvent.contactMethodClick('social', 'https://www.linkedin.com/in/maximilian-spitzer/');
  };

  const handlePhoneClick = () => {
    trackPortfolioEvent.contactMethodClick('phone', dictionary.contact.phoneNumber);
  };

  return (
    <section ref={sectionRef} id="contact" className="py-12 xs:py-16 sm:py-20 bg-foreground">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Responsive typography with fluid scaling */}
          <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-background mb-3 xs:mb-4">
            {dictionary.contact.title}
          </h2>
          <p className="text-base xs:text-lg text-background/80 mb-6 xs:mb-8 max-w-2xl mx-auto leading-relaxed">
            {dictionary.contact.subtitle}
          </p>

          {/* Mobile-first responsive layout with touch-friendly targets */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
            <a
              href={`mailto:${dictionary.contact.email}`}
              onClick={() => handleEmailClick()}
              className="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] px-6 py-3 bg-background text-foreground rounded-md font-medium hover:bg-background/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-background/50 focus:ring-offset-2 focus:ring-offset-foreground"
              aria-label={`${dictionary.contact.cta} - ${dictionary.contact.email}`}
            >
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="truncate">{dictionary.contact.cta}</span>
            </a>

            <a
              href="https://www.linkedin.com/in/maximilian-spitzer/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkedInClick()}
              className="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] px-6 py-3 bg-background text-foreground rounded-md font-medium hover:bg-background/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-background/50 focus:ring-offset-2 focus:ring-offset-foreground"
              aria-label={dictionary.contact.linkedin}
            >
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="truncate">{dictionary.contact.linkedin}</span>
            </a>

            <a
              href={`tel:${dictionary.contact.phoneNumber}`}
              onClick={() => handlePhoneClick()}
              className="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] px-6 py-3 bg-background text-foreground rounded-md font-medium hover:bg-background/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-background/50 focus:ring-offset-2 focus:ring-offset-foreground"
              aria-label={`${dictionary.contact.phone} - ${dictionary.contact.phoneNumber}`}
            >
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="truncate">{dictionary.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
