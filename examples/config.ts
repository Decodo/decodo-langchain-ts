import type { DecodoConfig } from '../src';

export const decodoConfigFromEnv = (): DecodoConfig => {
  const apiKey = process.env.SCRAPER_API_KEY;

  if (apiKey) {
    return { apiKey };
  }

  return {
    username: process.env.SCRAPER_API_USERNAME!,
    password: process.env.SCRAPER_API_PASSWORD!,
  };
};
