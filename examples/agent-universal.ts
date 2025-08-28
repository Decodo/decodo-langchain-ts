import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { DecodoUniversalTool } from '../src';

dotenv.config();

const main = async () => {
  const username = process.env.SCRAPER_API_USERNAME!;
  const password = process.env.SCRAPER_API_PASSWORD!;

  const decodoUniversalTool = new DecodoUniversalTool({ username, password });

  const model = new ChatOpenAI({
    model: 'gpt-5-mini',
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
