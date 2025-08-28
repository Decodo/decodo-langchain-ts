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

To use the tools in this project, you will need a [Decodo Advanced Web Scraping API](https://help.decodo.com/docs/web-scraping-api-core-and-advanced-plans) subscription. Free trials are available on the [dashboard](https://dashboard.decodo.com/).

Once you have a plan activated, take a note of your generated username and password:

![Decodo dashboard](img/auth.png 'Decodo dashboard')

A simple agentic example:

```typescript
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { DecodoUniversalTool } from '@decodo/langchain-ts';

dotenv.config();

const main = async () => {
  const username = process.env.SCRAPER_API_USERNAME!;
  const password = process.env.SCRAPER_API_PASSWORD!;

  const decodoUniversalTool = new DecodoUniversalTool({ username, password });

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
  });

  const agent = createReactAgent({
    llm: model,
    tools: [decodoUniversalTool],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: 'user',
        content: 'scrape the wikipedia NBA 2025 season page and tell me who won in 2025?',
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
};

if (require.main === module) {
  main();
}
```

## Available Tools

See the `tools/` directory for a list of available tools.

## Examples

See the `examples/` directory to see tools in action.

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
