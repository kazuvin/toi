import {
  PostRecommendBody,
  RecommendResponse,
} from "@parrot-buddy/shared/src/schemas/ai/recommend";
import { callAnthropic } from "@/utils/llm";

export async function getRecommendations(
  body: PostRecommendBody,
  apiKey: string
): Promise<RecommendResponse> {
  const prompt = `You are a helpful English conversation assistant. Please provide 3 natural and appropriate responses that the user could say based on the following conversation context.

Your role is: ${body.aiRole}
The user's role is: ${body.userRole}
The conversation takes place in this situation: ${body.situation}
Learning content: ${body.learningContent}

Previous conversation:
${body.messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Please provide 3 natural and appropriate responses that the user could say in this conversation. Each response should:
1. Be appropriate for the user's role and the conversation context
2. Show natural engagement with the AI's previous messages
3. Help maintain a natural conversation flow

For each response, provide both the English version and its Japanese translation.

IMPORTANT: Your response must be in the following JSON format:
[
  {
    "en": "your response here",
    "ja": "your response translated to Japanese here"
  }
]`;

  const response = await callAnthropic(prompt, apiKey);

  const recommendations = JSON.parse(response);

  return {
    recommendations,
  };
}
