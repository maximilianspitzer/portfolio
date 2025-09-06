import Hero from '@/components/hero';
import About from '@/components/about';
import WorkGrid from '@/components/work-grid';
import Services from '@/components/services';
import Process from '@/components/process';
import ContactStrip from '@/components/contact-strip';

export default function Home() {
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
