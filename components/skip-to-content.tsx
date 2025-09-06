'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function SkipToContent() {
  const { language } = useLanguage();

  const text = language === 'de' ? 'Zum Hauptinhalt springen' : 'Skip to main content';

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="skip-to-content"
    >
      {text}
    </a>
  );
}