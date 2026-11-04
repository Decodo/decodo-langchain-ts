import type { MapSiteResponse } from '@decodo/sdk-ts';
import { mapInputSchema, MapInputSchemaZodType, MapInputType } from '../../schema';
import { DecodoApiKeyConfig } from '../../types';
import { withDecodoErrors } from '../../client';
import { DecodoDataApiTool } from '../decodo-data-api-tool';
import { siteDiscoveryParams } from '../site-discovery-params';

const DEFAULT_LIMIT = 100;

export class DecodoMapTool extends DecodoDataApiTool<MapInputSchemaZodType> {
  public name = 'decodo_map';

  public description =
    "List the URLs on a website without fetching their content using Decodo's API. " +
    'Narrow large sites with selectPaths or excludePaths, then scrape only the pages you need with decodo_universal_tool.';

  public schema = mapInputSchema;

  constructor(config: DecodoApiKeyConfig) {
    super(config, 'DecodoMapTool');
  }

  async _call({ limit = DEFAULT_LIMIT, jsRender, ...input }: MapInputType): Promise<MapSiteResponse> {
    return withDecodoErrors(() =>
      this.client.map({
        ...siteDiscoveryParams(input),
        limit,
        ...(jsRender && { JS_rendering: jsRender }),
      })
    );
  }
}
