import { StructuredTool } from '@langchain/core/tools';
import { Target } from '@decodo/sdk-ts';
import type { ScrapeRequest, SyncResponse, WebScrapingApi } from '@decodo/sdk-ts';
import { inputSchema, InputSchemaZodType, InputType } from '../schema';
import { DecodoConfig } from '../types';
import { createWebScrapingApi, withDecodoErrors } from '../client';

export class DecodoBaseTool extends StructuredTool<InputSchemaZodType> {
  public name = 'decodo_tool';

  public description = "Scrape any URL and retrieve HTML content using Decodo's Scraper API";

  public schema = inputSchema;

  protected client: WebScrapingApi;

  constructor(config: DecodoConfig) {
    super();

    this.client = createWebScrapingApi(config);
  }

  paramsTransform = ({ target, url, query, parse, geo, jsRender, markdown }: InputType): ScrapeRequest => {
    return {
      target: target ?? Target.Universal,
      ...(url && { url }),
      ...(query && { query }),
      ...(parse && { parse }),
      ...(geo && { geo }),
      ...(jsRender && { headless: 'html' }),
      ...(markdown && { markdown }),
    } as ScrapeRequest;
  };

  async _call(_input: InputType): Promise<SyncResponse> {
    throw new Error(
      `_call cannot be called from DecodoBaseTool. Use one of the tool classes extending DecodoBaseTool instead.`
    );
  }

  async callBase(input: InputType): Promise<SyncResponse> {
    return withDecodoErrors(() => this.client.scrape(this.paramsTransform(input)));
  }
}
