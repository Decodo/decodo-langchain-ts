import { Target } from '@decodo/sdk-ts';
import type { SyncResponse } from '@decodo/sdk-ts';
import { DecodoConfig } from '../../types';
import { SubredditInputType } from './schema';
import { DecodoBaseTool } from '../decodo-base-tool';

export class DecodoRedditSubredditTool extends DecodoBaseTool {
  public name = 'decodo_reddit_subreddit';

  public description = "Scrape Reddit posts and subreddits using Decodo's API";

  constructor(config: DecodoConfig) {
    super(config);
  }

  async _call(params: SubredditInputType): Promise<SyncResponse> {
    const toolParams = { ...params, target: Target.RedditSubreddit, parse: false };

    return this.callBase(toolParams);
  }
}
