import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AnalyticsProvider from '@/components/analytics-provider';
import SkipToContent from '@/components/skip-to-content';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'maximilianspitzer.de | Web Developer & Designer',
    template: '%s | maximilianspitzer.de',
  },
  description:
    'Modern web applications and digital experiences with React, Next.js, and TypeScript. Professional web development services in Germany.',
  keywords: [
    'web development',
    'React',
    'Next.js',
    'TypeScript',
    'frontend',
    'full-stack',
    'UI/UX',
    'Germany',
  ],
  authors: [{ name: 'Maximilian Spitzer' }],
  creator: 'Maximilian Spitzer',
  publisher: 'Maximilian Spitzer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    url: 'https://maximilianspitzer.de',
    siteName: 'Maximilian Spitzer Portfolio',
    title: 'Maximilian Spitzer - Web Developer & Designer',
    description:
      'Modern web applications and digital experiences with React, Next.js, and TypeScript.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Maximilian Spitzer - Web Developer & Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maximilian Spitzer - Web Developer & Designer',
    description:
      'Modern web applications and digital experiences with React, Next.js, and TypeScript.',
    images: ['/og.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <SkipToContent />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <AnalyticsProvider />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
