import z from 'zod';
import { Target } from '@decodo/sdk-ts';
import { inputSchema } from '../../schema';

export const subredditInputSchema = inputSchema.extend({
  target: z.literal(Target.RedditSubreddit),
  url: z.string().describe('The URL of the subreddit to scrape. Must be provided.'),
  query: z.never(),
});

export type SubredditInputSchemaZodType = typeof subredditInputSchema;

export type SubredditInputType = z.infer<SubredditInputSchemaZodType>;
