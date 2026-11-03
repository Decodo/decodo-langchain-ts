import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { DecodoCrawlCancelTool, DecodoCrawlTool, DecodoMapTool, DecodoSearchTool, DecodoUniversalTool } from '../src';

dotenv.config();

const main = async () => {
  const config = { apiKey: process.env.SCRAPER_API_KEY! };

  const model = new ChatOpenAI({
    model: 'gpt-5-mini',
  });

  const agent = createReactAgent({
    llm: model,
    tools: [
      new DecodoSearchTool(config),
      new DecodoMapTool(config),
      new DecodoCrawlTool(config),
      new DecodoCrawlCancelTool(config),
      new DecodoUniversalTool(config),
    ],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: 'user',
        content:
          'Find the official LangChain.js documentation site, map it to find the pages about tools, ' +
          'and summarise how to define a custom tool.',
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
};

if (require.main === module) {
  main().catch(console.error);
}
