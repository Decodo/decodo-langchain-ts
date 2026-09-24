import dotenv from 'dotenv';
import { DecodoUniversalTool, DecodoGoogleSearchTool, DecodoAmazonSearchTool, DecodoRedditSubredditTool } from '../src';
import { decodoConfigFromEnv } from './config';

dotenv.config();

async function main() {
  const config = decodoConfigFromEnv();

  const scraperTool = new DecodoUniversalTool(config);

  const googleSearchTool = new DecodoGoogleSearchTool(config);

  const amazonSearchTool = new DecodoAmazonSearchTool(config);

  const redditTool = new DecodoRedditSubredditTool(config);

  try {
    console.log('Basic url scraping:');
    const basicResult = await scraperTool.invoke({
      url: 'https://example.com',
      geo: 'US',
      locale: 'en-US',
      headless: 'html',
      markdown: true,
    });
    console.log(JSON.stringify(basicResult).length);

    console.log('Google Search:');
    const googleResults = await googleSearchTool.invoke({
      query: 'machine learning tutorials',
      geo: 'US',
      locale: 'en-US',
    });
    console.log(JSON.stringify(googleResults).length);

    console.log('Amazon Search:');
    const amazonResults = await amazonSearchTool.invoke({
      query: 'machine learning tutorials',
    });
    console.log(JSON.stringify(amazonResults).length);

    console.log('Reddit Subreddit:');
    const redditResults = await redditTool.invoke({
      url: 'https://www.reddit.com/r/machinelearning',
    });
    console.log(JSON.stringify(redditResults).length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };
