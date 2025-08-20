import { ScraperApiResponse } from '@decodo/sdk-ts';

import { DecodoConfig } from '../../types';
import { DecodoBaseTool } from '../decodo-base-tool';
import { InputType } from '../../schema';

export class DecodoGoogleSearchTool extends DecodoBaseTool {
  public name = 'decodo_google_search';

  public description = "Search Google and retrieve structured results using Decodo's API";

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: InputType): Promise<ScraperApiResponse> {
    const toolParams = { ...params, target: 'google_search' };

    return this.callBase(toolParams);
  }
}
