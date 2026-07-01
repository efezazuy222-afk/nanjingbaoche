import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    cover: z.string(),
    date: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    readTime: z.number(),
    description: z.string(),
  }),
});

const tours = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/tours" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    cover: z.string(),
    duration: z.string(),
    location: z.string(),
    group: z.string(),
    highlights: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, tours };
