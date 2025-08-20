import axios, { AxiosInstance } from 'axios';
import { StructuredTool } from '@langchain/core/tools';
import { ScraperApiResponse } from '@decodo/sdk-ts';

import { inputSchema, InputSchemaZodType, InputType } from '../schema';
import { DecodoConfig } from '../types';
import { API_URL } from '../constants';

export class DecodoBaseTool extends StructuredTool<InputSchemaZodType> {
  public name = 'decodo_tool';

  public description = "Scrape any URL and retrieve HTML content using Decodo's Scraper API";

  public schema = inputSchema;

  protected client: AxiosInstance;

  constructor({ username, password }: DecodoConfig) {
    super();

    this.client = axios.create({
      baseURL: API_URL,
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async _call(_input: InputType): Promise<ScraperApiResponse> {
    throw new Error(
      `_call cannot be called from DecodoBaseTool. Use one of the tool classes extending DecodoBaseTool instead.`
    );
  }

  async callBase(input: InputType): Promise<ScraperApiResponse> {
    try {
      const { target, url, query, geo } = input;

      const response = await this.client.request<ScraperApiResponse>({
        method: 'POST',
        data: {
          ...(target && { target }),
          ...(url && { url }),
          ...(query && { query }),
          ...(geo && { geo }),
        },
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
