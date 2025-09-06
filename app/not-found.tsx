'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  const content = {
    de: {
      title: 'Seite nicht gefunden',
      subtitle: 'Die angeforderte Seite konnte nicht gefunden werden.',
      description: 'Es tut uns leid, aber die Seite, die Sie suchen, existiert nicht oder wurde verschoben.',
      backToHome: 'Zurück zur Startseite',
      error: '404'
    },
    en: {
      title: 'Page not found',
      subtitle: 'The requested page could not be found.',
      description: 'We\'re sorry, but the page you\'re looking for doesn\'t exist or has been moved.',
      backToHome: 'Back to home',
      error: '404'
    }
  };

  const pageContent = content[language];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Large 404 */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-muted-foreground/20 leading-none">
              {pageContent.error}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {pageContent.title}
            </h2>
            
            <p className="text-xl text-muted-foreground">
              {pageContent.subtitle}
            </p>
            
            <p className="text-muted-foreground max-w-md mx-auto">
              {pageContent.description}
            </p>

            {/* Back to home button */}
            <div className="pt-8">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {pageContent.backToHome}
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center space-x-4 text-muted-foreground/30">
            <div className="w-2 h-2 bg-current rounded-full"></div>
            <div className="w-2 h-2 bg-current rounded-full"></div>
            <div className="w-2 h-2 bg-current rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}