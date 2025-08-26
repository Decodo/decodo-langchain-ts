import axios, { AxiosInstance } from 'axios';
import { StructuredTool } from '@langchain/core/tools';
import { SCRAPER_API_ENDPOINT_SYNC, ScraperApiResponse } from '@decodo/sdk-ts';

import { inputSchema, InputSchemaZodType, InputType } from '../schema';
import { DecodoConfig } from '../types';

export class DecodoBaseTool extends StructuredTool<InputSchemaZodType> {
  public name = 'decodo_tool';

  public description = "Scrape any URL and retrieve HTML content using Decodo's Scraper API";

  public schema = inputSchema;

  protected client: AxiosInstance;

  constructor({ username, password }: DecodoConfig) {
    super();

    this.client = axios.create({
      baseURL: SCRAPER_API_ENDPOINT_SYNC,
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  paramsTransform = ({ target, url, query, parse, geo, jsRender, markdown }: InputType) => {
    return {
      ...(target && { target }),
      ...(url && { url }),
      ...(query && { query }),
      ...(parse && { parse }),
      ...(geo && { geo }),
      ...(jsRender && { headless: 'html' }),
      ...(markdown && { markdown }),
    };
  };

  async _call(_input: InputType): Promise<ScraperApiResponse> {
    throw new Error(
      `_call cannot be called from DecodoBaseTool. Use one of the tool classes extending DecodoBaseTool instead.`
    );
  }

  async callBase(input: InputType): Promise<ScraperApiResponse> {
    try {
      const data = this.paramsTransform(input);

      const response = await this.client.request<ScraperApiResponse>({
        method: 'POST',
        data,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(input);
        throw new Error(`Decodo API error: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }
}
