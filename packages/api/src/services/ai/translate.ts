import { callAnthropic } from "@/utils/llm";

/**
 * 日本語を英語に変換するプロンプトを作成する
 * @param text 日本語のテキスト
 * @returns プロンプト
 */
function createPrompt(text: string): string {
  return `以下の日本語「${text}」を英語に翻訳してください。

注意事項：
1. 英語訳のみを返してください
2. 余計な説明や文字は一切含めないでください
3. 改行は含めないでください`;
}

/**
 * 日本語を英語に変換する
 * @param text 日本語のテキスト
 * @param apiKey Anthropic APIキー
 * @returns 英語訳
 */
export async function translateToEnglish(
  text: string,
  apiKey: string
): Promise<string> {
  const prompt = createPrompt(text);
  return await callAnthropic(prompt, apiKey);
}
