import { ScraperApiResponse } from '@decodo/sdk-ts';

import { DecodoConfig } from '../../types';
import { InputType } from '../../schema';
import { DecodoBaseTool } from '../decodo-base-tool';

export class DecodoRedditTool extends DecodoBaseTool {
  public name = 'decodo_reddit_subreddit';

  public description = "Scrape Reddit posts and subreddits using Decodo's API";

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: InputType): Promise<ScraperApiResponse> {
    const toolParams = { ...params, target: 'reddit_subreddit' };

    return this.callBase(toolParams);
  }
}
