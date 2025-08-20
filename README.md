# Decodo LangChain Tools

A Node.js LangChain plugin that enables developers to use Decodo's Scraper API alongside their LangChain applications.

## Features

- **Web Scraping**: Scrape any URL and retrieve HTML content
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

```typescript
import { DecodoUniversalTool } from '@decodo/langchain-ts';

const scraperTool = new DecodoUniversalTool({
  username: 'web-advances-username',
  password: 'web-advances-password',
});

const agent = new Agent({
  tools: [scraperTool],
});
```

## Available Tools

See the `tools/` directory for a list of available tools.

## Examples

See the `exmaples/` to see tools in action.

## Configuration

All tools accept a `DecodoConfig` object:

```typescript
type DecodoConfig = {
  username: string; // Your Web Advanced product username
  password: string; // Your Web Advanced product password
};
```

## API Parameters

See the [Scraper API documentation](https://help.decodo.com/docs/web-scraping-api-parameters) for a list of available parameters

## License

MIT

## Support

For support, please visit [Decodo's documentation](https://help.decodo.com/) or open an issue on GitHub.
