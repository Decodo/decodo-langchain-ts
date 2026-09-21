import type { WebScrapingApiConfig } from '@decodo/sdk-ts';
import { DecodoConfig } from './types';

export const resolveCredentials = (config: DecodoConfig): WebScrapingApiConfig => {
  const { username, password, apiKey } = config;

  if (apiKey && (username || password)) {
    throw new Error('Decodo config accepts either apiKey or username and password, not both.');
  }

  if (apiKey) {
    return { apiKey };
  }

  if (username && password) {
    return { token: Buffer.from(`${username}:${password}`).toString('base64') };
  }

  throw new Error('Decodo config requires either an apiKey or both a username and a password.');
};
