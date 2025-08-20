import { ScraperApiResponse } from '@decodo/sdk-ts';

import { DecodoConfig } from '../../types';
import { DecodoBaseTool } from '../decodo-base-tool';
import { InputType } from '../../schema';

export class DecodoAmazonSearchTool extends DecodoBaseTool {
  public name = 'decodo_amazon_search';

  public description = "Search Amazon and retrieve structured product data using Decodo's API";

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: InputType): Promise<ScraperApiResponse> {
    const toolParams = { ...params, target: 'amazon_search' };

    return this.callBase(toolParams);
  }
}
