import dotenv from 'dotenv';
import { DecodoCrawlTool, DecodoMapTool, DecodoSearchTool } from '../src';
import type { DecodoCrawlResult, DecodoSearchResult, MapSiteResponse } from '../src';

dotenv.config();

async function main() {
  const config = { apiKey: process.env.SCRAPER_API_KEY! };

  const searchTool = new DecodoSearchTool(config);

  const mapTool = new DecodoMapTool(config);

  const crawlTool = new DecodoCrawlTool(config, { timeout: 300_000 });

  console.log('Web search:');
  const searchResults: DecodoSearchResult = await searchTool.invoke({
    query: 'langchain typescript',
    geo: 'United States',
  });
  console.log(searchResults.organic?.slice(0, 3));

  console.log('Map:');
  const mapResults: MapSiteResponse = await mapTool.invoke({ url: 'https://help.decodo.com', limit: 10 });
  console.log(mapResults.results[0].content.links);

  console.log('Crawl:');
  const crawlResults: DecodoCrawlResult = await crawlTool.invoke({ url: 'https://example.com', limit: 2 });
  console.log(
    crawlResults.status.status,
    crawlResults.pages.map(({ url, content }) => ({ url, length: content?.length }))
  );
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };
