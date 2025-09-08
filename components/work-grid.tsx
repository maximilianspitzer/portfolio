'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { projects, Project } from '@/content/projects';
import { trackPortfolioEvent } from '@/lib/analytics';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';
import { useResponsive } from '@/hooks/useResponsive';
import ProjectModal from './project-modal';

export default function WorkGrid() {
  const { dictionary } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useSectionTracking('work');
  const { deviceInfo, currentBreakpoint } = useResponsive();

  // Helper function to get nested translation values
  const getProjectText = (key: string): string => {
    const keys = key.split('.');
    let value: Record<string, unknown> | string = dictionary;
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k] as Record<string, unknown> | string;
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);

    // Track project modal open with responsive context
    trackPortfolioEvent.projectModalOpen(
      project.id,
      getProjectText(project.titleKey)
    );

    // Track responsive interaction
    trackPortfolioEvent.custom('work_grid_project_open', {
      project_id: project.id,
      project_title: getProjectText(project.titleKey),
      breakpoint: currentBreakpoint,
      device_type: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop',
      is_touch_device: deviceInfo.hasTouch,
      timestamp: Date.now(),
    });
  };

  const closeModal = () => {
    if (selectedProject) {
      // Track modal close
      trackPortfolioEvent.projectModalClose(
        selectedProject.id,
        getProjectText(selectedProject.titleKey)
      );
    }
    setSelectedProject(null);
  };

  return (
    <section ref={sectionRef} id="work" className="section-spacing bg-background no-horizontal-scroll">
      <div className="container-responsive">
        {/* Header section with responsive typography */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-responsive-3xl font-bold text-foreground mb-4 px-4">
            {dictionary.work.title}
          </h2>
          <p className="text-responsive-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {dictionary.work.subtitle}
          </p>
        </div>

        {/* Mobile-first responsive grid: 1 col mobile, 2 tablet, 3+ desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group bg-accent border border-border rounded-lg overflow-hidden card-hover cursor-pointer 
                         hover:shadow-lg hover:border-foreground/20
                         focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2 focus-within:ring-offset-background"
              onClick={() => openModal(project)}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${getProjectText(project.titleKey)}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(project);
                }
              }}
            >
              {/* Responsive image container with Next.js optimization */}
              <div className="aspect-[4/3] sm:aspect-video bg-muted relative overflow-hidden">
                <Image
                  src={project.previewImage}
                  alt={getProjectText(project.titleKey)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={projects.indexOf(project) < 3} // Priority for first 3 images
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                {/* Mobile-optimized overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 
                                transition-all duration-300 pointer-events-none"></div>
              </div>

              {/* Card content with responsive spacing */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h3 className="text-responsive-xl font-semibold text-foreground 
                              group-hover:text-foreground/80 transition-colors
                              line-clamp-2 leading-tight">
                  {getProjectText(project.titleKey)}
                </h3>
                
                <p className="text-responsive-base text-muted-foreground 
                              line-clamp-2 leading-relaxed">
                  {getProjectText(project.descriptionKey)}
                </p>

                {/* Technology tags with responsive spacing */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {project.technologies.slice(0, deviceInfo.isMobile ? 2 : 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 
                                bg-muted text-muted-foreground 
                                text-xs sm:text-sm rounded-md font-medium
                                transition-colors group-hover:bg-muted/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > (deviceInfo.isMobile ? 2 : 3) && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 
                                    bg-muted text-muted-foreground 
                                    text-xs sm:text-sm rounded-md font-medium
                                    transition-colors group-hover:bg-muted/80">
                      +{project.technologies.length - (deviceInfo.isMobile ? 2 : 3)}
                    </span>
                  )}
                </div>

                {/* Touch-friendly CTA button with minimum 44px touch target */}
                <div className="pt-2 sm:pt-3">
                  <button 
                    className="touch-target inline-flex items-center 
                              text-responsive-sm text-foreground font-medium
                              hover:text-foreground/80 transition-colors
                              btn-focus rounded-md
                              group-hover:translate-x-1 transform transition-transform"
                    aria-hidden="true" // Since the whole card is clickable
                    tabIndex={-1} // Prevent double tab stops
                  >
                    {dictionary.work.view_project} 
                    <span className="ml-1 sm:ml-2 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Project modal with responsive behavior */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  );
}
