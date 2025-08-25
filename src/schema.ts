import { z } from 'zod';

export const inputSchema = z.object({
  target: z.string().optional(),
  url: z.string().optional(),
  query: z.string().optional(),
  geo: z.string().optional(),
  locale: z.string().optional(),
  headless: z.enum(['html']).optional(),
  markdown: z.boolean().optional(),
});

export type InputSchemaZodType = typeof inputSchema;

export type InputType = z.infer<InputSchemaZodType>;
