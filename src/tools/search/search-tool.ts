import type { RunSearchResponse } from '@decodo/sdk-ts';
import { searchInputSchema, SearchInputSchemaZodType, SearchInputType } from '../../schema';
import { DecodoApiKeyConfig } from '../../types';
import { withDecodoErrors } from '../../client';
import { DecodoDataApiTool } from '../decodo-data-api-tool';

export type DecodoSearchResult = Exclude<RunSearchResponse, { status: 'failed' }>;

export class DecodoSearchTool extends DecodoDataApiTool<SearchInputSchemaZodType> {
  public name = 'decodo_search';

  public description =
    "Search the web and retrieve ranked results with title, link and description using Decodo's API. " +
    'To read a result, scrape its link with decodo_universal_tool.';

  public schema = searchInputSchema;

  constructor(config: DecodoApiKeyConfig) {
    super(config, 'DecodoSearchTool');
  }

  async _call(params: SearchInputType): Promise<DecodoSearchResult> {
    const response = await withDecodoErrors(() => this.client.search(params));

    if (response.status === 'failed') {
      throw new Error(`Decodo search failed: ${response.message}`, { cause: response });
    }

    return response;
  }
}
