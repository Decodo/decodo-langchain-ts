import { ScraperApiResponse, TARGET } from '@decodo/sdk-ts';

import { DecodoConfig } from '../../types';
import { DecodoBaseTool } from '../decodo-base-tool';
import { GoogleSearchInputType } from './schema';

export class DecodoGoogleSearchTool extends DecodoBaseTool {
  public name = 'decodo_google_search';

  public description = "Search Google and retrieve structured results using Decodo's API";

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: GoogleSearchInputType): Promise<ScraperApiResponse> {
    const toolParams = { ...params, target: TARGET.GOOGLE_SEARCH, parse: true, jsRender: false };

    return this.callBase(toolParams);
  }
}
