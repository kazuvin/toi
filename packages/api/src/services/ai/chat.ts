import { callAnthropic } from "@/utils/llm";
import { ChatRequest, ChatResponse } from "@toi/shared/src/schemas/ai/chat";

/**
 * AIとのチャットを行う
 * @param request チャットリクエスト
 * @param apiKey Anthropic APIキー
 * @returns チャットレスポンス
 */
export async function chatWithAI(
  request: ChatRequest,
  apiKey: string
): Promise<ChatResponse> {
  const prompt = `You are a native English speaker.

Your role is: ${request.aiRole}
The user's role is: ${request.userRole}
The conversation takes place in this situation: ${request.situation}

${
  request.messages.length === 0
    ? `Since this is the start of the conversation, initiate the dialogue naturally based on the situation. Make your first message welcoming and engaging, encouraging the user to respond. For example, if the situation is about a customer service scenario, you might start with "How can I help you today?" or "Welcome! What brings you in today?"`
    : `Previous conversation:
${request.messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}`
}

Be concise and maintain a natural conversational style in your responses. Keep the dialogue flowing naturally without unnecessary formality or wordiness.

IMPORTANT: Your response must be in the following JSON format:
{
  "role": "assistant",
  "content": "your response here",
  "translation": "your response translated to Japanese here"
}`;

  const response = await callAnthropic(prompt, apiKey);

  try {
    const parsedResponse = JSON.parse(response);
    return {
      role: "assistant",
      content: parsedResponse.content,
      translation: parsedResponse.translation,
    };
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}
