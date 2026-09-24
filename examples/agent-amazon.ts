import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { DecodoAmazonSearchTool } from '../src';
import { decodoConfigFromEnv } from './config';

dotenv.config();

const main = async () => {
  const decodoAmazonSearchTool = new DecodoAmazonSearchTool(decodoConfigFromEnv());

  const model = new ChatOpenAI({
    model: 'gpt-5-mini',
  });

  const agent = createReactAgent({
    llm: model,
    tools: [decodoAmazonSearchTool],
  });

  const prompt = 'What is the cheapest laptop with a GeForce RTX 5080 on Amazon in France?';

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
