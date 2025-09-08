'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';

export default function About() {
  const { dictionary } = useLanguage();
  const sectionRef = useSectionTracking('about');

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-muted relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {dictionary.about.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg flex items-center justify-center">
                <Image
                  src="/profile.jpg"
                  alt="Profile picture"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="prose prose-gray max-w-none">
                {dictionary.about.content
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-muted-foreground leading-relaxed text-lg mb-4"
                    >
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>

              {/* Skills/Technologies */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'React', url: 'https://reactjs.org' },
                    { name: 'Next.js', url: 'https://nextjs.org' },
                    {
                      name: 'TypeScript',
                      url: 'https://www.typescriptlang.org',
                    },
                    { name: 'Node.js', url: 'https://nodejs.org' },
                    { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
                    { name: 'Python', url: 'https://www.python.org' },
                    { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
                    { name: 'Git', url: 'https://git-scm.com' },
                    { name: 'Figma', url: 'https://www.figma.com' },
                    { name: 'Framer', url: 'https://www.framer.com' },
                  ].map((tech) => (
                    <a
                      key={tech.name}
                      href={tech.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-background border border-border rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      {tech.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
