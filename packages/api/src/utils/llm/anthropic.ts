interface AnthropicResponse {
  content: Array<{
    text: string;
  }>;
}

interface AnthropicRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: string;
    content: string;
  }>;
}

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL_VERSION = "2023-06-01";
const MODEL_NAME = "claude-3-5-haiku-latest";

/**
 * Anthropic API のリクエストボディを作成する
 * @param prompt プロンプト
 * @param apiKey Anthropic APIキー
 * @returns リクエストボディ
 */
function createRequest(prompt: string, apiKey: string): RequestInit {
  const requestBody: AnthropicRequest = {
    model: MODEL_NAME,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": MODEL_VERSION,
    },
    body: JSON.stringify(requestBody),
  };
}

/**
 * Anthropic API を呼び出す
 * @param prompt プロンプト
 * @param apiKey Anthropic APIキー
 * @returns レスポンスのテキスト
 */
export async function callAnthropic(
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    ANTHROPIC_API_URL,
    createRequest(prompt, apiKey)
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get response from Claude: ${response.statusText}`
    );
  }

  const data = (await response.json()) as AnthropicResponse;
  return data.content[0].text;
}
