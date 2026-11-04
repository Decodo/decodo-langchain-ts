import { StructuredTool } from '@langchain/core/tools';
import type { WebScrapingApi } from '@decodo/sdk-ts';
import { z } from 'zod';
import { DecodoApiKeyConfig } from '../types';
import { assertApiKeyConfig, createWebScrapingApi } from '../client';

export abstract class DecodoDataApiTool<SchemaT extends z.ZodObject<z.ZodRawShape>> extends StructuredTool<SchemaT> {
  protected client: WebScrapingApi;

  constructor(config: DecodoApiKeyConfig, toolClassName: string) {
    super();

    assertApiKeyConfig(config, toolClassName);
    this.client = createWebScrapingApi(config);
  }
}
