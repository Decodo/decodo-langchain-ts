import { StructuredTool } from '@langchain/core/tools';
import { DecodoClient, DecodoError, Target } from '@decodo/sdk-ts';
import type { ScrapeRequest, SyncResponse, WebScrapingApi } from '@decodo/sdk-ts';
import { inputSchema, InputSchemaZodType, InputType } from '../schema';
import { DecodoConfig } from '../types';
import { resolveCredentials } from '../auth';
import { INTEGRATION_HEADER } from '../constants';

export class DecodoBaseTool extends StructuredTool<InputSchemaZodType> {
  public name = 'decodo_tool';

  public description = "Scrape any URL and retrieve HTML content using Decodo's Scraper API";

  public schema = inputSchema;

  protected client: WebScrapingApi;

  constructor(config: DecodoConfig) {
    super();

    const { webScrapingApi } = new DecodoClient({
      webScrapingApi: {
        ...resolveCredentials(config),
        integrationHeader: INTEGRATION_HEADER,
      },
    });

    this.client = webScrapingApi;
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
    try {
      return await this.client.scrape(this.paramsTransform(input));
    } catch (error) {
      if (error instanceof DecodoError) {
        throw new Error(`Decodo API error: ${error.message}`);
      }
      throw error;
    }
  }
}
