import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { DecodoGoogleSearchTool } from '../src';

dotenv.config();

const main = async () => {
  const username = process.env.SCRAPER_API_USERNAME!;
  const password = process.env.SCRAPER_API_PASSWORD!;

  const decodoGoogleSearchTool = new DecodoGoogleSearchTool({ username, password });

  const model = new ChatOpenAI({
    model: 'gpt-5-mini',
  });

  const agent = createReactAgent({
    llm: model,
    tools: [decodoGoogleSearchTool],
  });

  const prompt = 'what appears first on Google search for "pizza place in Berlin"?';

  console.log(prompt);

  const result = await agent.invoke({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
};

if (require.main === module) {
  main();
}
