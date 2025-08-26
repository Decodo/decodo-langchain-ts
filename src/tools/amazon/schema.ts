import z from 'zod';
import { TARGET } from '@decodo/sdk-ts';
import { inputSchema } from '../../schema';

export const amazonSearchInputSchema = inputSchema.extend({
  target: z.literal(TARGET.AMAZON_SEARCH),
  query: z.string(),
  url: z.never(),
});

export type AmazonSearchInputSchemaZodType = typeof amazonSearchInputSchema;

export type AmazonSearchInputType = z.infer<AmazonSearchInputSchemaZodType>;
