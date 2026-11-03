import { DecodoClient, DecodoError } from '@decodo/sdk-ts';
import type { WebScrapingApi } from '@decodo/sdk-ts';
import { DecodoConfig } from './types';
import { resolveCredentials } from './auth';
import { INTEGRATION_HEADER } from './constants';

export const createWebScrapingApi = (config: DecodoConfig): WebScrapingApi => {
  const { webScrapingApi } = new DecodoClient({
    webScrapingApi: {
      ...resolveCredentials(config),
      integrationHeader: INTEGRATION_HEADER,
    },
  });

  return webScrapingApi;
};

export const assertApiKeyConfig = (config: DecodoConfig, toolName: string): void => {
  if (config.apiKey) {
    return;
  }

  if (config.username || config.password) {
    throw new Error(`${toolName} requires an apiKey. Username and password credentials cannot call it.`);
  }

  throw new Error(`${toolName} requires an apiKey, and none was given.`);
};

const describeError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return error instanceof DecodoError ? `Decodo API error: ${message}` : message;
};

export const withDecodoErrors = async <T>(call: () => Promise<T>): Promise<T> => {
  try {
    return await call();
  } catch (error) {
    if (error instanceof DecodoError) {
      throw new Error(describeError(error), { cause: error });
    }
    throw error;
  }
};
