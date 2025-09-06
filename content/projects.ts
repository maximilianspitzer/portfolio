export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'Modern online shop with payment integration',
    longDescription: 'A comprehensive e-commerce solution built with Next.js, featuring product catalog, shopping cart, secure payment processing with Stripe, and admin dashboard for inventory management.',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'PostgreSQL'],
    images: ['/placeholder-project-1.jpg', '/placeholder-project-2.jpg'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/username/project',
    featured: true,
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'Collaborative project management tool',
    longDescription: 'A modern task management application with real-time collaboration features, drag-and-drop functionality, team workspaces, and progress tracking.',
    technologies: ['React', 'TypeScript', 'Socket.io', 'Node.js', 'MongoDB'],
    images: ['/placeholder-project-3.jpg', '/placeholder-project-4.jpg'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/username/project',
    featured: true,
  },
  {
    id: 'project-3',
    title: 'Portfolio Website',
    description: 'Responsive portfolio with CMS integration',
    longDescription: 'A clean and minimal portfolio website with headless CMS integration, optimized for performance and SEO, featuring a blog and project showcase.',
    technologies: ['Next.js', 'Sanity CMS', 'Tailwind CSS', 'Vercel'],
    images: ['/placeholder-project-5.jpg', '/placeholder-project-6.jpg'],
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    id: 'project-4',
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization platform',
    longDescription: 'An analytics dashboard for tracking business metrics with real-time data updates, interactive charts, and customizable widgets.',
    technologies: ['React', 'D3.js', 'Node.js', 'Redis', 'Chart.js'],
    images: ['/placeholder-project-7.jpg', '/placeholder-project-8.jpg'],
    githubUrl: 'https://github.com/username/project',
    featured: false,
  },
];