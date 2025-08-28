import z from 'zod';
import { TARGET } from '@decodo/sdk-ts';
import { inputSchema } from '../../schema';

export const googleSearchInputSchema = inputSchema.extend({
  target: z.literal(TARGET.GOOGLE_SEARCH),
  query: z.string(),
  url: z.never(),
});

export type GoogleSearchInputSchemaZodType = typeof googleSearchInputSchema;

export type GoogleSearchInputType = z.infer<GoogleSearchInputSchemaZodType>;
