import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(5),
    excerpt: z.string().min(10),
    published: z.boolean().default(false),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      'ASP.NET Core',
      'Architecture',
      'Distributed Systems',
      'Databases',
      'Angular',
      'Engineering Notes'
    ]),
    tags: z.array(z.string()).min(1),
    cover: z.string().startsWith('/images/blog/'),
    coverAlt: z.string().min(5),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional()
  }).refine((data) => {
    if (data.updatedDate && data.pubDate) {
      return data.updatedDate >= data.pubDate;
    }
    return true;
  }, {
    message: 'updatedDate must be >= pubDate',
    path: ['updatedDate']
  })
});

export const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(3),
    summary: z.string().min(10),
    featured: z.boolean().default(false),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    category: z.enum(['Full Stack', 'Backend & Systems', 'Architecture & ERP']).default('Full Stack'),
    technologies: z.array(z.string()).min(1),
    cover: z.string().startsWith('/images/projects/'),
    coverAlt: z.string().min(5),
    repositoryUrl: z.string().url().optional(),
    frontendRepositoryUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    role: z.string().default('Lead Engineer / Full Stack Developer'),
    timeline: z.string().optional()
  })
});

export const collections = { blog, projects };

