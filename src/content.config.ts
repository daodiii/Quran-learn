import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content Collections for Quranic Arabic Learning Platform
 *
 * Defines validated schemas for:
 * - lessons: 73 structured grammar lessons across 5 levels
 * - resources: Supplementary materials (glossary, study guides, etc.)
 */

const lessons = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    // Required fields
    title: z.string(),
    level: z.number().int().min(1).max(5),
    order: z.number().int().positive(),

    // Optional fields
    titleArabic: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),

    // Navigation overrides (computed automatically if not provided)
    prevLesson: z.string().optional(),
    nextLesson: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  lessons,
  resources,
};
