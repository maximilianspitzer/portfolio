'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Project } from '@/content/projects';
import { trackPortfolioEvent } from '@/lib/analytics';
import ImageCarousel from './image-carousel';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { dictionary } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);

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

  // Focus trap and accessibility
  useEffect(() => {
    // Store the previously focused element
    previousFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    modalRef.current?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Handle ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('keydown', handleTab);

    return () => {
      // Restore body scroll
      document.body.style.overflow = 'unset';

      // Return focus to previously focused element
      previousFocusedElement.current?.focus();

      // Remove event listeners
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleTab);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
            aria-label={dictionary.work.close_modal}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Image carousel */}
            {project.images.length > 0 && (
              <div className="mb-6">
                <ImageCarousel
                  images={project.images}
                  alt={getProjectText(project.titleKey)}
                />
              </div>
            )}

            {/* Project details */}
            <div className="space-y-6">
              <div>
                <h2
                  id="modal-title"
                  className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                >
                  {getProjectText(project.titleKey)}
                </h2>
                <p className="text-muted-foreground">
                  {getProjectText(project.longDescriptionKey)}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-md border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackPortfolioEvent.projectLinkClick(
                        project.id,
                        'live',
                        project.liveUrl!
                      )
                    }
                    className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
                  >
                    View Live
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackPortfolioEvent.projectLinkClick(
                        project.id,
                        'github',
                        project.githubUrl!
                      )
                    }
                    className="inline-flex items-center px-4 py-2 border border-border text-foreground rounded-md hover:bg-accent transition-colors"
                  >
                    View Code
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
