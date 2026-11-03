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

const MAP_LIMIT_MAX = 500;

const CRAWL_LIMIT_MAX = 100;

const CRAWL_MAX_DEPTH_MAX = 10_000;

const geo = z
  .string()
  .optional()
  .describe('Country to send the request from, as a full name, for example "United States".');

const locale = z.string().optional().describe('Interface language, for example "en-US".');

const pathPatterns = (effect: string) =>
  z.array(z.string()).optional().describe(`Regular expressions matched against URL paths. ${effect}`);

export const siteDiscoverySchema = z.object({
  url: z.string().describe('Absolute http or https URL of the site to start from.'),
  sitemap: z
    .enum(['include', 'only', 'skip'])
    .optional()
    .describe("Whether to use the site's sitemap alongside its links, only the sitemap, or skip it."),
  domainFilter: z
    .enum(['domain', 'subdomain', 'all'])
    .optional()
    .describe('Which hosts count as part of the site: the same domain, its subdomains too, or any host.'),
  selectPaths: pathPatterns('Only URLs matching one of them are kept.'),
  excludePaths: pathPatterns('URLs matching one of them are dropped.'),
  geo,
  locale,
});

export const searchInputSchema = z.object({
  query: z.string().describe('Search query.'),
  geo,
  locale,
  page: z.number().int().min(1).optional().describe('Results page to return, 1 by default.'),
});

export type SearchInputSchemaZodType = typeof searchInputSchema;

export type SearchInputType = z.infer<SearchInputSchemaZodType>;

export const mapInputSchema = siteDiscoverySchema.extend({
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAP_LIMIT_MAX)
    .optional()
    .describe(`Maximum number of URLs to return, up to ${MAP_LIMIT_MAX}. Defaults to 100.`),
  jsRender: z
    .boolean()
    .optional()
    .describe('When true, renders pages with JavaScript to find links. Should only be on when asked by the user.'),
});

export type MapInputSchemaZodType = typeof mapInputSchema;

export type MapInputType = z.infer<MapInputSchemaZodType>;

export const crawlInputSchema = siteDiscoverySchema.extend({
  limit: z
    .number()
    .int()
    .min(1)
    .max(CRAWL_LIMIT_MAX)
    .optional()
    .describe(`Maximum number of pages to crawl, up to ${CRAWL_LIMIT_MAX}. Defaults to 10.`),
  maxDepth: z
    .number()
    .int()
    .min(1)
    .max(CRAWL_MAX_DEPTH_MAX)
    .optional()
    .describe('How many links deep to follow from the start URL.'),
  output: z.enum(['markdown', 'html']).optional().describe('Format of the page content. Defaults to markdown.'),
});

export type CrawlInputSchemaZodType = typeof crawlInputSchema;

export type CrawlInputType = z.infer<CrawlInputSchemaZodType>;

export type SiteDiscoveryInputType = z.infer<typeof siteDiscoverySchema>;

export const crawlCancelInputSchema = z.object({
  crawlId: z.string().describe('Id of the crawl to stop, as given in a decodo_crawl error.'),
});

export type CrawlCancelInputSchemaZodType = typeof crawlCancelInputSchema;

export type CrawlCancelInputType = z.infer<CrawlCancelInputSchemaZodType>;
