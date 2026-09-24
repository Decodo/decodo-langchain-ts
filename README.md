# Decodo LangChain Tools

A Node.js LangChain plugin that enables developers to use Decodo's Scraper API alongside their LangChain applications.

## Features

- **Web Scraping**: Scrape any URL and retrieve Markdown content
- **Google Search**: Search Google and retrieve structured results
- **Amazon Search**: Search Amazon and retrieve structured product data
- **Reddit Scraping**: Scrape Reddit posts and subreddits
- **Full TypeScript Support**: Complete type definitions for all parameters
- **LangChain Integration**: Seamless integration with LangChain's Tool system

## Installation

```bash
npm install @decodo/langchain-ts
```

## Quick Start

Prerequisites:

- Node.js >= v20
- Decodo Web Advanced subscription

To use the tools in this project, you will need a [Decodo Advanced Web Scraping API](https://help.decodo.com/docs/web-scraping-api-core-and-advanced-plans) subscription. Free trials are available on the [dashboard](https://dashboard.decodo.com/).

Once you have a plan activated, take a note of either your API key or your generated username and password:

![Decodo dashboard](img/auth.png 'Decodo dashboard')

1. Clone this repo and install dependencies:

```
git clone git@github.com:Decodo/decodo-langchain-ts.git
cd decodo-langchain-ts
npm i
```

2. Copy `.env.example` to `.env` and fill in either `SCRAPER_API_KEY` or `SCRAPER_API_USERNAME` and `SCRAPER_API_PASSWORD`.

3. Run any of the sample agents:

```
npm run example:agent-universal
npm run example:agent-google
npm run example:agent-amazon
```

## Available Tools

See the `tools/` directory for a list of available tools.

## Examples

See the `examples/` directory to see tools in action.

## Configuration

All tools accept a `DecodoConfig` object holding either an API key or a username and password.

```typescript
type DecodoConfig =
  | {
      apiKey: string; // Your Web Advanced product API key
    }
  | {
      username: string; // Your Web Advanced product username
      password: string; // Your Web Advanced product password
    };
```

```typescript
const tool = new DecodoUniversalTool({ apiKey: process.env.SCRAPER_API_KEY! });

// or

const tool = new DecodoUniversalTool({
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
