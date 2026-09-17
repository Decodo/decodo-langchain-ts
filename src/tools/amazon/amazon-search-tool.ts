import { Target } from '@decodo/sdk-ts';
import type { SyncResponse } from '@decodo/sdk-ts';
import { DecodoConfig } from '../../types';
import { DecodoBaseTool } from '../decodo-base-tool';
import { AmazonSearchInputType } from './schema';

export class DecodoAmazonSearchTool extends DecodoBaseTool {
  public name = 'decodo_amazon_search';

  public description = "Search Amazon and retrieve structured product data using Decodo's API";

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: AmazonSearchInputType): Promise<SyncResponse> {
    const toolParams = { ...params, target: Target.AmazonSearch, parse: true, jsRender: false };

    return this.callBase(toolParams);
  }
}
