'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { projects, Project } from '@/content/projects';
import { trackPortfolioEvent } from '@/lib/analytics';
import { useSectionTracking } from '@/hooks/useAnalyticsTracking';
import ProjectModal from './project-modal';

export default function WorkGrid() {
  const { dictionary } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useSectionTracking('work');

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
    
    // Track project modal open
    trackPortfolioEvent.projectModalOpen(project.id, getProjectText(project.titleKey));
  };

  const closeModal = () => {
    if (selectedProject) {
      // Track modal close
      trackPortfolioEvent.projectModalClose(selectedProject.id, getProjectText(selectedProject.titleKey));
    }
    setSelectedProject(null);
  };

  return (
    <section ref={sectionRef} id="work" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {dictionary.work.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.work.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-accent border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => openModal(project)}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <Image
                  src={project.previewImage}
                  alt={getProjectText(project.titleKey)}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                  {getProjectText(project.titleKey)}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {getProjectText(project.descriptionKey)}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                
                <button className="text-sm text-foreground hover:text-foreground/80 transition-colors font-medium">
                  {dictionary.work.view_project} →
                </button>
              </div>
            </div>
          ))}
        </div>

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