'use client';

import Hero from '@/components/hero';
import About from '@/components/about';
import WorkGrid from '@/components/work-grid';
import Services from '@/components/services';
import Process from '@/components/process';
import ContactStrip from '@/components/contact-strip';
import { 
  useScrollDepthTracking, 
  useExternalLinkTracking 
} from '@/hooks/useAnalyticsTracking';

export default function Home() {
  // Initialize meaningful analytics tracking only
  useScrollDepthTracking();
  useExternalLinkTracking();

  return (
    <>
      <Hero />
      <About />
      <WorkGrid />
      <Services />
      <Process />
      <ContactStrip />
    </>
  );
}
