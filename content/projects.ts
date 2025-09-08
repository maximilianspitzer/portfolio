export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey: string;
  technologies: string[];
  images: string[];
  previewImage: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'lumeo-labs',
    titleKey: 'projects.lumeo-labs.title',
    descriptionKey: 'projects.lumeo-labs.description',
    longDescriptionKey: 'projects.lumeo-labs.longDescription',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    images: [
      '/images/lumeo/hero.png',
      '/images/lumeo/pricing.png',
      '/images/lumeo/trust.png',
    ],
    previewImage: '/images/lumeo/preview.png',
    featured: true,
  },
  {
    id: 'coolasfuck-tools',
    titleKey: 'projects.coolasfuck-tools.title',
    descriptionKey: 'projects.coolasfuck-tools.description',
    longDescriptionKey: 'projects.coolasfuck-tools.longDescription',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    images: ['/images/caf/hero.png', '/images/caf/cards.png'],
    previewImage: '/images/caf/preview.png',
    liveUrl: 'https://coolasfuck.tools',
    featured: true,
  },
  {
    id: 'mxp-bio',
    titleKey: 'projects.mxp-bio.title',
    descriptionKey: 'projects.mxp-bio.description',
    longDescriptionKey: 'projects.mxp-bio.longDescription',
    technologies: ['Next.js', 'Typescript', 'Docker'],
    images: ['/images/mxpbio/hero.png', '/images/mxpbio/detail.png'],
    previewImage: '/images/mxpbio/preview.png',
    liveUrl: 'https://mxp.bio',
    featured: true,
  },
  {
    id: 'portfolio-site',
    titleKey: 'projects.portfolio-site.title',
    descriptionKey: 'projects.portfolio-site.description',
    longDescriptionKey: 'projects.portfolio-site.longDescription',
    technologies: ['Docker', 'TypeScript', 'Next.js', 'Unraid', 'Umami'],
    images: [
      '/images/portfolio/hero.png',
      '/images/portfolio/work.png',
      '/images/portfolio/about.png',
    ],
    previewImage: '/images/portfolio/preview.png',
    liveUrl: 'https://maximilianspitzer.de',
    featured: true,
  },
];
