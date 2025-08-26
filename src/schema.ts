import { z } from 'zod';

export const inputSchema = z.object({
  target: z.string().optional(),
  url: z.string().optional().describe('URL to scrape.'),
  query: z.string().optional().describe('Query to input into target. Must be provided when target is provided.'),
  geo: z
    .string()
    .optional()
    .describe(
      'Set where to originate the scraping request from. When defined, must be a full country name. If target is amazon, must be 2 letter code'
    ),
  parse: z
    .boolean()
    .optional()
    .describe('When true, returns structured data. Can only be true when a target is provided.'),
  locale: z.string().optional(),
  jsRender: z
    .boolean()
    .optional()
    .describe('When true, enables javascript rendering. Should only be on when asked by the user.'),
  markdown: z.boolean().optional(),
});

export type InputSchemaZodType = typeof inputSchema;

export type InputType = z.infer<InputSchemaZodType>;
