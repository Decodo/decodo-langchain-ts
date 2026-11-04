# Decodo LangChain Tools

A Node.js LangChain plugin that enables developers to use Decodo's Web Data API alongside their LangChain applications.

## Features

- **Web Scraping**: Scrape any URL and retrieve Markdown content
- **Google Search**: Search Google and retrieve structured results
- **Amazon Search**: Search Amazon and retrieve structured product data
- **Reddit Scraping**: Scrape Reddit posts and subreddits
- **Web Search**: Search the web and retrieve ranked results
- **Site Mapping**: List the URLs on a website without fetching their content
- **Crawling**: Crawl a website and retrieve the content of every page found
- **Full TypeScript Support**: Complete type definitions for all parameters
- **LangChain Integration**: Seamless integration with LangChain's Tool system

## Installation

```bash
npm install @decodo/langchain-ts
```

## Quick Start

Prerequisites:

- Node.js >= v20
- Decodo Web Data API subscription

To use the tools in this project, you will need a Decodo Web Data API subscription. Free trials are available on the [dashboard](https://dashboard.decodo.com/).

Once you have a plan activated, copy your API key from the [Web Data API playground](https://dashboard.decodo.com/web-data/playground). Older plans only have a generated username and password, which also work:

![Decodo dashboard](img/auth.png 'Decodo dashboard')

1. Clone this repo and install dependencies:

```
git clone git@github.com:Decodo/decodo-langchain-ts.git
cd decodo-langchain-ts
npm i
```

2. Copy `.env.example` to `.env` and fill in `SCRAPER_API_KEY`. On an older plan, fill in `SCRAPER_API_USERNAME` and `SCRAPER_API_PASSWORD` instead. The sample agents also need `OPENAI_API_KEY`.

3. Run any of the samples:

```
npm run example                  # scrape, Google, Amazon and Reddit tools without an agent
npm run example:data-api         # search, map and crawl tools without an agent (API key only)
npm run example:agent-universal
npm run example:agent-google
npm run example:agent-amazon
npm run example:agent-web        # search, map and crawl in an agent (API key only)
```

## Available Tools

| Tool                        | Name                      | What it does                                                         |
| --------------------------- | ------------------------- | -------------------------------------------------------------------- |
| `DecodoUniversalTool`       | `decodo_universal_tool`   | Scrapes any URL and returns Markdown                                 |
| `DecodoGoogleSearchTool`    | `decodo_google_search`    | Searches Google and returns structured results                       |
| `DecodoAmazonSearchTool`    | `decodo_amazon_search`    | Searches Amazon and returns structured product data                  |
| `DecodoRedditSubredditTool` | `decodo_reddit_subreddit` | Scrapes a subreddit                                                  |
| `DecodoSearchTool`          | `decodo_search`           | Searches the web and returns ranked results                          |
| `DecodoMapTool`             | `decodo_map`              | Lists the URLs on a website, 100 by default and up to 500            |
| `DecodoCrawlTool`           | `decodo_crawl`            | Crawls a website and returns every page, 10 by default and up to 100 |
| `DecodoCrawlCancelTool`     | `decodo_crawl_cancel`     | Stops a running crawl                                                |

`DecodoSearchTool`, `DecodoMapTool`, `DecodoCrawlTool` and `DecodoCrawlCancelTool` require an API key. Their constructors only accept `{ apiKey }`, and they throw when given a username and password.

`DecodoCrawlTool` waits until the crawl finishes. It returns the crawl's `status`, `reason` and `discovered`, `completed` and `failed` page counts, and each page's `url` and `content`, or `content_error` when a page failed. A crawl that ends `faulted`, `cancelled` or `truncated` still returns the pages collected so far, so check `status.status`. By default the tool checks the crawl every 5 seconds and waits up to 10 minutes for it to finish. Fetching the pages of a finished crawl comes on top of that. Pass `pollInterval` and `timeout` in milliseconds to change either:

```typescript
import { DecodoCrawlTool } from '@decodo/langchain-ts';

const crawlTool = new DecodoCrawlTool({ apiKey: process.env.SCRAPER_API_KEY! }, { timeout: 300_000 });
```

The tool sends its timeout to Decodo as the crawl's `max_duration`, so a crawl the tool stops waiting for is stopped on Decodo's side at the same limit, and the tool's error says so. Decodo rejects a `max_duration` above 4 hours, so a longer `timeout` leaves the server default in place.

If a `timeout` above 4 hours runs out, the crawl keeps running on Decodo's side. The error carries the crawl id, so register `DecodoCrawlCancelTool` alongside `DecodoCrawlTool` to let the agent stop it.

API errors are rethrown as `Error('Decodo API error: ...')` with the SDK's error as `cause`, so its `statusCode` is still available. A crawl timeout is a `TimeoutError`, which this package re-exports from the SDK so you can check it with `instanceof`. A search the API reports as failed throws `Decodo search failed: ...` with the failed response, including its `status_code`, as `cause`.

## Examples

See the `examples/` directory to see tools in action.

## Configuration

The scrape tools (`DecodoUniversalTool`, `DecodoGoogleSearchTool`, `DecodoAmazonSearchTool` and `DecodoRedditSubredditTool`) accept a `DecodoConfig` object holding either an API key (recommended) or, for older plans, a username and password. Passing both throws an error. The search, map and crawl tools accept only an API key.

```typescript
type DecodoConfig =
  | {
      apiKey: string; // Your Web Data API key
    }
  | {
      username: string; // Your Web Advanced product username
      password: string; // Your Web Advanced product password
    };
```

```typescript
import { DecodoUniversalTool } from '@decodo/langchain-ts';

const tool = new DecodoUniversalTool({ apiKey: process.env.SCRAPER_API_KEY! });

// or, on an older plan

const legacyTool = new DecodoUniversalTool({
  username: process.env.SCRAPER_API_USERNAME!,
  password: process.env.SCRAPER_API_PASSWORD!,
});
```

## API Parameters

See the [Scraper API documentation](https://help.decodo.com/docs/web-scraping-api-parameters) for a list of available parameters.

## License

MIT

## Support

For support, please visit [Decodo's documentation](https://help.decodo.com/) or open an issue on GitHub.
