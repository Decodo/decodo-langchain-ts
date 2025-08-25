import { ScraperApiResponse } from '@decodo/sdk-ts';
import { DecodoConfig } from '../../types';
import { InputType } from '../../schema';
import { DecodoBaseTool } from '../decodo-base-tool';

export class DecodoUniversalTool extends DecodoBaseTool {
  public name = 'decodo_universal_tool';

  public description = 'Universal tool for scraping URLs with Decodo Scraper API';

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: InputType): Promise<ScraperApiResponse> {
    return this.callBase(params);
  }
}
