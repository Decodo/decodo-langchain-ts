import type { CancelCrawlResponse } from '@decodo/sdk-ts';
import { crawlCancelInputSchema, CrawlCancelInputSchemaZodType, CrawlCancelInputType } from '../../schema';
import { DecodoApiKeyConfig } from '../../types';
import { withDecodoErrors } from '../../client';
import { DecodoDataApiTool } from '../decodo-data-api-tool';

export class DecodoCrawlCancelTool extends DecodoDataApiTool<CrawlCancelInputSchemaZodType> {
  public name = 'decodo_crawl_cancel';

  public description =
    "Stop a crawl that decodo_crawl stopped waiting for, so it crawls no more pages and stops using Decodo's API. " +
    'Use it with the crawl id from the decodo_crawl error.';

  public schema = crawlCancelInputSchema;

  constructor(config: DecodoApiKeyConfig) {
    super(config, 'DecodoCrawlCancelTool');
  }

  async _call({ crawlId }: CrawlCancelInputType): Promise<CancelCrawlResponse> {
    return withDecodoErrors(() => this.client.cancelCrawl(crawlId));
  }
}
