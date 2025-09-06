'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { de } from '@/content/dictionaries/de';
import { en } from '@/content/dictionaries/en';

export type Language = 'de' | 'en';
export type Dictionary = typeof de;

interface LanguageContextType {
  language: Language;
  dictionary: Dictionary;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');

  const dictionary = language === 'de' ? de : en;

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, dictionary, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}