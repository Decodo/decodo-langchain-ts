import z from 'zod';
import { Target } from '@decodo/sdk-ts';
import { inputSchema } from '../../schema';

export const amazonSearchInputSchema = inputSchema.extend({
  target: z.literal(Target.AmazonSearch),
  query: z.string(),
  url: z.never(),
});

export type AmazonSearchInputSchemaZodType = typeof amazonSearchInputSchema;

export type AmazonSearchInputType = z.infer<AmazonSearchInputSchemaZodType>;
