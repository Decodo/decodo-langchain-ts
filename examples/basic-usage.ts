import dotenv from 'dotenv';
import { DecodoUniversalTool, DecodoGoogleSearchTool, DecodoAmazonSearchTool } from '../src';
import { decodoConfigFromEnv } from './config';

dotenv.config();

async function main() {
  const config = decodoConfigFromEnv();

  const scraperTool = new DecodoUniversalTool(config);

  const googleSearchTool = new DecodoGoogleSearchTool(config);

  const amazonSearchTool = new DecodoAmazonSearchTool(config);

  try {
    console.log('Basic url scraping:');
    const basicResult = await scraperTool.invoke({
      url: 'https://example.com',
      geo: 'United States',
      locale: 'en-US',
      markdown: true,
    });
    console.log(JSON.stringify(basicResult).length);

    console.log('Google Search:');
    const googleResults = await googleSearchTool.invoke({
      query: 'machine learning tutorials',
      geo: 'United States',
      locale: 'en-US',
    });
    console.log(JSON.stringify(googleResults).length);

    console.log('Amazon Search:');
    const amazonResults = await amazonSearchTool.invoke({
      query: 'machine learning tutorials',
    });
    console.log(JSON.stringify(amazonResults).length);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };
