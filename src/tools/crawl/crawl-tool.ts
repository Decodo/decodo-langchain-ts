import { TimeoutError } from '@decodo/sdk-ts';
import type { CrawlPage, GetCrawlStatusResponse } from '@decodo/sdk-ts';
import { crawlInputSchema, CrawlInputSchemaZodType, CrawlInputType } from '../../schema';
import { DecodoApiKeyConfig } from '../../types';
import { withDecodoErrors } from '../../client';
import { DecodoDataApiTool } from '../decodo-data-api-tool';
import { siteDiscoveryParams } from '../site-discovery-params';

const DEFAULT_LIMIT = 10;

const DEFAULT_POLL_INTERVAL_MS = 5_000;

const DEFAULT_TIMEOUT_MS = 600_000;

const MAX_DURATION_CEILING_S = 4 * 60 * 60;

const MAX_TIMER_MS = 2 ** 31 - 1;

export type DecodoCrawlToolOptions = {
  pollInterval?: number;
  timeout?: number;
};

export type DecodoCrawlStatus = Pick<
  GetCrawlStatusResponse,
  'status' | 'reason' | 'discovered' | 'completed' | 'failed'
>;

export type DecodoCrawlPage = Pick<CrawlPage, 'url' | 'content' | 'content_error'>;

export type DecodoCrawlResult = {
  status: DecodoCrawlStatus;
  pages: DecodoCrawlPage[];
};

const assertPositiveMs = (value: number, option: string) => {
  if (!Number.isFinite(value) || value <= 0 || value > MAX_TIMER_MS) {
    throw new Error(
      `DecodoCrawlTool ${option} must be a positive number of milliseconds up to ${MAX_TIMER_MS}, got ${value}.`
    );
  }
};

const toAgentStatus = ({
  status,
  reason,
  discovered,
  completed,
  failed,
}: GetCrawlStatusResponse): DecodoCrawlStatus => ({
  status,
  ...(reason && { reason }),
  discovered,
  completed,
  failed,
});

const toAgentPage = ({ url, content, content_error }: CrawlPage): DecodoCrawlPage => ({
  url,
  ...(content !== undefined && { content }),
  ...(content_error && { content_error }),
});

export class DecodoCrawlTool extends DecodoDataApiTool<CrawlInputSchemaZodType> {
  public name = 'decodo_crawl';

  public description =
    "Crawl a website from a start URL and retrieve the content of every page found using Decodo's API. " +
    'Waits until the crawl finishes. Check status.status in the result: anything other than "done" means ' +
    'the crawl stopped early and pages holds only what was collected. ' +
    'To list a site without fetching content, use decodo_map instead.';

  public schema = crawlInputSchema;

  protected pollInterval: number;

  protected timeout: number;

  protected maxDuration: number | undefined;

  constructor(
    config: DecodoApiKeyConfig,
    { pollInterval = DEFAULT_POLL_INTERVAL_MS, timeout = DEFAULT_TIMEOUT_MS }: DecodoCrawlToolOptions = {}
  ) {
    super(config, 'DecodoCrawlTool');

    assertPositiveMs(pollInterval, 'pollInterval');
    assertPositiveMs(timeout, 'timeout');
    this.pollInterval = pollInterval;
    this.timeout = timeout;
    const timeoutS = Math.ceil(timeout / 1000);
    this.maxDuration = timeoutS <= MAX_DURATION_CEILING_S ? timeoutS : undefined;
  }

  async _call({
    limit = DEFAULT_LIMIT,
    maxDepth,
    output = 'markdown',
    ...input
  }: CrawlInputType): Promise<DecodoCrawlResult> {
    const params = {
      ...siteDiscoveryParams(input),
      limit,
      output,
      ...(maxDepth !== undefined && { max_depth: maxDepth }),
      ...(this.maxDuration !== undefined && { max_duration: this.maxDuration }),
    };

    try {
      const { status, pages } = await withDecodoErrors(() =>
        this.client.crawl(params, { pollInterval: this.pollInterval, timeout: this.timeout })
      );

      return { status: toAgentStatus(status), pages: pages.map(toAgentPage) };
    } catch (error) {
      throw this.rewordCrawlTimeout(error);
    }
  }

  private rewordCrawlTimeout(error: unknown): unknown {
    const crawlId = error instanceof TimeoutError ? /^Crawl (\S+) did not settle/.exec(error.message)?.[1] : undefined;

    if (!crawlId) {
      return error;
    }

    const next =
      this.maxDuration !== undefined
        ? 'Decodo stops it at the same limit, so it ends shortly as truncated; its pages are not returned.'
        : "It is still running on Decodo's side; stop it with decodo_crawl_cancel.";

    return new TimeoutError(`Crawl ${crawlId} did not finish within ${this.timeout / 1000}s. ${next}`);
  }
}
